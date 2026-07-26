package panchayat.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import panchayat.backend.model.Role;
import panchayat.backend.model.ServiceEntity;
import panchayat.backend.model.User;
import panchayat.backend.repository.ServiceRepository;
import panchayat.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // List of default services to ensure exist
        List<ServiceEntity> defaultServices = Arrays.asList(
            createService("Plumber", "Professional plumbing installation, repair, and pipe maintenance services."),
            createService("Electrician", "Certified electrical system diagnostics, wiring, and repair services."),
            createService("RO Repair", "Expert maintenance, filter replacements, and repairs for RO water purifiers."),
            createService("Carpenter", "Premium woodwork, furniture repair, assembly, and custom carpentry services."),
            createService("Cleaner", "Deep cleaning, sanitization, and dust cleaning services for homes and offices."),
            createService("Painter", "Professional wall painting, color consultation, texture painting, and wall styling."),
            createService("Pest Control", "Comprehensive pest control, disinfection, and sanitation services.")
        );

        // Fetch current services to avoid duplicates
        List<ServiceEntity> existingServices = serviceRepository.findAll();

        for (ServiceEntity defaultService : defaultServices) {
            boolean exists = existingServices.stream()
                .anyMatch(s -> s.getName().equalsIgnoreCase(defaultService.getName()));
            if (!exists) {
                serviceRepository.save(defaultService);
                System.out.println("Seeded service: " + defaultService.getName());
            }
        }

        // Seed admin user
        String adminEmail = "jeevanjyotigochhayatjitu@gmail.com";
        List<User> allUsers = userRepository.findAll();
        List<User> adminUsers = allUsers.stream()
            .filter(u -> u.getEmail() != null && u.getEmail().equalsIgnoreCase(adminEmail))
            .collect(java.util.stream.Collectors.toList());

        if (adminUsers.isEmpty()) {
            User admin = new User();
            admin.setName("Jeevan Admin");
            admin.setEmail(adminEmail);
            admin.setPhone("9999999999");
            admin.setRole(Role.ADMIN);
            admin.setPassword(passwordEncoder.encode("Jeevan@2005"));
            admin.setCreatedAt(LocalDateTime.now());
            userRepository.save(admin);
            System.out.println("Seeded Admin user: " + adminEmail);
        } else {
            User admin = adminUsers.get(0);
            boolean updated = false;
            if (admin.getRole() != Role.ADMIN) {
                admin.setRole(Role.ADMIN);
                updated = true;
            }
            if (!passwordEncoder.matches("Jeevan@2005", admin.getPassword())) {
                admin.setPassword(passwordEncoder.encode("Jeevan@2005"));
                updated = true;
            }
            if (updated) {
                userRepository.save(admin);
                System.out.println("Updated existing Admin user role/password: " + adminEmail);
            }

            if (adminUsers.size() > 1) {
                for (int i = 1; i < adminUsers.size(); i++) {
                    userRepository.delete(adminUsers.get(i));
                }
                System.out.println("Deleted " + (adminUsers.size() - 1) + " duplicate Admin users.");
            }
        }
    }

    private ServiceEntity createService(String name, String description) {
        ServiceEntity service = new ServiceEntity();
        service.setName(name);
        service.setDescription(description);
        return service;
    }
}
