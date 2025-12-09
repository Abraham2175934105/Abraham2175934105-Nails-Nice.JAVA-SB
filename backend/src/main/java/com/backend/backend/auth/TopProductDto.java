package com.backend.backend.auth;

public class TopProductDto {
    private Integer id;
    private String name;
    private Long sales;
    private Double revenue;

    public TopProductDto() {}

    public TopProductDto(Integer id, String name, Long sales, Double revenue) {
        this.id = id;
        this.name = name;
        this.sales = sales;
        this.revenue = revenue;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getSales() { return sales; }
    public void setSales(Long sales) { this.sales = sales; }

    public Double getRevenue() { return revenue; }
    public void setRevenue(Double revenue) { this.revenue = revenue; }
}