package panchayat.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import panchayat.backend.model.Message;

import java.util.List;

@Repository
public interface MessageRepository
        extends JpaRepository<Message,Long> {

    List<Message>
    findBySenderIdAndReceiverIdOrReceiverIdAndSenderId(
            Long sender,
            Long receiver,
            Long receiver2,
            Long sender2);
}
