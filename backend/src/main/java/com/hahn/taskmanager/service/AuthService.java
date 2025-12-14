package com.hahn.taskmanager.service;

import com.hahn.taskmanager.dto.AuthResponse;
import com.hahn.taskmanager.dto.LoginRequest;
import com.hahn.taskmanager.entity.User;
import com.hahn.taskmanager.repository.UserRepository;
import com.hahn.taskmanager.security.JwtUtil;
import com.hahn.taskmanager.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token, user.getEmail(), user.getName());
    }
    public AuthResponse register(RegisterRequest request) {
      // 1. Check if passwords match
      if (!request.getPassword().equals(request.getConfirmPassword())) {
          throw new RuntimeException("Passwords do not match");
      }

      // 2. Check if email already exists
      if (userRepository.existsByEmail(request.getEmail())) {
          throw new RuntimeException("Email already registered");
      }

      // 3. Create new user
      User user = new User();
      user.setName(request.getName());
      user.setEmail(request.getEmail());
      user.setPassword(passwordEncoder.encode(request.getPassword())); // Hash password        

      // 4. Save user to database
      User savedUser = userRepository.save(user);

      // 5. Generate JWT token
      String token = jwtUtil.generateToken(savedUser.getEmail());

      // 6. Return response (same as login)
      return new AuthResponse(token, savedUser.getEmail(), savedUser.getName());
  }
}
