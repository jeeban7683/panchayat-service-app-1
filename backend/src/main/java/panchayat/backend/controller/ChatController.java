package panchayat.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import panchayat.backend.model.ChatMessage;
import panchayat.backend.service.ChatService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    @Autowired
    private ChatService chatService;

    // Load chat history between two users
    @GetMapping("/history")
    public List<ChatMessage> getChatHistory(
            @RequestParam Long senderId,
            @RequestParam Long receiverId) {
        return chatService.getChatHistory(senderId, receiverId);
    }

    // Get list of recent conversations for a user
    @GetMapping("/conversations")
    public List<Map<String, Object>> getConversations(@RequestParam Long userId) {
        return chatService.getConversations(userId);
    }

    // Get all admin users (for Contact Admin feature)
    @GetMapping("/admins")
    public List<Map<String, Object>> getAdmins() {
        return chatService.getAdminUsers();
    }

    // Get all contacts visible to admin (users + providers)
    @GetMapping("/contacts")
    public List<Map<String, Object>> getAllContacts(@RequestParam String excludeRole) {
        return chatService.getAllContacts(excludeRole);
    }

    // WebSocket: receive message from client, persist and broadcast
    @MessageMapping("/send")
    @SendTo("/topic/messages")
    public ChatMessage sendMessage(ChatMessage message) {
        return chatService.saveMessage(message);
    }
}
