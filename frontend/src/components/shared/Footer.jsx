import { Mail, Phone, MapPin, Globe, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      className="text-[#9099A8]"
      style={{
        background: 'linear-gradient(to bottom, #000000, #050505)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #F4B400 0%, #FFC928 100%)' }}
              >
                <MapPin className="w-5 h-5 text-black" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Panchayat<span className="text-[#F4B400]">.</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-[#9099A8]">
              Connecting communities with trusted local professionals for every service need — reliable, fast, and verified.
            </p>
            <div className="flex gap-3 pt-1">
              {[
                { Icon: Globe, label: 'Website' },
                { Icon: Share2, label: 'Share' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#9099A8',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#F4B400';
                    e.currentTarget.style.color = '#000';
                    e.currentTarget.style.borderColor = '#F4B400';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#9099A8';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold text-white mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Home', href: '/' },
                { label: 'Browse Services', href: '/services' },
                { label: 'Top Providers', href: '/providers' },
                { label: 'Join as a Professional', href: '/register' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-[#9099A8] hover:text-[#F4B400] hover:pl-1 transition-all duration-200 inline-block font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-base font-bold text-white mb-5">Legal</h3>
            <ul className="space-y-3 text-sm">
              {['Terms of Service', 'Privacy Policy', 'Refund Policy', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[#9099A8] hover:text-[#F4B400] hover:pl-1 transition-all duration-200 inline-block font-medium"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-bold text-white mb-5">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'rgba(244,180,0,0.1)', border: '1px solid rgba(244,180,0,0.2)' }}
                >
                  <MapPin className="w-4 h-4 text-[#F4B400]" />
                </div>
                <span className="text-[#9099A8] leading-relaxed">123 Business Park, Mumbai, 400051</span>
              </li>
              <li className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(244,180,0,0.1)', border: '1px solid rgba(244,180,0,0.2)' }}
                >
                  <Phone className="w-4 h-4 text-[#F4B400]" />
                </div>
                <a href="tel:+919876543210" className="text-[#9099A8] hover:text-[#F4B400] transition-colors font-medium">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(244,180,0,0.1)', border: '1px solid rgba(244,180,0,0.2)' }}
                >
                  <Mail className="w-4 h-4 text-[#F4B400]" />
                </div>
                <a href="mailto:support@panchayathub.com" className="text-[#9099A8] hover:text-[#F4B400] transition-colors font-medium">
                  support@panchayathub.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#9099A8]">
          <p>© {new Date().getFullYear()} Panchayat Services. All rights reserved.</p>
          <p>
            Built with <span className="text-[#F4B400]">♥</span> for local communities
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
