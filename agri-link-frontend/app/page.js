import HomeSections from "../components/home-sections/home-sections-container";
import Footer from "../components/footer/footer";
import HeroSection from "../components/hero-section/hero-section";
import NavBar from "../components/navbar/navbar";

export default function Home() {
  return (
    <div>
      <NavBar />
      <HeroSection />
      <HomeSections />
      <Footer />
    </div>
  );
}
