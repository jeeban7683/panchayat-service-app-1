package panchayat.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private ServiceProvider provider;

    @ManyToOne
    private ServiceEntity service;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;
}