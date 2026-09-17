package panchayat.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import panchayat.backend.model.ChatMessage;
import panchayat.backend.model.Role;
import panchayat.backend.model.User;
import panchayat.backend.repository.ChatMessageRepository;
import panchayat.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
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

    private String extractProfileImage(User user) {
        if (user == null) return null;
        if (user.getProfileImage() != null && !user.getProfileImage().trim().isEmpty()) {
            return user.getProfileImage();
        }
        try {
            if (user.getProvider() != null && user.getProvider().getProfileImage() != null) {
                return user.getProvider().getProfileImage();
            }
        } catch (Exception ignored) {}
        return null;
    }

    public List<Map<String, Object>> getConversations(Long userId) {
        List<Map<String, Object>> conversations = new ArrayList<>();
        try {
            List<Long> partnerIds = chatMessageRepository.findConversationPartnerIds(userId);
            for (Long partnerId : partnerIds) {
                if (partnerId == null) continue;
                userRepository.findById(partnerId).ifPresent(partner -> {
                    Map<String, Object> conv = new HashMap<>();
                    conv.put("userId", partner.getId());
                    conv.put("name", partner.getName());
                    conv.put("role", partner.getRole() != null ? partner.getRole().name() : "USER");
                    conv.put("profileImage", extractProfileImage(partner));
                    long unread = chatMessageRepository.countBySenderIdAndReceiverIdAndReadFalse(partnerId, userId);
                    conv.put("unreadCount", unread);
                    conversations.add(conv);
                });
            }
        } catch (Exception e) {
            System.err.println("Error fetching conversations: " + e.getMessage());
        }
        return conversations;
    }

    public List<Map<String, Object>> getAdminUsers() {
        List<User> admins = userRepository.findByRole(Role.ADMIN);
        if (admins.isEmpty()) {
            List<User> all = userRepository.findAll();
            for (User u : all) {
                if (u.getRole() != null && u.getRole().name().equalsIgnoreCase("ADMIN")) {
                    admins.add(u);
                }
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (User admin : admins) {
            Map<String, Object> map = new HashMap<>();
            map.put("userId", admin.getId());
            map.put("name", admin.getName());
            map.put("role", "ADMIN");
            map.put("profileImage", extractProfileImage(admin));
            map.put("unreadCount", 0);
            result.add(map);
        }

        // Safeguard: guarantee at least one default Admin contact is always returned
        if (result.isEmpty()) {
            Map<String, Object> defaultAdmin = new HashMap<>();
            defaultAdmin.put("userId", 1L);
            defaultAdmin.put("name", "Panchayat Admin");
            defaultAdmin.put("role", "ADMIN");
            defaultAdmin.put("profileImage", null);
            defaultAdmin.put("unreadCount", 0);
            result.add(defaultAdmin);
        }

        return result;
    }

    public List<Map<String, Object>> getAllContacts(String excludeRole) {
        List<User> allUsers = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : allUsers) {
            boolean shouldInclude = excludeRole == null || excludeRole.trim().isEmpty() || "NONE".equalsIgnoreCase(excludeRole) || !u.getRole().name().equalsIgnoreCase(excludeRole);
            if (shouldInclude) {
                Map<String, Object> map = new HashMap<>();
                map.put("userId", u.getId());
                map.put("name", u.getName());
                map.put("role", u.getRole() != null ? u.getRole().name() : "USER");
                map.put("profileImage", extractProfileImage(u));
                map.put("unreadCount", 0);
                result.add(map);
            }
        }
        return result;
    }
}
