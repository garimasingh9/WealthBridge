package com.wealthbridge.controller;

import com.wealthbridge.dto.ProfileDto;
import com.wealthbridge.model.User;
import com.wealthbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ProfileDto> getProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProfileDto profileDto = new ProfileDto(
                user.getMonthlyIncome(),
                user.getMonthlyExpenses(),
                user.getCurrentSavings(),
                user.getAge(),
                user.getFamilySize(),
                user.getHasInsurance());

        return ResponseEntity.ok(profileDto);
    }

    @PutMapping
    public ResponseEntity<ProfileDto> updateProfile(@RequestBody ProfileDto profileDto, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setMonthlyIncome(profileDto.getMonthlyIncome());
        user.setMonthlyExpenses(profileDto.getMonthlyExpenses());
        user.setCurrentSavings(profileDto.getCurrentSavings());
        user.setAge(profileDto.getAge());
        user.setFamilySize(profileDto.getFamilySize());
        user.setHasInsurance(profileDto.getHasInsurance());

        userRepository.save(user);

        return ResponseEntity.ok(profileDto);
    }
}
