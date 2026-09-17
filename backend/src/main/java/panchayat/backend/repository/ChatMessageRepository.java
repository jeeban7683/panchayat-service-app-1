package panchayat.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import panchayat.backend.model.ChatMessage;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.senderId = :senderId AND m.receiverId = :receiverId) OR " +
           "(m.senderId = :receiverId AND m.receiverId = :senderId) " +
           "ORDER BY m.timestamp ASC")
    List<ChatMessage> findChatHistory(
            @Param("senderId") Long senderId,
            @Param("receiverId") Long receiverId);

    @Query(value = "SELECT partner_id FROM (" +
                   "  SELECT (CASE WHEN sender_id = :userId THEN receiver_id ELSE sender_id END) AS partner_id, MAX(timestamp) AS max_time " +
                   "  FROM chat_messages " +
                   "  WHERE sender_id = :userId OR receiver_id = :userId " +
                   "  GROUP BY (CASE WHEN sender_id = :userId THEN receiver_id ELSE sender_id END) " +
                   "  ORDER BY max_time DESC" +
                   ") sub", nativeQuery = true)
    List<Long> findConversationPartnerIds(@Param("userId") Long userId);

    long countBySenderIdAndReceiverIdAndReadFalse(Long senderId, Long receiverId);
}
