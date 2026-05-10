package panchayat.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "provider_live_location")
public class ProviderLiveLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(name = "provider_id", unique = true, nullable = false)
    private Long providerId;

    @Setter
    private Double latitude;
    @Setter
    private Double longitude;

    @Setter
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

}