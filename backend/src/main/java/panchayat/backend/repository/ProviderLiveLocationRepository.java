package panchayat.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import panchayat.backend.model.ProviderLiveLocation;

import java.util.Optional;

public interface ProviderLiveLocationRepository
        extends JpaRepository<ProviderLiveLocation, Long> {

    Optional<ProviderLiveLocation> findByProviderId(Long providerId);
}