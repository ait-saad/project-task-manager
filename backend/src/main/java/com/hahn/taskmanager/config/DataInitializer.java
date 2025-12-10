package com.hahn.taskmanager.config;

import com.hahn.taskmanager.entity.User;
import com.hahn.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create test users if they don't exist
        if (!userRepository.existsByEmail("john@example.com")) {
            User user1 = new User();
            user1.setEmail("john@example.com");
            user1.setPassword(passwordEncoder.encode("password123"));
            user1.setName("John Doe");
            userRepository.save(user1);
        }

        if (!userRepository.existsByEmail("jane@example.com")) {
            User user2 = new User();
            user2.setEmail("jane@example.com");
            user2.setPassword(passwordEncoder.encode("password123"));
            user2.setName("Jane Smith");
            userRepository.save(user2);
        }
    }
}
