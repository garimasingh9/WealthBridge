package com.wealthbridge.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column
    private Double monthlyIncome;

    @Column
    private Double monthlyExpenses;

    @Column
    private Double currentSavings;

    @Column
    private Integer age;

    @Column
    private Integer familySize;

    @Column
    private Boolean hasInsurance;

    @Column
    private String provider; // "local" or "google"

    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    public User() {
    }

    public User(Long id, String fullName, String email, String password, Double monthlyIncome, Double monthlyExpenses,
            Double currentSavings, Integer age, Integer familySize, Boolean hasInsurance, String provider,
            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.monthlyIncome = monthlyIncome;
        this.monthlyExpenses = monthlyExpenses;
        this.currentSavings = currentSavings;
        this.age = age;
        this.familySize = familySize;
        this.hasInsurance = hasInsurance;
        this.provider = provider;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Double getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(Double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public Double getMonthlyExpenses() {
        return monthlyExpenses;
    }

    public void setMonthlyExpenses(Double monthlyExpenses) {
        this.monthlyExpenses = monthlyExpenses;
    }

    public Double getCurrentSavings() {
        return currentSavings;
    }

    public void setCurrentSavings(Double currentSavings) {
        this.currentSavings = currentSavings;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Integer getFamilySize() {
        return familySize;
    }

    public void setFamilySize(Integer familySize) {
        this.familySize = familySize;
    }

    public Boolean getHasInsurance() {
        return hasInsurance;
    }

    public void setHasInsurance(Boolean hasInsurance) {
        this.hasInsurance = hasInsurance;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String fullName;
        private String email;
        private String password;
        private Double monthlyIncome;
        private Double monthlyExpenses;
        private Double currentSavings;
        private Integer age;
        private Integer familySize;
        private Boolean hasInsurance;
        private String provider;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        UserBuilder() {
        }

        public UserBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder password(String password) {
            this.password = password;
            return this;
        }

        public UserBuilder monthlyIncome(Double monthlyIncome) {
            this.monthlyIncome = monthlyIncome;
            return this;
        }

        public UserBuilder monthlyExpenses(Double monthlyExpenses) {
            this.monthlyExpenses = monthlyExpenses;
            return this;
        }

        public UserBuilder currentSavings(Double currentSavings) {
            this.currentSavings = currentSavings;
            return this;
        }

        public UserBuilder age(Integer age) {
            this.age = age;
            return this;
        }

        public UserBuilder familySize(Integer familySize) {
            this.familySize = familySize;
            return this;
        }

        public UserBuilder hasInsurance(Boolean hasInsurance) {
            this.hasInsurance = hasInsurance;
            return this;
        }

        public UserBuilder provider(String provider) {
            this.provider = provider;
            return this;
        }

        public UserBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public UserBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public User build() {
            return new User(id, fullName, email, password, monthlyIncome, monthlyExpenses, currentSavings, age,
                    familySize, hasInsurance, provider, createdAt, updatedAt);
        }
    }
}
