package com.backend.backend.auth;

import java.util.List;

public class AdminStatsResponse {
    private Double totalSales;
    private Long totalOrders;
    private Long totalClients;
    private Long totalProducts;

    private List<MonthSale> monthlySales;
    private List<CategoryItem> categoryDistribution;
    private List<com.backend.backend.auth.RecentOrderDto> recentOrders;
    private List<com.backend.backend.auth.TopProductDto> topProducts;

    public static class MonthSale {
        private String month;
        private Double total;

        public MonthSale() {}
        public MonthSale(String month, Double total) { this.month = month; this.total = total; }
        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }
        public Double getTotal() { return total; }
        public void setTotal(Double total) { this.total = total; }
    }

    public static class CategoryItem {
        private String name;
        private Long value;

        public CategoryItem() {}
        public CategoryItem(String name, Long value) { this.name = name; this.value = value; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Long getValue() { return value; }
        public void setValue(Long value) { this.value = value; }
    }

    public AdminStatsResponse() {}

    public Double getTotalSales() { return totalSales; }
    public void setTotalSales(Double totalSales) { this.totalSales = totalSales; }

    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public Long getTotalClients() { return totalClients; }
    public void setTotalClients(Long totalClients) { this.totalClients = totalClients; }

    public Long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(Long totalProducts) { this.totalProducts = totalProducts; }

    public List<MonthSale> getMonthlySales() { return monthlySales; }
    public void setMonthlySales(List<MonthSale> monthlySales) { this.monthlySales = monthlySales; }

    public List<CategoryItem> getCategoryDistribution() { return categoryDistribution; }
    public void setCategoryDistribution(List<CategoryItem> categoryDistribution) { this.categoryDistribution = categoryDistribution; }

    public List<com.backend.backend.auth.RecentOrderDto> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<com.backend.backend.auth.RecentOrderDto> recentOrders) { this.recentOrders = recentOrders; }

    public List<com.backend.backend.auth.TopProductDto> getTopProducts() { return topProducts; }
    public void setTopProducts(List<com.backend.backend.auth.TopProductDto> topProducts) { this.topProducts = topProducts; }
}