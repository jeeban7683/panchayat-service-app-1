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
    case 'ADMIN': return { bg: 'rgba(167,139,250,0.1)', text: '#A78BFA', border: 'rgba(167,139,250,0.2)' };
    case 'PROVIDER': return { bg: 'rgba(244,180,0,0.1)', text: '#FBBF24', border: 'rgba(244,180,0,0.25)' };
    default: return { bg: 'rgba(255,255,255,0.05)', text: '#9099A8', border: 'rgba(255,255,255,0.08)' };
  }
};

// ─── Avatar ──────────────────────────────────────────────────────────────────

const Avatar = ({ name = '?', role, size = 'md', online }) => {
  const colors = getRoleColor(role);
  const sz = size === 'sm' ? 'w-9 h-9 text-sm' : size === 'lg' ? 'w-12 h-12 text-lg' : 'w-10 h-10 text-sm';
  return (
    <div className="relative shrink-0">
      <div
        className={`${sz} rounded-full flex items-center justify-center font-bold border-2`}
        style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
      >
        {name.charAt(0).toUpperCase()}
      </div>
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${online ? 'bg-green-400' : 'bg-gray-500'}`}
          style={{ borderColor: '#14181F' }}
        />
      )}
    </div>
  );
};

// ─── Message Bubble ───────────────────────────────────────────────────────────

const MessageBubble = ({ msg, isOwn, showDate, dateLabel }) => (
  <div>
    {showDate && (
      <div className="flex justify-center my-4">
        <span className="text-xs text-[#9099A8] px-3 py-1 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {dateLabel}
        </span>
      </div>
    )}
    <div className={`flex mb-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[72%] md:max-w-[55%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isOwn
              ? 'bg-[#F4B400] text-black font-semibold rounded-br-sm'
              : 'text-white border rounded-bl-sm'
          }`}
          style={isOwn ? {} : { background: '#1A1F28', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          {msg.content}
        </div>
        <span className="text-[10px] text-[#9099A8]/70 mt-1 px-1">
          {formatTime(msg.timestamp)}
        </span>
      </div>
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
      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left border"
      style={{
        background: isActive ? 'rgba(255,255,255,0.03)' : 'transparent',
        borderColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent'
      }}
    >
      <Avatar name={contact.name} role={contact.role} online={contact.online} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold truncate" style={{ color: isActive ? '#F4B400' : '#C9CED6' }}>
            {contact.name}
          </p>
          {contact.unreadCount > 0 && (
            <span className="ml-2 min-w-[20px] h-5 px-1.5 bg-[#F4B400] text-black text-[10px] font-black rounded-full flex items-center justify-center shrink-0">
              {contact.unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded border"
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

  // ── WebSocket handler ──────────────────────────────────────────────────────
  const handleIncomingMessage = useCallback((msg) => {
    // Only add if it's relevant to current conversation
    if (
      activeContact &&
      ((msg.senderId === activeContact.userId && msg.receiverId === currentUserId) ||
       (msg.senderId === currentUserId && msg.receiverId === activeContact.userId))
    ) {
      setMessages((prev) => [...prev, msg]);
    } else {
      // Update unread badge for other contacts
      setContacts((prev) =>
        prev.map((c) =>
          c.userId === msg.senderId
            ? { ...c, unreadCount: (c.unreadCount || 0) + 1 }
            : c
        )
      );
    }
  }, [activeContact, currentUserId]);

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
        const [conversations, admins] = await Promise.all([
          getConversations(currentUserId),
          currentRole !== 'ADMIN' ? getAdmins() : Promise.resolve([]),
        ]);

        let allContacts = [];

        if (currentRole === 'ADMIN') {
          // Admin sees all users and providers
          const all = await getAllContacts('ADMIN');
          allContacts = all;
          // Merge unread counts from conversations
          conversations.forEach((conv) => {
            const idx = allContacts.findIndex((c) => c.userId === conv.userId);
            if (idx !== -1) allContacts[idx].unreadCount = conv.unreadCount;
          });
        } else {
          // Merge conversation list + admins, dedup by userId
          const map = new Map();
          conversations.forEach((c) => map.set(c.userId, c));
          admins.forEach((a) => {
            if (!map.has(a.userId)) map.set(a.userId, a);
          });
          allContacts = Array.from(map.values());
        }

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
                unreadCount: 0,
              };
              allContacts = [newContact, ...allContacts];
              setContacts(allContacts);
              openConversation(newContact);
            } catch (err) {
              console.error('Failed to load preselected contact details:', err);
            }
          }
        } else if (preselectedRole === 'ADMIN') {
          const adminContact = allContacts.find((c) => c.role === 'ADMIN');
          if (adminContact) openConversation(adminContact);
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
    setInputText('');

    // Send via WebSocket
    sendMessage(msg);
  }, [inputText, activeContact, currentUserId, user, currentRole, sendMessage]);

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
    } w-full md:w-80 lg:w-72 xl:w-80 shrink-0`} style={{ background: '#14181F', borderColor: 'rgba(255,255,255,0.08)' }}>

      {/* Header */}
      <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-black text-white">Messages</h2>
          <ConnectionBadge />
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9099A8]" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm text-white placeholder-[#4B5563] outline-none transition-all rounded-xl"
            style={{ background: '#1A1F28', border: '1px solid rgba(255,255,255,0.08)' }}
            onFocus={e => { e.target.style.borderColor = '#F4B400'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          />
        </div>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto p-2">
        {loadingContacts ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#9099A8]">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#F4B400]" />
            <p className="text-sm font-semibold">Loading conversations...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#9099A8]">
            <MessageSquare className="w-10 h-10 mb-3 opacity-30 text-[#F4B400]" />
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
    }`} style={{ background: '#000000' }}>
      {!activeContact ? (
        // Empty state
        <div className="flex-1 flex flex-col items-center justify-center text-[#9099A8]">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 border" style={{ background: 'rgba(244,180,0,0.05)', borderColor: 'rgba(244,180,0,0.15)' }}>
            <MessageSquare className="w-9 h-9 text-[#F4B400]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Start a Conversation</h3>
          <p className="text-sm text-center max-w-xs font-semibold">
            Select a contact from the left to open a chat.
          </p>
        </div>
      ) : (
        <>
          {/* Chat Header */}
          <div className="border-b px-4 py-3 flex items-center gap-3 shadow-sm shrink-0" style={{ background: '#14181F', borderColor: 'rgba(255,255,255,0.08)' }}>
            <button
              className="md:hidden p-1.5 text-[#9099A8] hover:text-white rounded-lg"
              onClick={() => setShowMobileChat(false)}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Avatar name={activeContact.name} role={activeContact.role} online size="md" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm truncate">{activeContact.name}</p>
              <p className="text-xs text-[#9099A8]">{activeContact.role}</p>
            </div>
            <ConnectionBadge />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {loadingHistory ? (
              <div className="flex items-center justify-center h-full text-[#9099A8]">
                <Loader2 className="w-7 h-7 animate-spin text-[#F4B400]" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[#9099A8]">
                <div className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-3" style={{ background: '#14181F', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <MessageSquare className="w-6 h-6 text-[#9099A8]" />
                </div>
                <p className="text-sm font-bold text-white">No messages yet</p>
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
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="border-t px-4 py-3 shrink-0" style={{ background: '#14181F', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-end gap-2 max-w-3xl mx-auto">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="w-full px-4 py-2.5 text-sm text-white placeholder-[#4B5563] outline-none transition-all resize-none leading-relaxed rounded-2xl"
                  style={{ maxHeight: '120px', background: '#1A1F28', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => { e.target.style.borderColor = '#F4B400'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || !connected}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shrink-0"
                style={{ background: '#F4B400', color: '#000' }}
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
    <div className="flex h-[calc(100vh-64px)] rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
      {LeftPanel}
      {RightPanel}
    </div>
  );
}
