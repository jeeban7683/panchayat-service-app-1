package panchayat.backend.dto;

public class ProviderProfileDTO {

    private Long providerId;

    private String name;

    private String email;

    private String phone;

    private String location;

    private String bio;

    private Integer experience;

    private Double price;

    private String responseTime;

    private Long serviceId;

    private String profileImage;

    private String portfolioImage1;

    private String portfolioImage2;

    private String portfolioImage3;

    public ProviderProfileDTO() {
    }

    public Long getProviderId() {
        return providerId;
    }

    public void setProviderId(Long providerId) {
        this.providerId = providerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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

    public Integer getExperience() {
        return experience == null ? 0 : experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

    public Double getPrice() {
        return price == null ? 0.0 : price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(String responseTime) {
        this.responseTime = responseTime;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
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
}
