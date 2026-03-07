package com.wealthbridge.dto;

public class ProfileDto {
    private Double monthlyIncome;
    private Double monthlyExpenses;
    private Double currentSavings;
    private Integer age;
    private Integer familySize;
    private Boolean hasInsurance;

    public ProfileDto() {
    }

    public ProfileDto(Double monthlyIncome, Double monthlyExpenses, Double currentSavings, Integer age,
            Integer familySize, Boolean hasInsurance) {
        this.monthlyIncome = monthlyIncome;
        this.monthlyExpenses = monthlyExpenses;
        this.currentSavings = currentSavings;
        this.age = age;
        this.familySize = familySize;
        this.hasInsurance = hasInsurance;
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
}
