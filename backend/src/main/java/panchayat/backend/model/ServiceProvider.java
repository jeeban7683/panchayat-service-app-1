package panchayat.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "service_providers")
@Data
public class ServiceProvider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private ServiceEntity service;

    private int experience;
    private double price;

    @Column(name = "is_verified")
    private boolean isVerified;

    public void setIsVerified(boolean b) {
    }
}