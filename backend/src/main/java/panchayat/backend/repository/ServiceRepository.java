package panchayat.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import panchayat.backend.model.ServiceEntity;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
}