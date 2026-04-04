import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import Platform from './components/RentEase';
import Services from './components/Services';
import FeaturedProperties from './components/FeaturedProperties';
import HowItWorks from './components/HowItWorks';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWA from './components/FloatingWA';

export default function App() {
  return (
    <div className="site-wrapper">
      <Loader />
      <Navbar />

      <main>
        <Hero />
        <StatsBar />
        <Platform />
        <Services />
        <FeaturedProperties />
        <HowItWorks />
        <WhyChooseUs />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
      <FloatingWA />
    </div>
  );
}
