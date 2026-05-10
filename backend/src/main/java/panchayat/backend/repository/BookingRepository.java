package panchayat.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import panchayat.backend.model.Booking;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByProviderId(Long providerId);
    List<Booking> findByProviderIdAndStatus(Long providerId, String status);

     List<Booking> findByUserIdAndStatus(Long userId, String status);

}