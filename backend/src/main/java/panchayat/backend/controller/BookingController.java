package panchayat.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import panchayat.backend.model.Booking;
import panchayat.backend.service.BookingService;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService service;

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
    @GetMapping("/user/{userId}")
    public List<Booking> getUserBookings(@PathVariable Long userId){
        return service.getUserBookings(userId);
    }

    // Get provider bookings
    @GetMapping("/provider/{providerId}")
    public List<Booking> getProviderBookings(@PathVariable Long providerId){
        return service.getProviderBookings(providerId);
    }
    @GetMapping("/provider/{providerId}/pending")
    public List<Booking> getPendingBookings(@PathVariable Long providerId){
        return service.getProviderPendingBookings(providerId);
    }

}