package panchayat.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import panchayat.backend.model.Booking;
import panchayat.backend.model.BookingStatus;
import panchayat.backend.repository.BookingRepository;

import java.util.List;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
public class BookingService {

    @Autowired
    private BookingRepository repo;

    // Create booking
    public Booking create(Booking booking){
        booking.setStatus(BookingStatus.PENDING);
        return repo.save(booking);
    }

    // Accept booking
    public Booking acceptBooking(Long id){
        Booking booking = repo.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(BookingStatus.ACCEPTED);
        return repo.save(booking);
    }

    // Reject booking
    public Booking rejectBooking(Long id){
        Booking booking = repo.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(BookingStatus.REJECTED);
        return repo.save(booking);
    }

    // Complete booking
    public Booking completeBooking(Long id){
        Booking booking = repo.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(BookingStatus.COMPLETED);
        return repo.save(booking);
    }

    // Get bookings by user
    public List<Booking> getUserBookings(Long userId){
        return repo.findByUserId(userId);
    }

    // Get bookings by provider
    public List<Booking> getProviderBookings(Long providerId){
        return repo.findByProviderId(providerId);
    }
    // 🔥 Advanced: only pending requests
    public List<Booking> getProviderPendingBookings(Long providerId){
        return repo.findByProviderIdAndStatus(providerId, BookingStatus.PENDING);
    }

    public Booking getBookingById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public List<Booking> getAllBookings() {
        return repo.findAll();
    }
}

