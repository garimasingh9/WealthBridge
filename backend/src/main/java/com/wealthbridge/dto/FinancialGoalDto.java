package com.wealthbridge.dto;

public class FinancialGoalDto {
    private Long id;
    private String name;
    private Double target;
    private Double saved;
    private String deadline;
    private String icon;

    public FinancialGoalDto() {
    }

    public FinancialGoalDto(Long id, String name, Double target, Double saved, String deadline, String icon) {
        this.id = id;
        this.name = name;
        this.target = target;
        this.saved = saved;
        this.deadline = deadline;
        this.icon = icon;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getTarget() {
        return target;
    }

    public void setTarget(Double target) {
        this.target = target;
    }

    public Double getSaved() {
        return saved;
    }

    public void setSaved(Double saved) {
        this.saved = saved;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
