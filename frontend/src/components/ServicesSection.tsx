import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, MapPin, Clock, Star } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      title: "Manicure & Pedicure",
      duration: "60-90 min",
      price: "Desde $25",
      icon: Star
    },
    {
      title: "Diseño de Uñas",
      duration: "90-120 min",
      price: "Desde $35",
      icon: Star
    },
    {
      title: "Tratamiento Facial",
      duration: "60 min",
      price: "Desde $40",
      icon: Star
    }
  ];

  const locations = [
    "Centro Comercial Plaza Norte",
    "Av. Principal #123, Centro",
    "Mall del Sur, Local 45"
  ];

  return (
    <section id="servicios" className="py-16 gradient-soft">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h3 className="text-4xl font-bold mb-4">Agenda tu Cita</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Visita uno de nuestros estudios especializados y recibe atención profesional personalizada
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className="p-6 shadow-medium hover:shadow-deep transition-smooth hover:-translate-y-1 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{service.title}</h4>
                  <p className="text-sm text-muted-foreground">{service.duration}</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-primary mb-4">
                {service.price}
              </div>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Ubicaciones */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h4 className="text-2xl font-bold">Nuestras Sedes</h4>
            </div>
            <div className="space-y-3">
              {locations.map((location, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg bg-card shadow-soft hover:shadow-medium transition-smooth"
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-foreground">{location}</span>
                </div>
              ))}
            </div>
            
            <Card className="mt-6 p-6 shadow-medium border-2 border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-bold text-foreground">Horario de Atención</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-accent/30 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Lunes - Viernes</p>
                  <p className="font-bold text-foreground">9:00 AM - 8:00 PM</p>
                </div>
                <div className="p-3 bg-accent/30 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Sábados</p>
                  <p className="font-bold text-foreground">9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </Card>
          </div>

          {/* WhatsApp CTA */}
          <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <Card className="p-8 shadow-deep bg-primary/10 border-2 border-primary/20 text-center">
              <MessageCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h4 className="text-3xl font-bold text-foreground mb-3">
                Reserva por WhatsApp
              </h4>
              <p className="text-muted-foreground mb-6">
                Contacta con nuestro asesor para agendar tu cita en la sede de tu preferencia
              </p>
              <Button 
                variant="default"
                size="lg" 
                className="w-full shadow-medium hover:shadow-deep"
                onClick={() => window.open('https://wa.me/1234567890', '_blank')}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Chatear Ahora
              </Button>
              <p className="text-sm text-foreground/80 mt-4 font-semibold">
                Respuesta inmediata • Atención personalizada
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
