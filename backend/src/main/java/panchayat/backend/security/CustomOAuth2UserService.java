package panchayat.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import panchayat.backend.model.Role;
import panchayat.backend.model.User;
import panchayat.backend.repository.UserRepository;

import java.time.LocalDateTime;

@Service
public class CustomOAuth2UserService
        implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {

        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate =
                new DefaultOAuth2UserService();

        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");

        String name = oAuth2User.getAttribute("name");
        if (name == null || name.trim().isEmpty()) {
            name = email != null ? email.split("@")[0] : "Google User";
        }

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {

            user = new User();

            user.setName(name);

            user.setEmail(email);

            user.setRole(Role.USER);

            user.setCreatedAt(LocalDateTime.now());

            user.setPassword("");

            userRepository.save(user);
        }

        return oAuth2User;
    }
}