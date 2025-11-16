package com.backend.backend.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "servicio_cliente")
public class ServicioCliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_servicio_cliente")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @Column(name = "canal_comunicacion", nullable = false, length = 50)
    private String canalComunicacion;

    @Column(name = "promociones")
    private Integer promociones;

    @Column(name = "cupones")
    private Integer cupones;

    @Column(name = "fecha_contacto", nullable = false)
    private LocalDate fechaContacto;

    @Column(name = "estado_ticket", nullable = false, length = 20)
    private String estadoTicket;

    @Column(name = "control_agendamiento", nullable = false, length = 20)
    private String controlAgendamiento;

    // Getters y Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public String getCanalComunicacion() {
        return canalComunicacion;
    }

    public void setCanalComunicacion(String canalComunicacion) {
        this.canalComunicacion = canalComunicacion;
    }

    public Integer getPromociones() {
        return promociones;
    }

    public void setPromociones(Integer promociones) {
        this.promociones = promociones;
    }

    public Integer getCupones() {
        return cupones;
    }

    public void setCupones(Integer cupones) {
        this.cupones = cupones;
    }

    public LocalDate getFechaContacto() {
        return fechaContacto;
    }

    public void setFechaContacto(LocalDate fechaContacto) {
        this.fechaContacto = fechaContacto;
    }

    public String getEstadoTicket() {
        return estadoTicket;
    }

    public void setEstadoTicket(String estadoTicket) {
        this.estadoTicket = estadoTicket;
    }

    public String getControlAgendamiento() {
        return controlAgendamiento;
    }

    public void setControlAgendamiento(String controlAgendamiento) {
        this.controlAgendamiento = controlAgendamiento;
    }

}
