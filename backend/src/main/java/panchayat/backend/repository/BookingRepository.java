package panchayat.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import panchayat.backend.model.Booking;
import panchayat.backend.model.BookingStatus;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByProviderId(Long providerId);

    List<Booking> findByProviderIdAndStatus(Long providerId, BookingStatus status);

    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);

    Long countByProviderIdAndStatus(Long providerId, BookingStatus status);

    Long countByProviderId(Long providerId);
}

