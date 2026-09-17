package panchayat.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import panchayat.backend.model.User;
import panchayat.backend.repository.UserRepository;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user){
        return repo.save(user);
    }

    public User updateUser(Long userId, User dto) {
        User user = repo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            user.setName(dto.getName());
        }
        if (dto.getPhone() != null) {
            user.setPhone(dto.getPhone());
        }
        if (dto.getEmail() != null && !dto.getEmail().trim().isEmpty()) {
            if (!user.getEmail().equalsIgnoreCase(dto.getEmail()) && repo.existsByEmail(dto.getEmail())) {
                throw new RuntimeException("Email already registered by another account");
            }
            user.setEmail(dto.getEmail());
        }
        if (dto.getAddress() != null) {
            user.setAddress(dto.getAddress());
        }
        if (dto.getProfileImage() != null) {
            user.setProfileImage(dto.getProfileImage());
        }

        return repo.save(user);
    }

    public String uploadPhoto(Long userId, MultipartFile file) {
        try {
            User user = repo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Path uploadPath = Paths.get("uploads", "profile").toAbsolutePath().normalize();

            Path parentDir = uploadPath.getParent();
            if (parentDir != null && Files.exists(parentDir) && !Files.isDirectory(parentDir)) {
                Files.delete(parentDir);
            }
            if (Files.exists(uploadPath) && !Files.isDirectory(uploadPath)) {
                Files.delete(uploadPath);
            }

            Files.createDirectories(uploadPath);

            String originalName = file.getOriginalFilename();
            String extension = ".jpg";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }

            String fileName = "user_" + userId + "_" + System.currentTimeMillis() + extension;
            Path filePath = uploadPath.resolve(fileName);

            Files.write(filePath, file.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

            String imagePath = "/uploads/profile/" + fileName;
            user.setProfileImage(imagePath);
            repo.save(user);

            return imagePath;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload profile photo: " + e.getMessage(), e);
        }
    }

    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = repo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password does not match");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        repo.save(user);
    }
}