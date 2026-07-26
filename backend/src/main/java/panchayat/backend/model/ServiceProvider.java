package panchayat.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "service_providers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceProvider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"provider", "password"})
    private User user;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private ServiceEntity service;

    private String location;

    @Column(length = 1000)
    private String bio;

    @Column(name = "profile_image")
    private String profileImage;

    @Column(name = "portfolio_image1")
    private String portfolioImage1;

    @Column(name = "portfolio_image2")
    private String portfolioImage2;

    @Column(name = "portfolio_image3")
    private String portfolioImage3;

    private int experience;

    private double price;

    @Column(name = "is_verified")
    private boolean isVerified;

    private String responseTime;

    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ServiceEntity getService() {
        return service;
    }

    public void setService(ServiceEntity service) {
        this.service = service;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public void setProfileImagePath(String imagePath) {
        this.profileImage = imagePath;
    }

    public String getPortfolioImage1() {
        return portfolioImage1;
    }

    public void setPortfolioImage1(String portfolioImage1) {
        this.portfolioImage1 = portfolioImage1;
    }

    public String getPortfolioImage2() {
        return portfolioImage2;
    }

    public void setPortfolioImage2(String portfolioImage2) {
        this.portfolioImage2 = portfolioImage2;
    }

    public String getPortfolioImage3() {
        return portfolioImage3;
    }

    public void setPortfolioImage3(String portfolioImage3) {
        this.portfolioImage3 = portfolioImage3;
    }

    public int getExperience() {
        return experience;
    }

    public void setExperience(int experience) {
        this.experience = experience;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public boolean getIsVerified() {
        return isVerified;
    }

    public void setVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }

    public void setIsVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }

    public String getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(String responseTime) {
        this.responseTime = responseTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
