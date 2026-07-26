package panchayat.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import panchayat.backend.dto.ForgotPasswordRequest;
import panchayat.backend.dto.LoginRequest;
import panchayat.backend.dto.RegisterRequest;
import panchayat.backend.dto.VerifyOtpRequest;
import panchayat.backend.model.PasswordResetOtp;
import panchayat.backend.model.Role;
import panchayat.backend.model.ServiceProvider;
import panchayat.backend.model.User;
import panchayat.backend.repository.PasswordResetOtpRepository;
import panchayat.backend.repository.ProviderRepository;
import panchayat.backend.repository.ServiceRepository;
import panchayat.backend.repository.UserRepository;
import panchayat.backend.security.JwtUtil;
import panchayat.backend.service.EmailService;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordResetOtpRepository otpRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.ADMIN && !user.getEmail().equalsIgnoreCase("jeevanjyotigochhayatjitu@gmail.com")) {
            throw new RuntimeException("Unauthorized admin access");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public Object register(@RequestBody RegisterRequest request) {
        if (request.getRole().equalsIgnoreCase("ADMIN")) {
            if (!request.getEmail().equalsIgnoreCase("jeevanjyotigochhayatjitu@gmail.com")) {
                throw new RuntimeException("Only authorized email is permitted to register as Admin.");
            }
            if (!request.getPassword().equals("Jeevan@2005")) {
                throw new RuntimeException("Invalid Admin Secret Password. Registration denied.");
            }
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Email already registered");
        }

        User user = new User();
        user.setCreatedAt(LocalDateTime.now());
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.valueOf(request.getRole()));

        User savedUser = userRepository.save(user);

        // PROVIDER Specific setup
        if (request.getRole().equals("PROVIDER")) {
            ServiceProvider provider = new ServiceProvider();
            provider.setUser(savedUser);
            provider.setVerified(false);
            provider.setCreatedAt(LocalDateTime.now());
            provider.setExperience(request.getExperience());
            provider.setResponseTime(
                    request.getResponseTime() != null && !request.getResponseTime().isEmpty()
                            ? request.getResponseTime()
                            : "Fast (under 1hr)"
            );
            provider.setService(
                    serviceRepository.findById(request.getServiceId())
                            .orElseThrow(() -> new RuntimeException("Service not found"))
            );

            providerRepository.save(provider);
        }

        return savedUser;
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String otp = String.valueOf(100000 + new SecureRandom().nextInt(900000));

        PasswordResetOtp resetOtp = otpRepository.findByEmail(request.getEmail())
                .orElse(new PasswordResetOtp());

        resetOtp.setEmail(request.getEmail());
        resetOtp.setOtp(otp);
        resetOtp.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        otpRepository.save(resetOtp);

        emailService.sendOtp(request.getEmail(), otp);

        return "OTP Sent Successfully";
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestBody VerifyOtpRequest request) {
        PasswordResetOtp otpRecord = otpRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("OTP record not found"));

        if (otpRecord.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        if (!otpRecord.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        return "OTP Verified";
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        PasswordResetOtp otpRecord = otpRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid or expired OTP session"));

        if (otpRecord.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpRepository.delete(otpRecord);
            throw new RuntimeException("OTP expired");
        }

        if (!otpRecord.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        otpRepository.delete(otpRecord); // Clear OTP after success

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(jakarta.servlet.http.HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Unauthorized: No token provided");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);

        if (email == null) {
            return ResponseEntity.status(401).body("Unauthorized: Invalid token");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user);
    }

    @GetMapping("/test-mail")
    public String testMail() {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("YOUR_EMAIL@gmail.com");
        message.setSubject("Spring Boot Mail Test");
        message.setText("If you received this email, JavaMailSender is working.");

        mailSender.send(message);

        return "Mail Sent";
    }
}