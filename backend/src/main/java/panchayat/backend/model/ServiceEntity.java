package panchayat.backend.model;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "services")
@Data
public class ServiceEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    @OneToMany(mappedBy = "service", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<ServiceProvider> providers;
    @Transient
    public int getProviderCount() {
        return providers != null ? providers.size() : 0;
    }
    private String profileImage;

    private String location;

    @Column(length = 3000)
    private String bio;

    private String portfolioImage1;

    private String portfolioImage2;

    private String portfolioImage3;

}