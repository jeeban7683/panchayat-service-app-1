package panchayat.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import panchayat.backend.dto.ProviderProfileDTO;
import panchayat.backend.model.ServiceProvider;
import panchayat.backend.repository.ProviderRepository;
import panchayat.backend.service.ProviderService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "${app.frontend.url}")
public class ProviderController {

    @Autowired
    private ProviderService service;

    @GetMapping("/verified")
    public List<ServiceProvider> getVerifiedProviders() {

        return service.getVerified();
    }

    @GetMapping
    public List<ServiceProvider> getAllProviders() {

        return service.getAll();
    }

    @GetMapping("/{id}")
    public ServiceProvider getProviderById(
            @PathVariable Long id) {

        return service.getById(id);
    }

    @GetMapping("/pending")
    public List<ServiceProvider> getPendingProviders() {

        return service.getPendingProviders();
    }

    @PutMapping("/{id}/verify")
    public ServiceProvider verifyProvider(
            @PathVariable Long id) {

        return service.verifyProvider(id);
    }

    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<java.util.Map<String, String>> deleteProvider(
            @PathVariable Long id) {
        service.deleteProvider(id);
        return org.springframework.http.ResponseEntity
                .ok(java.util.Map.of("message", "Provider rejected and removed successfully"));
    }

    @Autowired
    private ProviderRepository providerRepository;

    @GetMapping("/verified/count")
    public Long getVerifiedCount() {
        return providerRepository.countByIsVerified(true);
    }

    @GetMapping("/unverified")
    public List<ServiceProvider> getUnverifiedProviders() {
        return providerRepository.findByIsVerified(false);
    }


    @PutMapping("/profile/{providerId}")
    public ResponseEntity<ProviderProfileDTO> updateProfile(
            @PathVariable Long providerId,
            @RequestBody ProviderProfileDTO dto) {

        return ResponseEntity.ok(
                service.updateProfile(providerId, dto));
    }


    // New path: POST /api/providers/{providerId}/upload-photo
    @PostMapping("/{providerId}/upload-photo")
    public ResponseEntity<Map<String, String>> uploadPhotoById(
            @PathVariable Long providerId,
            @RequestParam("file") MultipartFile file) {

        String imagePath = service.uploadPhoto(providerId, file);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Photo uploaded successfully",
                        "profileImage", imagePath,
                        "imageUrl", imagePath));
    }

    @GetMapping("/{id}/profile")
    public ProviderProfileDTO getProviderProfile(
            @PathVariable Long id) {

        ProviderProfileDTO profile = service.getProfile(id);

        return profile;
    }
    @PutMapping("/{id}/profile")
    public ProviderProfileDTO updateProviderProfile(
            @PathVariable Long id,
            @RequestBody ProviderProfileDTO dto) {

        return service.updateProfile(id, dto);
    }


}
