package panchayat.backend.controller;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TrackingRequest {
    private Long providerId;
    private Double latitude;
    private Double longitude;

    // Default constructor (required for Spring)
    public TrackingRequest() {}

    // Constructor (optional, for manual instantiation)
    public TrackingRequest(Long providerId, Double latitude, Double longitude) {
        this.providerId = providerId;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Long getProviderId() {
        this.providerId = providerId;

        return 0L;
    }

    public Double getLatitude() {
        this.latitude = latitude;
        return latitude;
    }

    public Double getLongitude() {
        this.longitude = longitude;
        return longitude;
    }
}
