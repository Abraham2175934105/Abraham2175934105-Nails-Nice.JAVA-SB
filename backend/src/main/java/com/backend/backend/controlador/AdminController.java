package com.backend.backend.controlador;

import com.backend.backend.auth.AdminStatsResponse;
import com.backend.backend.auth.RecentOrderDto;
import com.backend.backend.auth.TopProductDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @PersistenceContext
    private EntityManager em;

    @SuppressWarnings("unchecked")
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        AdminStatsResponse resp = new AdminStatsResponse();

        // Totales simples
        Number totalSalesN = (Number) em.createNativeQuery("SELECT COALESCE(SUM(monto_venta),0) FROM ventas").getSingleResult();
        Number totalOrdersN = (Number) em.createNativeQuery("SELECT COUNT(*) FROM ventas").getSingleResult();
        Number totalClientsN = (Number) em.createNativeQuery("SELECT COUNT(*) FROM clientes").getSingleResult();
        Number totalProductsN = (Number) em.createNativeQuery("SELECT COUNT(*) FROM productos").getSingleResult();

        resp.setTotalSales(totalSalesN != null ? totalSalesN.doubleValue() : 0d);
        resp.setTotalOrders(totalOrdersN != null ? totalOrdersN.longValue() : 0L);
        resp.setTotalClients(totalClientsN != null ? totalClientsN.longValue() : 0L);
        resp.setTotalProducts(totalProductsN != null ? totalProductsN.longValue() : 0L);

        // Ventas mensuales (últimos 6 meses) - MySQL DATE_FORMAT
        List<Object[]> monthlyRaw = (List<Object[]>) em.createNativeQuery(
                "SELECT DATE_FORMAT(fecha_de_venta, '%Y-%m') as ym, COALESCE(SUM(monto_venta),0) as total " +
                "FROM ventas " +
                "GROUP BY ym " +
                "ORDER BY ym DESC " +
                "LIMIT 6"
        ).getResultList();

        List<AdminStatsResponse.MonthSale> months = monthlyRaw.stream()
                .map(r -> new AdminStatsResponse.MonthSale((String) r[0], ((Number) r[1]).doubleValue()))
                .collect(Collectors.toList());
        // invertir para orden cronológico ascendente
        Collections.reverse(months);
        resp.setMonthlySales(months);

        // Distribución por categoría: contar productos por categoría
        List<Object[]> catRaw = (List<Object[]>) em.createNativeQuery(
                "SELECT c.nombre_categoria, COUNT(p.id_producto) as cnt " +
                "FROM categoria c " +
                "LEFT JOIN productos p ON p.id_categoria = c.id_categoria " +
                "GROUP BY c.id_categoria, c.nombre_categoria"
        ).getResultList();

        List<AdminStatsResponse.CategoryItem> cats = catRaw.stream()
                .map(r -> new AdminStatsResponse.CategoryItem((String) r[0], ((Number) r[1]).longValue()))
                .collect(Collectors.toList());
        resp.setCategoryDistribution(cats);

        // Órdenes recientes (últimas 5)
        List<Object[]> ordersRaw = (List<Object[]>) em.createNativeQuery(
                "SELECT v.id_ventas, CONCAT(u.nombre1,' ',COALESCE(u.apellido1,'')) AS customer, COALESCE(v.monto_venta,0) AS amount, v.estado_venta, v.fecha_de_venta " +
                "FROM ventas v " +
                "LEFT JOIN clientes cl ON v.id_cliente = cl.id_cliente " +
                "LEFT JOIN usuarios u ON cl.id_usuario = u.id_usuario " +
                "ORDER BY v.fecha_de_venta DESC, v.id_ventas DESC " +
                "LIMIT 5"
        ).getResultList();

        List<RecentOrderDto> recent = ordersRaw.stream().map(r -> {
            Integer id = ((Number) r[0]).intValue();
            String customer = r[1] != null ? (String) r[1] : "Cliente";
            Double amount = r[2] != null ? ((Number) r[2]).doubleValue() : 0d;
            String status = r[3] != null ? (String) r[3] : "";
            LocalDate date = null;
            if (r[4] instanceof java.sql.Date) {
                date = ((java.sql.Date) r[4]).toLocalDate();
            } else if (r[4] instanceof java.sql.Timestamp) {
                date = ((java.sql.Timestamp) r[4]).toLocalDateTime().toLocalDate();
            }
            return new RecentOrderDto(id, customer, amount, status, date);
        }).collect(Collectors.toList());
        resp.setRecentOrders(recent);

        // Top productos por ventas (cantidad) y revenue
        List<Object[]> topRaw = (List<Object[]>) em.createNativeQuery(
                "SELECT p.id_producto, p.nombre, COALESCE(SUM(d.cantidad),0) AS total_sales, COALESCE(SUM(d.subtotal),0) AS revenue " +
                "FROM detalle_venta d " +
                "JOIN productos p ON d.id_producto = p.id_producto " +
                "GROUP BY p.id_producto, p.nombre " +
                "ORDER BY total_sales DESC " +
                "LIMIT 5"
        ).getResultList();

        List<TopProductDto> topProducts = topRaw.stream().map(r -> {
            Integer id = ((Number) r[0]).intValue();
            String name = r[1] != null ? (String) r[1] : "";
            Long sales = r[2] != null ? ((Number) r[2]).longValue() : 0L;
            Double revenue = r[3] != null ? ((Number) r[3]).doubleValue() : 0d;
            return new TopProductDto(id, name, sales, revenue);
        }).collect(Collectors.toList());
        resp.setTopProducts(topProducts);

        return ResponseEntity.ok(resp);
    }
}