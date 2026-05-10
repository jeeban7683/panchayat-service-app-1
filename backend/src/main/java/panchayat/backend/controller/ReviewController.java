package panchayat.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import panchayat.backend.model.Review;
import panchayat.backend.service.ReviewService;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    @Autowired
    private ReviewService service;

    // Add review
    @PostMapping
    public Review addReview(@RequestBody Review review){
        return service.addReview(review);
    }

    // Get reviews for provider
    @GetMapping("/provider/{providerId}")
    public List<Review> getReviews(@PathVariable Long providerId){
        return service.getProviderReviews(providerId);
    }
}
