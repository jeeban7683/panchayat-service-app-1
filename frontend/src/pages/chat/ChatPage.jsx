import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Send, MessageSquare, Circle, User,
  Shield, Briefcase, ArrowLeft, MoreVertical,
  Loader2, WifiOff, Wifi, HeadphonesIcon, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../hooks/useWebSocket';
import {
  getChatHistory, getConversations, getAdmins, getAllContacts, getUserById
} from '../../services/chatService';
import { getImageUrl } from '../../services/api';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatTime = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const formatDate = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const getRoleIcon = (role) => {
  switch (role) {
    case 'ADMIN': return Shield;
    case 'PROVIDER': return Briefcase;
    default: return User;
  }
};

const getRoleColor = (role) => {
  switch (role) {
    case 'ADMIN': return { bg: '#F3E8FF', text: '#7C3AED', border: '#8B5CF6' };
    case 'PROVIDER': return { bg: '#FEF3C7', text: '#D97706', border: '#F59E0B' };
    default: return { bg: '#F3F0FF', text: '#8B5CF6', border: '#A78BFA' };
  }
};

// ─── Avatar ──────────────────────────────────────────────────────────────────

const Avatar = ({ name = '?', role, size = 'md', online, image }) => {
  const [hasError, setHasError] = useState(false);
  const colors = getRoleColor(role);
  const sz = size === 'sm' ? 'w-8.5 h-8.5 text-xs' : size === 'lg' ? 'w-12 h-12 text-lg' : 'w-10 h-10 text-sm';
  const imgUrl = getImageUrl(image);
  const showImage = imgUrl && !hasError;

  return (
    <div className="relative shrink-0">
      {showImage ? (
        <img
          src={imgUrl}
          alt={name}
          className={`${sz} rounded-full object-cover border-2 shadow-sm`}
          style={{ borderColor: colors.border }}
          onError={() => setHasError(true)}
        />
      ) : (
        <div
          className={`${sz} rounded-full flex items-center justify-center font-bold border-2 shadow-sm`}
          style={{
            backgroundColor: colors.bg,
            color: colors.text,
            borderColor: colors.border,
          }}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${online ? 'bg-green-400' : 'bg-gray-400'}`}
          style={{ borderColor: '#FFFFFF' }}
        />
      )}
    </div>
  );
};

// ─── Message Bubble ───────────────────────────────────────────────────────────

const MessageBubble = ({ msg, isOwn, showDate, dateLabel, activeContact, currentUser }) => (
  <div>
    {showDate && (
      <div className="flex justify-center my-4">
        <span className="text-xs text-gray-500 px-3 py-1 rounded-full font-semibold bg-purple-50 border border-purple-100">
          {dateLabel}
        </span>
      </div>
    )}
    <div className={`flex mb-3 items-end gap-2.5 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && (
        <Avatar
          name={activeContact?.name || msg.senderName || '?'}
          role={activeContact?.role || msg.senderRole}
          size="sm"
          image={activeContact?.profileImage || activeContact?.avatar || activeContact?.photoUrl}
        />
      )}
      <div className={`max-w-[72%] md:max-w-[55%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm font-semibold ${
            isOwn
              ? 'text-white rounded-br-xs'
              : 'text-gray-900 border rounded-bl-xs'
          }`}
          style={isOwn
            ? { background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }
            : { background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.12)', boxShadow: '0 2px 8px rgba(99,102,241,0.06)' }
          }
        >
          {msg.content}
        </div>
        <span className="text-[10px] text-gray-400 font-medium mt-1 px-1">
          {formatTime(msg.timestamp)}
        </span>
      </div>
      {isOwn && (
        <Avatar
          name={currentUser?.name || '?'}
          role={currentUser?.role}
          size="sm"
          image={currentUser?.profileImage || currentUser?.avatar || currentUser?.photoUrl}
        />
      )}
    </div>
  </div>
);

// ─── Conversation Item ────────────────────────────────────────────────────────

const ConversationItem = ({ contact, isActive, onClick }) => {
  const RoleIcon = getRoleIcon(contact.role);
  const colors = getRoleColor(contact.role);
  return (
    <button
      onClick={() => onClick(contact)}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all text-left border"
      style={{
        background: isActive ? 'rgba(139,92,246,0.08)' : 'transparent',
        borderColor: isActive ? 'rgba(139,92,246,0.18)' : 'transparent'
      }}
    >
      <Avatar name={contact.name} role={contact.role} online={contact.online} image={contact.profileImage || contact.avatar || contact.photoUrl} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold truncate" style={{ color: isActive ? '#8B5CF6' : '#374151' }}>
            {contact.name}
          </p>
          {contact.unreadCount > 0 && (
            <span className="ml-2 min-w-[20px] h-5 px-1.5 bg-[#8B5CF6] text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
              {contact.unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
            style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
          >
            {contact.role}
          </span>
        </div>
      </div>
    </button>
  );
};

// ─── Main ChatPage ────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const preselectedContactId = searchParams.get('contactId');
  const preselectedRole = searchParams.get('role');

  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentUserId = user?.id;
  const currentRole = user?.role;

  // ── Helper to move active/messaging contact to top of conversation list ───
  const bumpContactToTop = useCallback((partnerUserId, unreadInc = 0) => {
    setContacts((prev) => {
      const idx = prev.findIndex((c) => String(c.userId) === String(partnerUserId));
      if (idx === -1) return prev;

      const updated = {
        ...prev[idx],
        unreadCount: unreadInc > 0 ? (prev[idx].unreadCount || 0) + unreadInc : prev[idx].unreadCount,
      };

      const rest = prev.filter((c) => String(c.userId) !== String(partnerUserId));
      return [updated, ...rest];
    });
  }, []);

  // ── WebSocket handler ──────────────────────────────────────────────────────
  const handleIncomingMessage = useCallback((msg) => {
    const partnerId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId;

    if (
      activeContact &&
      ((msg.senderId === activeContact.userId && msg.receiverId === currentUserId) ||
       (msg.senderId === currentUserId && msg.receiverId === activeContact.userId))
    ) {
      setMessages((prev) => {
        // Prevent duplicate messages if already added optimistically
        const isDuplicate = prev.some((m) =>
          (m.id && msg.id && m.id === msg.id) ||
          (m.senderId === msg.senderId &&
           m.receiverId === msg.receiverId &&
           m.content === msg.content &&
           Math.abs(new Date(m.timestamp || Date.now()).getTime() - new Date(msg.timestamp || Date.now()).getTime()) < 5000)
        );

        if (isDuplicate) {
          return prev.map((m) =>
            m.senderId === msg.senderId &&
            m.receiverId === msg.receiverId &&
            m.content === msg.content &&
            !m.id && msg.id
              ? { ...m, id: msg.id }
              : m
          );
        }

        return [...prev, msg];
      });
      bumpContactToTop(partnerId, 0);
    } else {
      bumpContactToTop(partnerId, 1);
    }
  }, [activeContact, currentUserId, bumpContactToTop]);

  const { sendMessage, connected } = useWebSocket(handleIncomingMessage);

  // ── Auto-scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Open conversation ─────────────────────────────────────────────────────
  const openConversation = useCallback(async (contact) => {
    setActiveContact(contact);
    setShowMobileChat(true);
    setLoadingHistory(true);
    setMessages([]);

    // Clear unread badge
    setContacts((prev) =>
      prev.map((c) => (c.userId === contact.userId ? { ...c, unreadCount: 0 } : c))
    );

    try {
      const history = await getChatHistory(currentUserId, contact.userId);
      setMessages(history);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setLoadingHistory(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentUserId]);

  // ── Load contacts ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUserId || !currentRole) return;

    const loadContacts = async () => {
      setLoadingContacts(true);
      try {
        const [conversations, admins, allAvailable] = await Promise.all([
          getConversations(currentUserId).catch(() => []),
          (currentRole !== 'ADMIN' ? getAdmins() : Promise.resolve([])).catch(() => []),
          getAllContacts('').catch(() => []),
        ]);

        const map = new Map();

        // 1. Add recent active conversations first (ordered by recency)
        conversations.forEach((c) => {
          if (c && c.userId && String(c.userId) !== String(currentUserId)) {
            map.set(String(c.userId), c);
          }
        });

        // 2. Add admin contacts (for non-admin users)
        admins.forEach((a) => {
          if (a && a.userId && String(a.userId) !== String(currentUserId) && !map.has(String(a.userId))) {
            map.set(String(a.userId), a);
          }
        });

        // 3. Add all remaining system users/providers as default contacts
        allAvailable.forEach((u) => {
          if (u && u.userId && String(u.userId) !== String(currentUserId) && !map.has(String(u.userId))) {
            map.set(String(u.userId), u);
          }
        });

        let allContacts = Array.from(map.values());
        setContacts(allContacts);

        // Auto-select from URL params
        if (preselectedContactId) {
          const found = allContacts.find(
            (c) => String(c.userId) === String(preselectedContactId)
          );
          if (found) {
            openConversation(found);
          } else {
            // New chat partner — fetch their info and open conversation
            try {
              const u = await getUserById(preselectedContactId);
              const newContact = {
                userId: u.id,
                name: u.name,
                role: u.role,
                profileImage: u.profileImage || u.provider?.photoUrl,
                unreadCount: 0,
              };
              allContacts = [newContact, ...allContacts];
              setContacts(allContacts);
              openConversation(newContact);
            } catch (err) {
              console.error('Failed to load preselected contact details:', err);
            }
          }
        } else if (allContacts.length > 0) {
          openConversation(allContacts[0]);
        }
      } catch (err) {
        console.error('Failed to load contacts:', err);
      } finally {
        setLoadingContacts(false);
      }
    };

    loadContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, currentRole, preselectedContactId]);

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    if (!inputText.trim() || !activeContact || !currentUserId) return;

    const msg = {
      senderId: currentUserId,
      receiverId: activeContact.userId,
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
      senderName: user?.name,
      senderRole: currentRole,
    };

    // Optimistic update
    setMessages((prev) => [...prev, msg]);
    bumpContactToTop(activeContact.userId, 0);
    setInputText('');

    // Send via WebSocket
    sendMessage(msg);
  }, [inputText, activeContact, currentUserId, user, currentRole, sendMessage, bumpContactToTop]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Filter contacts ───────────────────────────────────────────────────────
  const filteredContacts = contacts.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Group messages by date ────────────────────────────────────────────────
  const groupedMessages = messages.map((msg, idx) => {
    const prevMsg = messages[idx - 1];
    const showDate =
      idx === 0 ||
      new Date(msg.timestamp).toDateString() !==
        new Date(prevMsg?.timestamp).toDateString();
    return { msg, showDate, dateLabel: formatDate(msg.timestamp) };
  });

  // ── UI: Connection badge ─────────────────────────────────────────────────
  const ConnectionBadge = () => (
    <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border" style={{
      background: connected ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)',
      borderColor: connected ? 'rgba(52,211,153,0.25)' : 'rgba(239,68,68,0.25)',
      color: connected ? '#34D399' : '#F87171'
    }}>
      {connected
        ? <><Wifi className="w-3 h-3" /> Live</>
        : <><WifiOff className="w-3 h-3" /> Offline</>
      }
    </div>
  );

  // ─── Left Panel ──────────────────────────────────────────────────────────
  const LeftPanel = (
    <div className={`flex flex-col border-r ${
      showMobileChat ? 'hidden md:flex' : 'flex'
    } w-full md:w-80 lg:w-72 xl:w-80 shrink-0`} style={{ background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.08)' }}>

      {/* Header */}
      <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(139,92,246,0.08)' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-black text-gray-900">Messages</h2>
          <ConnectionBadge />
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm text-gray-900 font-medium placeholder:text-gray-400 outline-none transition-all rounded-xl"
            style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}
            onFocus={e => { e.target.style.borderColor = '#8B5CF6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(139,92,246,0.12)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto p-2">
        {loadingContacts ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#8B5CF6]" />
            <p className="text-sm font-semibold">Loading conversations...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <MessageSquare className="w-10 h-10 mb-3 opacity-30 text-[#8B5CF6]" />
            <p className="text-sm font-bold">No conversations yet</p>
            <p className="text-xs mt-1 text-center px-4">
              {currentRole === 'ADMIN'
                ? 'Wait for users to contact you.'
                : 'Use "Contact Admin" to start a chat.'}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredContacts.map((contact) => (
              <ConversationItem
                key={contact.userId}
                contact={contact}
                isActive={activeContact?.userId === contact.userId}
                onClick={openConversation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ─── Right Panel ─────────────────────────────────────────────────────────
  const RightPanel = (
    <div className={`flex-1 flex flex-col ${
      !showMobileChat ? 'hidden md:flex' : 'flex'
    }`} >
      {!activeContact ? (
        // Empty state
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 border" style={{ background: 'rgba(244,180,0,0.05)', borderColor: 'rgba(139,92,246,0.15)' }}>
            <MessageSquare className="w-9 h-9 text-[#8B5CF6]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Start a Conversation</h3>
          <p className="text-sm text-center max-w-xs font-semibold">
            Select a contact from the left to open a chat.
          </p>
        </div>
      ) : (
        <>
          {/* Chat Header */}
          <div className="border-b px-4 py-3 flex items-center gap-3 shadow-sm shrink-0" style={{ background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.08)' }}>
            <button
              className="md:hidden p-1.5 text-gray-500 hover:text-white rounded-lg"
              onClick={() => setShowMobileChat(false)}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Avatar name={activeContact.name} role={activeContact.role} online size="md" image={activeContact.avatar || activeContact.profileImage || activeContact.photoUrl} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{activeContact.name}</p>
              <p className="text-xs text-gray-500">{activeContact.role}</p>
            </div>
            <ConnectionBadge />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {loadingHistory ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <Loader2 className="w-7 h-7 animate-spin text-[#8B5CF6]" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-3" style={{ background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.08)' }}>
                  <MessageSquare className="w-6 h-6 text-gray-500" />
                </div>
                <p className="text-sm font-bold text-gray-900">No messages yet</p>
                <p className="text-xs mt-1 font-medium">Say hello! 👋</p>
              </div>
            ) : (
              <div className="space-y-0.5 max-w-3xl mx-auto">
                {groupedMessages.map(({ msg, showDate, dateLabel }, idx) => (
                  <MessageBubble
                    key={idx}
                    msg={msg}
                    isOwn={msg.senderId === currentUserId}
                    showDate={showDate}
                    dateLabel={dateLabel}
                    activeContact={activeContact}
                    currentUser={user}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="border-t px-4 py-3 shrink-0" style={{ background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.08)' }}>
            <div className="flex items-end gap-2 max-w-3xl mx-auto">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="w-full px-4 py-2.5 text-sm text-gray-900 font-semibold placeholder:text-gray-400 outline-none transition-all resize-none leading-relaxed rounded-2xl"
                  style={{ maxHeight: '120px', background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}
                  onFocus={e => { e.target.style.borderColor = '#8B5CF6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(139,92,246,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || !connected}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shrink-0"
                style={{ background: '#8B5CF6', color: '#FFFFFF' }}
              >
                <Send className="w-4 h-4 font-black" />
              </button>
            </div>
            {!connected && (
              <p className="text-center text-xs text-red-400 mt-1.5 font-bold">
                ⚡ Connecting to server... Messages will send when connected.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-6rem)] lg:h-[calc(100vh-5rem)] rounded-2xl sm:rounded-3xl border overflow-hidden shadow-[0_12px_40px_rgba(99,102,241,0.08)] bg-white" style={{ borderColor: 'rgba(139,92,246,0.08)' }}>
      {LeftPanel}
      {RightPanel}
    </div>
  );
}
