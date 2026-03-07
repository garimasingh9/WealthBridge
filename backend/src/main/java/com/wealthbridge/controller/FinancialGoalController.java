package com.wealthbridge.controller;

import com.wealthbridge.dto.FinancialGoalDto;
import com.wealthbridge.model.FinancialGoal;
import com.wealthbridge.model.User;
import com.wealthbridge.repository.FinancialGoalRepository;
import com.wealthbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FinancialGoalController {

    @Autowired
    private FinancialGoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<FinancialGoalDto>> getGoals(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<FinancialGoal> goals = goalRepository.findByUserId(user.getId());

        List<FinancialGoalDto> goalDtos = goals.stream()
                .map(g -> new FinancialGoalDto(
                        g.getId(),
                        g.getName(),
                        g.getTargetAmount(),
                        g.getCurrentAmount(),
                        g.getDeadline().toString(),
                        g.getIcon()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(goalDtos);
    }

    @PostMapping
    public ResponseEntity<FinancialGoalDto> createGoal(@RequestBody FinancialGoalDto goalDto,
            Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FinancialGoal goal = new FinancialGoal(
                null,
                user,
                goalDto.getName(),
                goalDto.getTarget(),
                goalDto.getSaved() != null ? goalDto.getSaved() : 0.0,
                LocalDate.parse(goalDto.getDeadline()),
                goalDto.getIcon());

        goal = goalRepository.save(goal);

        goalDto.setId(goal.getId());
        return ResponseEntity.ok(goalDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FinancialGoalDto> updateGoal(@PathVariable Long id, @RequestBody FinancialGoalDto goalDto,
            Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FinancialGoal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        goal.setName(goalDto.getName());
        goal.setTargetAmount(goalDto.getTarget());
        goal.setCurrentAmount(goalDto.getSaved());
        goal.setDeadline(LocalDate.parse(goalDto.getDeadline()));
        goal.setIcon(goalDto.getIcon());

        goal = goalRepository.save(goal);

        return ResponseEntity.ok(goalDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FinancialGoal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        goalRepository.delete(goal);
        return ResponseEntity.ok().build();
    }
}
