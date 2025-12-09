import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryCarousel from "@/components/CategoryCarousel";
import FeaturedProductSection from "@/components/FeaturedProductSection";
import PromoSection from "@/components/PromoSection";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategoryCarousel />
        <FeaturedProductSection />
        <PromoSection />
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
