package panchayat.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import panchayat.backend.model.Review;
import panchayat.backend.repository.ReviewRepository;
import panchayat.backend.service.ReviewService;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    @Autowired
    private ReviewService service;

    @Autowired
    private ReviewRepository reviewRepository;

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

    // Get all reviews
    @GetMapping
    public List<Review> getAllReviews(){
        return service.getAllReviews();
    }

    // Delete review
    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<java.util.Map<String, String>> deleteReview(@PathVariable Long id){
        service.deleteReview(id);
        return org.springframework.http.ResponseEntity.ok(java.util.Map.of("message", "Review deleted successfully"));
    }
    @GetMapping("/provider/{providerId}/count")
    public Long getReviewCount(
            @PathVariable Long providerId) {

        return reviewRepository
                .countByProviderId(providerId);
    }
    @GetMapping("/provider/{providerId}/rating")
    public Double getAverageRating(
            @PathVariable Long providerId) {

        Double rating =
                reviewRepository.getAverageRating(providerId);

        return rating == null ? 0.0 : rating;
    }
}
