package panchayat.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import panchayat.backend.model.ProviderLiveLocation;
import panchayat.backend.repository.ProviderLiveLocationRepository;

import java.time.LocalDateTime;

@Service
public class ProviderTrackingService {

    @Autowired
    private ProviderLiveLocationRepository repository;

    public ProviderLiveLocation updateLocation(
            Long providerId,
            Double latitude,
            Double longitude
    ) {
        ProviderLiveLocation location =
                repository.findByProviderId(providerId)
                        .orElse(new ProviderLiveLocation());

        location.setProviderId(providerId);
        location.setLatitude(latitude);
        location.setLongitude(longitude);
        location.setUpdatedAt(LocalDateTime.now());

        return repository.save(location);
    }

    public ProviderLiveLocation getLocation(Long providerId) {
        return repository.findByProviderId(providerId)
                .orElseThrow(() -> new RuntimeException("Location not found"));
    }
}