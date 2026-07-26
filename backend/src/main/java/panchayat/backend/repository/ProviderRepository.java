package panchayat.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import panchayat.backend.model.ServiceProvider;

import java.util.List;
import java.util.Optional;

public interface ProviderRepository
        extends JpaRepository<ServiceProvider, Long> {
    Long countByIsVerified(boolean isVerified);

    List<ServiceProvider>
    findByIsVerified(boolean isVerified);

    Optional<ServiceProvider> findByUserId(Long userId);


}
