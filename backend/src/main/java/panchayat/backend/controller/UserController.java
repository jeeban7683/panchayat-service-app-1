package panchayat.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import panchayat.backend.model.User;
import panchayat.backend.repository.UserRepository;
import panchayat.backend.service.UserService;

@RestController
@RequestMapping("/api/users")

@CrossOrigin(origins = "http://localhost:5173")

public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("/register")
    public User register(
            @RequestBody User user
    ) {

        return service.register(user);
    }

   @Autowired
   private UserRepository userRepository;

   @GetMapping("/count")
   public Long getUserCount() {
       return userRepository.count();
   }

   @GetMapping("/{id}")
   public User getUserById(@PathVariable Long id) {
       return userRepository.findById(id)
               .orElseThrow(() -> new RuntimeException("User not found"));
   }

   @GetMapping
   public java.util.List<User> getAllUsers() {
       return userRepository.findAll();
   }
}