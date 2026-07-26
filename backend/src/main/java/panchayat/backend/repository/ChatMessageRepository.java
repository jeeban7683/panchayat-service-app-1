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

    @Query("SELECT DISTINCT CASE WHEN m.senderId = :userId THEN m.receiverId ELSE m.senderId END " +
           "FROM ChatMessage m WHERE m.senderId = :userId OR m.receiverId = :userId")
    List<Long> findConversationPartnerIds(@Param("userId") Long userId);

    long countBySenderIdAndReceiverIdAndReadFalse(Long senderId, Long receiverId);
}
