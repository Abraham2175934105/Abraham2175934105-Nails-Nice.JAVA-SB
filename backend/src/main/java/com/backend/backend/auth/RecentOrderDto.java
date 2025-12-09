package com.backend.backend.auth;

import java.time.LocalDate;

public class RecentOrderDto {
    private Integer id;
    private String customer;
    private Double amount;
    private String status;
    private LocalDate date;

    public RecentOrderDto() {}

    public RecentOrderDto(Integer id, String customer, Double amount, String status, LocalDate date) {
        this.id = id;
        this.customer = customer;
        this.amount = amount;
        this.status = status;
        this.date = date;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getCustomer() { return customer; }
    public void setCustomer(String customer) { this.customer = customer; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}