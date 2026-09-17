import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, PieChart, Layers, CheckCircle2, RotateCcw } from 'lucide-react';

const DEFAULT_PALETTE = [
  '#EF4444', // Pure Red
  '#10B981', // Pure Emerald Green
  '#2563EB', // Pure Electric Blue
  '#F59E0B', // Pure Gold Yellow
  '#8B5CF6', // Pure Violet Purple
  '#EC4899', // Pure Pink
  '#06B6D4', // Pure Cyan
  '#F97316', // Pure Orange
];

export default function PolarAreaChart({ initialData = [], availableFields = [] }) {
  // Active fields displayed in chart
  const [fields, setFields] = useState(initialData);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customLabel, setCustomLabel] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [customColor, setCustomColor] = useState('#8B5CF6');

  // Sync initialData if updated from props/backend
  const currentDataKey = initialData.map(d => `${d.id}:${d.value}`).join(',');
  const [prevDataKey, setPrevDataKey] = useState(currentDataKey);

  if (currentDataKey !== prevDataKey) {
    setPrevDataKey(currentDataKey);
    setFields(initialData);
  }

  // Toggle field visibility
  const toggleField = (id) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, hidden: !f.hidden } : f));
  };

  // Remove field
  const removeField = (id) => {
    setFields(prev => prev.filter(f => f.id !== id));
  };

  // Add field from preset
  const handleAddPreset = (fieldPreset) => {
    if (fields.some(f => f.id === fieldPreset.id)) {
      setFields(prev => prev.map(f => f.id === fieldPreset.id ? { ...f, hidden: false } : f));
    } else {
      setFields(prev => [...prev, { ...fieldPreset, hidden: false }]);
    }
    setIsModalOpen(false);
  };

  // Add custom field
  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customLabel.trim()) return;
    const newField = {
      id: `custom_${Date.now()}`,
      label: customLabel.trim(),
      value: Math.max(0, parseInt(customValue) || 0),
      color: customColor || DEFAULT_PALETTE[fields.length % DEFAULT_PALETTE.length],
      hidden: false,
    };
    setFields(prev => [...prev, newField]);
    setCustomLabel('');
    setCustomValue('');
    setIsModalOpen(false);
  };

  // Reset to initial backend fields
  const handleReset = () => {
    setFields(initialData);
  };

  // Filter visible fields
  const visibleFields = fields.filter(f => !f.hidden);
  const N = visibleFields.length;
  const totalValue = visibleFields.reduce((sum, f) => sum + (f.value || 0), 0);
  const maxVal = Math.max(...visibleFields.map(f => f.value || 0), 10);

  // ENLARGED CHART DIMENSIONS (800x800 Canvas with maxR = 275)
  const viewBoxSize = 800;
  const cx = 400;
  const cy = 400;
  const maxR = 275; // Significantly enlarged chart wheel radius
  const minR = 50;  // Slightly larger center ring for better visibility
  const ringCount = 5;

  const rings = Array.from({ length: ringCount }, (_, i) => {
    const stepRatio = (i + 1) / ringCount;
    const r = minR + stepRatio * (maxR - minR);
    const val = Math.round(stepRatio * maxVal);
    return { r, val };
  });

  // Calculate SVG arc paths & Directional Outer Callouts
  const angleStep = N > 0 ? (360 / N) : 0;
  const startAngleOffset = -90; // Start top 12 o'clock

  const slices = visibleFields.map((field, idx) => {
    const a1 = startAngleOffset + idx * angleStep;
    const a2 = startAngleOffset + (idx + 1) * angleStep;

    const rad1 = (a1 * Math.PI) / 180;
    const rad2 = (a2 * Math.PI) / 180;

    const ratio = maxVal > 0 ? (field.value || 0) / maxVal : 0;
    // Ensure minimum radius for visual presence even if value is 0
    const r = Math.max(minR + 10, minR + ratio * (maxR - minR));

    const x1 = cx + r * Math.cos(rad1);
    const y1 = cy + r * Math.sin(rad1);
    const x2 = cx + r * Math.cos(rad2);
    const y2 = cy + r * Math.sin(rad2);

    const largeArc = angleStep > 180 ? 1 : 0;
    const pathData = `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;

    const percent = totalValue > 0 ? (((field.value || 0) / totalValue) * 100).toFixed(1) : '0.0';

    // Directional Pointer Line in exact angle corner of this sector
    const midAngleDeg = (a1 + a2) / 2;
    const midAngleRad = (midAngleDeg * Math.PI) / 180;

    const cosM = Math.cos(midAngleRad);
    const sinM = Math.sin(midAngleRad);

    // Pin dot on sector outer arc edge
    const arcMidX = cx + r * cosM;
    const arcMidY = cy + r * sinM;

    // Line projects 65px outward beyond the sector arc
    const lineLen = 65;
    const popX = cx + (r + lineLen) * cosM;
    const popY = cy + (r + lineLen) * sinM;

    const popLeftPct = (popX / viewBoxSize) * 100;
    const popTopPct = (popY / viewBoxSize) * 100;

    // Transform offsets for corner positioning
    let transformClass = '';
    if (cosM >= 0.15) {
      transformClass += 'translate-x-0 ';
    } else if (cosM <= -0.15) {
      transformClass += '-translate-x-full ';
    } else {
      transformClass += '-translate-x-1/2 ';
    }

    if (sinM >= 0.15) {
      transformClass += 'translate-y-0';
    } else if (sinM <= -0.15) {
      transformClass += '-translate-y-full';
    } else {
      transformClass += '-translate-y-1/2';
    }

    return {
      ...field,
      idx,
      a1,
      a2,
      r,
      pathData,
      percent,
      arcMidX,
      arcMidY,
      popX,
      popY,
      popLeftPct,
      popTopPct,
      transformClass,
    };
  });

  return (
    <div className="bg-white rounded-3xl border border-purple-50 shadow-[0_12px_40px_rgba(99,102,241,0.08)] p-6 md:p-10 flex flex-col justify-between">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-5 border-b border-purple-50">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-50 text-[#8B5CF6]">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl tracking-tight">Requested Analytics Polar Chart</h3>
              <p className="text-xs text-gray-500 font-normal mt-0.5">
                Real-time backend distribution across requested metrics
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            title="Reset to default backend metrics"
            className="p-2.5 rounded-2xl border border-purple-100 text-gray-600 hover:text-[#8B5CF6] hover:bg-purple-50 transition-all text-xs font-semibold flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all shadow-md shadow-purple-200"
          >
            <Plus className="w-4.5 h-4.5" />
            Add Requested Field
          </button>
        </div>
      </div>

      {/* Interactive Legend (Top) */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8 px-2">
        {fields.map((field) => (
          <div
            key={field.id}
            onClick={() => toggleField(field.id)}
            style={{
              borderColor: field.hidden ? '#E5E7EB' : `${field.color}40`,
            }}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition-all border ${
              field.hidden
                ? 'opacity-40 bg-gray-50 text-gray-400 line-through'
                : 'bg-white text-gray-900 shadow-xs hover:shadow-md'
            }`}
          >
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
              style={{ backgroundColor: field.color }}
            />
            <span>{field.label}</span>
            <span
              className="text-xs font-extrabold px-2.5 py-0.5 rounded-full ml-1"
              style={{
                backgroundColor: field.hidden ? '#F3F4F6' : `${field.color}15`,
                color: field.hidden ? '#9CA3AF' : field.color,
              }}
            >
              {field.value ?? 0}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeField(field.id);
              }}
              className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* SVG Polar Area Chart Display - PROMINENT & BIGGER WHEEL */}
      <div className="relative flex items-center justify-center my-4 min-h-[540px] md:min-h-[620px]">
        {N === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 text-gray-400">
            <Layers className="w-14 h-14 mb-3 text-purple-200" />
            <p className="text-base font-bold text-gray-700">No fields active</p>
            <p className="text-xs text-gray-400 max-w-xs mt-1">
              Click &quot;Add Requested Field&quot; above to select metrics to display.
            </p>
          </div>
        ) : (
          <div className="relative w-full max-w-[720px] aspect-square">
            <svg viewBox="0 0 800 800" className="w-full h-full drop-shadow-sm overflow-visible">
              {/* Concentric grid rings */}
              {rings.map((ring, i) => (
                <g key={`ring_${i}`}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={ring.r}
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="1.5"
                    strokeDasharray="5 5"
                  />
                  {/* Axis values at top 12 o'clock */}
                  <text
                    x={cx + 4}
                    y={cy - ring.r - 5}
                    fontSize="13"
                    fontWeight="700"
                    fill="#9CA3AF"
                    textAnchor="start"
                  >
                    {ring.val}
                  </text>
                </g>
              ))}

              {/* Axis crosslines */}
              <line
                x1={cx}
                y1={cy - maxR - 20}
                x2={cx}
                y2={cy + maxR + 20}
                stroke="#F3F4F6"
                strokeWidth="1.5"
              />
              <line
                x1={cx - maxR - 20}
                y1={cy}
                x2={cx + maxR + 20}
                y2={cy}
                stroke="#F3F4F6"
                strokeWidth="1.5"
              />

              {/* Polar Area Slices */}
              {slices.map((slice) => {
                const isHovered = hoveredIdx === slice.idx;
                return (
                  <g key={slice.id}>
                    <path
                      d={slice.pathData}
                      fill={slice.color}
                      fillOpacity={isHovered ? 0.95 : 0.82}
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                      className="transition-all duration-300 cursor-pointer"
                      style={{
                        transformOrigin: `${cx}px ${cy}px`,
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                        filter: isHovered ? `drop-shadow(0 10px 20px ${slice.color}88)` : 'none',
                      }}
                      onMouseEnter={() => setHoveredIdx(slice.idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    />
                  </g>
                );
              })}

              {/* DIRECTIONAL POINTER LINE PROJECTING DIRECTLY TO SECTOR CORNER */}
              {hoveredIdx !== null && slices[hoveredIdx] && (
                <g key={`pointing_line_${slices[hoveredIdx].id}`} className="transition-all duration-200">
                  {/* Pointer line extending outward in sector angle direction */}
                  <line
                    x1={slices[hoveredIdx].arcMidX}
                    y1={slices[hoveredIdx].arcMidY}
                    x2={slices[hoveredIdx].popX}
                    y2={slices[hoveredIdx].popY}
                    stroke={slices[hoveredIdx].color}
                    strokeWidth="1.75"
                    strokeDasharray="4 3"
                    strokeLinecap="round"
                  />

                  {/* Pin Dot on Sector Arc Edge */}
                  <circle
                    cx={slices[hoveredIdx].arcMidX}
                    cy={slices[hoveredIdx].arcMidY}
                    r="4"
                    fill={slices[hoveredIdx].color}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />

                  {/* Target Dot at Box Corner End */}
                  <circle
                    cx={slices[hoveredIdx].popX}
                    cy={slices[hoveredIdx].popY}
                    r="2.5"
                    fill={slices[hoveredIdx].color}
                  />
                </g>
              )}

              {/* Center point circle */}
              <circle cx={cx} cy={cy} r={minR - 10} fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2.5" />
            </svg>

            {/* SECTOR CORNER CALLOUT MESSAGE BOX */}
            <AnimatePresence>
              {hoveredIdx !== null && slices[hoveredIdx] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    left: `${slices[hoveredIdx].popLeftPct}%`,
                    top: `${slices[hoveredIdx].popTopPct}%`,
                    borderColor: slices[hoveredIdx].color,
                  }}
                  className={`absolute pointer-events-none z-30 px-4 py-2.5 rounded-xl bg-white text-gray-900 shadow-xl border-2 whitespace-nowrap ${slices[hoveredIdx].transformClass}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: slices[hoveredIdx].color }}
                    />
                    <span className="text-xs font-bold text-gray-800">
                      {slices[hoveredIdx].label}:
                    </span>
                    <span className="text-sm font-extrabold text-gray-900">
                      {slices[hoveredIdx].value ?? 0}
                    </span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `${slices[hoveredIdx].color}18`,
                        color: slices[hoveredIdx].color,
                      }}
                    >
                      {slices[hoveredIdx].percent}%
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer stats summary */}
      <div className="mt-6 pt-4 border-t border-purple-50 flex justify-between items-center text-xs text-gray-500">
        <span className="font-semibold text-gray-700">
          Total Requested Metrics Count: <strong className="text-gray-900 text-sm ml-1">{totalValue}</strong>
        </span>
        <span className="text-xs font-bold text-[#8B5CF6] bg-purple-50 px-3 py-1 rounded-full">
          {N} Active Sectors
        </span>
      </div>

      {/* Add Requested Field Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-purple-100 shadow-2xl relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <h4 className="text-lg font-bold text-gray-900 mb-1">Add Requested Field</h4>
              <p className="text-xs text-gray-500 mb-6">
                Choose a pre-defined requested metric from backend or add a custom category.
              </p>

              {/* Presets section */}
              {availableFields.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                    Backend Metric Presets
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableFields.map((preset) => {
                      const isAlreadyActive = fields.some(f => f.id === preset.id && !f.hidden);
                      return (
                        <button
                          key={preset.id}
                          onClick={() => handleAddPreset(preset)}
                          disabled={isAlreadyActive}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            isAlreadyActive
                              ? 'bg-purple-50 text-purple-700 border-purple-200 opacity-60 cursor-not-allowed'
                              : 'bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-[#8B5CF6] border-gray-200 hover:border-purple-200'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: preset.color }}
                          />
                          <span>{preset.label}</span>
                          <span className="text-[10px] font-extrabold bg-white px-1.5 py-0.5 rounded border border-gray-200">
                            {preset.value ?? 0}
                          </span>
                          {isAlreadyActive && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Custom field form */}
              <form onSubmit={handleAddCustom} className="pt-4 border-t border-purple-50 space-y-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Add Custom Requested Metric
                </label>
                <div>
                  <input
                    type="text"
                    placeholder="Field Name (e.g. Special Requests)"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-xs font-medium rounded-xl border border-purple-200 text-gray-900 focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-purple-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      placeholder="Count Value"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      min="0"
                      required
                      className="w-full px-4 py-2.5 text-xs font-medium rounded-xl border border-purple-200 text-gray-900 focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 border border-purple-200 rounded-xl px-3 py-2">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                      />
                      <span className="text-xs font-medium text-gray-600">Sector Color</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all shadow-md shadow-purple-200"
                  >
                    Add Field
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
