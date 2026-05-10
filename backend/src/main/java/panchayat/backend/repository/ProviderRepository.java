package panchayat.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import panchayat.backend.model.ServiceProvider;

import java.util.List;

public interface ProviderRepository extends JpaRepository<ServiceProvider, Long> {
    List<ServiceProvider> findByIsVerified(boolean b);
}