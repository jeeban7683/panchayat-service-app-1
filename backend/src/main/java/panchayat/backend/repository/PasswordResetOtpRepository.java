package panchayat.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import panchayat.backend.model.PasswordResetOtp;

import java.util.Optional;

@Repository
public interface PasswordResetOtpRepository
        extends JpaRepository<PasswordResetOtp,Long> {

    Optional<PasswordResetOtp> findByEmail(String email);
}
