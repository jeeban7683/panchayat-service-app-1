package panchayat.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import panchayat.backend.model.Review;
import panchayat.backend.repository.ReviewRepository;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository repo;

    // Save review
    public Review addReview(Review review){
        return repo.save(review);
    }

    // Get reviews of a provider
    public List<Review> getProviderReviews(Long providerId){
        return repo.findByProviderId(providerId);
    }

    // Get all reviews
    public List<Review> getAllReviews(){
        return repo.findAll();
    }

    // Delete review
    public void deleteReview(Long id){
        repo.deleteById(id);
    }
}