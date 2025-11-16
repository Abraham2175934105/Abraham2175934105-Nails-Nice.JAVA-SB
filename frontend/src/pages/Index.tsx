import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryCarousel from "@/components/CategoryCarousel";
import FeaturedProducts from "@/components/FeaturedProducts";
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
        <FeaturedProducts />
        <PromoSection />
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
