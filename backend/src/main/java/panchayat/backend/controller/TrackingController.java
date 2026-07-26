package panchayat.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import panchayat.backend.model.ProviderLiveLocation;
import panchayat.backend.service.ProviderTrackingService;

@RestController
@RequestMapping("/api/tracking")
@CrossOrigin(origins = "http://localhost:5173")
public class TrackingController {


    @Autowired
    private ProviderTrackingService service;

    @PostMapping("/update")
    public ProviderLiveLocation updateLocation(
            @RequestBody TrackingRequest request
    ) {
        return service.updateLocation(
                request.getProviderId(),
                request.getLatitude(),
                request.getLongitude()
        );
    }

    @GetMapping("/{providerId}")
    public ProviderLiveLocation getLocation(
            @PathVariable Long providerId
    ) {
        return service.getLocation(providerId);
    }
}