package panchayat.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import panchayat.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}