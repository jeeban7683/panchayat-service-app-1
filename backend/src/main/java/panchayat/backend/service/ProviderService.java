package panchayat.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import panchayat.backend.dto.ProviderProfileDTO;
import panchayat.backend.model.ServiceProvider;
import panchayat.backend.model.User;
import panchayat.backend.repository.ProviderRepository;
import panchayat.backend.repository.UserRepository;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProviderService {

    @Autowired
    private ProviderRepository repo;

    @Autowired
    private UserRepository userRepository;

    // ================= REGISTER =================

    public ServiceProvider register(ServiceProvider provider) {

        provider.setIsVerified(true);

        if (provider.getCreatedAt() == null) {
            provider.setCreatedAt(LocalDateTime.now());
        }

        if (provider.getResponseTime() == null) {
            provider.setResponseTime("Fast (under 1hr)");
        }

        return repo.save(provider);
    }

    // ================= VERIFIED =================

    public List<ServiceProvider> getVerified() {
        return repo.findByIsVerified(true);
    }

    // ================= ALL =================

    public List<ServiceProvider> getAll() {
        return repo.findAll();
    }

    // ================= GET BY ID =================

    public ServiceProvider getById(Long id) {

        ServiceProvider provider = repo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Provider not found"));

        boolean update = false;

        if (provider.getCreatedAt() == null) {
            provider.setCreatedAt(LocalDateTime.now());
            update = true;
        }

        if (provider.getResponseTime() == null
                || provider.getResponseTime().isEmpty()) {

            provider.setResponseTime("Fast (under 1hr)");
            update = true;
        }

        if (update) {
            repo.save(provider);
        }

        return provider;
    }

    // ================= PENDING =================

    public List<ServiceProvider> getPendingProviders() {
        return repo.findByIsVerified(false);
    }

    // ================= VERIFY =================

    public ServiceProvider verifyProvider(Long id) {

        ServiceProvider provider = repo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Provider not found"));

        provider.setIsVerified(true);

        return repo.save(provider);
    }

    // ================= DELETE =================

    public void deleteProvider(Long id) {

        if (!repo.existsById(id)) {
            throw new RuntimeException("Provider not found");
        }

        repo.deleteById(id);
    }

    // ================= COUNT =================

    public Long countVerifiedProviders() {
        return repo.countByIsVerified(true);
    }

    // ================= PROFILE PHOTO =================

    public String uploadProfilePhoto(Long providerId,
                                     MultipartFile file) {

        ServiceProvider provider = repo.findById(providerId)
                .orElseThrow(() ->
                        new RuntimeException("Provider not found"));

        // TODO : Save image into uploads folder

        String imagePath = "uploads/profile/default.jpg";

        provider.setProfileImage(imagePath);

        repo.save(provider);

        return imagePath;
    }

    // ================= GET PROFILE =================

    public ProviderProfileDTO getProfile(Long providerId) {

        ServiceProvider provider = repo.findById(providerId)
                .orElseThrow(() ->
                        new RuntimeException("Provider not found"));

        ProviderProfileDTO dto = new ProviderProfileDTO();

        User user = provider.getUser();

        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());

        dto.setLocation(provider.getLocation());
        dto.setBio(provider.getBio());

        dto.setExperience(provider.getExperience());
        dto.setPrice(provider.getPrice());

        dto.setResponseTime(provider.getResponseTime());

        dto.setProfileImage(provider.getProfileImage());

        dto.setPortfolioImage1(provider.getPortfolioImage1());
        dto.setPortfolioImage2(provider.getPortfolioImage2());
        dto.setPortfolioImage3(provider.getPortfolioImage3());

        return dto;
    }

    // ================= UPDATE PROFILE =================

    public ProviderProfileDTO updateProfile(Long providerId,
                                            ProviderProfileDTO dto) {

        ServiceProvider provider = repo.findById(providerId)
                .orElseThrow(() ->
                        new RuntimeException("Provider not found"));

        User user = provider.getUser();

        user.setName(dto.getName());
        user.setPhone(dto.getPhone());

        userRepository.save(user);

        provider.setLocation(dto.getLocation());
        provider.setBio(dto.getBio());

        provider.setExperience(dto.getExperience());
        provider.setPrice(dto.getPrice());

        provider.setResponseTime(dto.getResponseTime());

        provider.setProfileImage(dto.getProfileImage());

        provider.setPortfolioImage1((String) dto.getPortfolioImage1());
        provider.setPortfolioImage2((String) dto.getPortfolioImage2());
        provider.setPortfolioImage3((String) dto.getPortfolioImage3());

        repo.save(provider);

        return getProfile(providerId);
    }
    public String uploadPhoto(Long providerId, MultipartFile file) {

        try {

            ServiceProvider provider = repo.findById(providerId)
                    .orElseThrow(() ->
                            new RuntimeException("Provider not found"));

            String uploadDir = "uploads/profile/";

            File directory = new File(uploadDir);

            if (!directory.exists()) {
                directory.mkdirs();
            }

            String fileName =
                    System.currentTimeMillis()
                            + "_"
                            + file.getOriginalFilename();

            Path filePath =
                    Paths.get(uploadDir, fileName);

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            String imagePath =
                    "/uploads/profile/" + fileName;

            provider.setProfileImage(imagePath);

            repo.save(provider);

            return imagePath;

        } catch (Exception e) {

            throw new RuntimeException(e);

        }
    }
}