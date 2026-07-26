package panchayat.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import panchayat.backend.model.ChatMessage;
import panchayat.backend.model.Role;
import panchayat.backend.model.User;
import panchayat.backend.repository.ChatMessageRepository;
import panchayat.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    public ChatMessage saveMessage(ChatMessage message) {
        // Enrich with sender info
        userRepository.findById(message.getSenderId()).ifPresent(sender -> {
            message.setSenderName(sender.getName());
            message.setSenderRole(sender.getRole().name());
        });

        ChatMessage toSave = new ChatMessage();
        toSave.setSenderId(message.getSenderId());
        toSave.setReceiverId(message.getReceiverId());
        toSave.setContent(message.getContent());
        toSave.setTimestamp(LocalDateTime.now());
        toSave.setRead(false);

        ChatMessage saved = chatMessageRepository.save(toSave);
        saved.setSenderName(message.getSenderName());
        saved.setSenderRole(message.getSenderRole());
        return saved;
    }

    public List<ChatMessage> getChatHistory(Long senderId, Long receiverId) {
        return chatMessageRepository.findChatHistory(senderId, receiverId);
    }

    public List<Map<String, Object>> getConversations(Long userId) {
        List<Long> partnerIds = chatMessageRepository.findConversationPartnerIds(userId);
        List<Map<String, Object>> conversations = new ArrayList<>();

        for (Long partnerId : partnerIds) {
            userRepository.findById(partnerId).ifPresent(partner -> {
                Map<String, Object> conv = new HashMap<>();
                conv.put("userId", partner.getId());
                conv.put("name", partner.getName());
                conv.put("role", partner.getRole().name());
                long unread = chatMessageRepository.countBySenderIdAndReceiverIdAndReadFalse(partnerId, userId);
                conv.put("unreadCount", unread);
                conversations.add(conv);
            });
        }

        return conversations;
    }

    public List<Map<String, Object>> getAdminUsers() {
        List<User> admins = userRepository.findByRole(Role.ADMIN);
        List<Map<String, Object>> result = new ArrayList<>();
        for (User admin : admins) {
            Map<String, Object> map = new HashMap<>();
            map.put("userId", admin.getId());
            map.put("name", admin.getName());
            map.put("role", "ADMIN");
            map.put("unreadCount", 0);
            result.add(map);
        }
        return result;
    }

    public List<Map<String, Object>> getAllContacts(String excludeRole) {
        List<User> allUsers = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : allUsers) {
            if (!u.getRole().name().equals(excludeRole)) {
                Map<String, Object> map = new HashMap<>();
                map.put("userId", u.getId());
                map.put("name", u.getName());
                map.put("role", u.getRole().name());
                map.put("unreadCount", 0);
                result.add(map);
            }
        }
        return result;
    }
}
