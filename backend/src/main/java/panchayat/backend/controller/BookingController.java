package panchayat.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import panchayat.backend.model.Booking;
import panchayat.backend.model.BookingStatus;
import panchayat.backend.repository.BookingRepository;
import panchayat.backend.service.BookingService;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "${app.frontend.url}")
public class BookingController {

    @Autowired
    private BookingService service;

    @Autowired
    private BookingRepository bookingRepository;


    // Create booking
    @PostMapping
    public Booking create(@RequestBody Booking booking){
        return service.create(booking);
    }

    // Accept booking
    @PutMapping("/{id}/accept")
    public Booking accept(@PathVariable Long id){
        return service.acceptBooking(id);
    }

    // Reject booking
    @PutMapping("/{id}/reject")
    public Booking reject(@PathVariable Long id){
        return service.rejectBooking(id);
    }

    // Complete booking
    @PutMapping("/{id}/complete")
    public Booking complete(@PathVariable Long id){
        return service.completeBooking(id);
    }

    // Get user bookings


    // Get provider bookings
    @GetMapping("/provider/{providerId}")
    public List<Booking> getProviderBookings(@PathVariable Long providerId){
        return service.getProviderBookings(providerId);
    }
    @GetMapping("/provider/{providerId}/pending")
    public List<Booking> getPendingBookings(@PathVariable Long providerId){
        return service.getProviderPendingBookings(providerId);
    }

    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id){
        return service.getBookingById(id);
    }
    @GetMapping
    public List<Booking> getAllBookings() {
        return service.getAllBookings();    }

    @GetMapping("/user/{userId}")
    public List<Booking> getUserBookings(@PathVariable Long userId) {
        return service.getUserBookings(userId);
    }
    @GetMapping("/provider/{providerId}/completed")
    public Long completedJobs(
            @PathVariable Long providerId) {

        return bookingRepository
                .countByProviderIdAndStatus(providerId, BookingStatus.COMPLETED);
    }
    @GetMapping("/provider/{providerId}/total")
    public Long totalBookings(
            @PathVariable Long providerId) {

        return bookingRepository
                .countByProviderId(providerId);
    }
    @GetMapping("/provider/{providerId}/success-rate")
    public Double successRate(
            @PathVariable Long providerId
    ) {

        long total =
                bookingRepository
                        .countByProviderId(
                                providerId
                        );

        long completed =
                bookingRepository
                        .countByProviderIdAndStatus(
                                providerId,
                                BookingStatus.COMPLETED
                        );

        if(total == 0)
            return 0.0;

        return (completed * 100.0)
                / total;
    }
}
