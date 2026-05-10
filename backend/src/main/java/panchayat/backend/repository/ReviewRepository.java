
package panchayat.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import panchayat.backend.model.Review;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProviderId(Long providerId);
}