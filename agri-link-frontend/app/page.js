import HomeSections from "../components/home-sections/home-sections-container";
import Footer from "../components/footer/footer";
import HeroSection from "../components/hero-section/hero-section";
import NavBar from "../components/navbar/navbar";
import MailingList from "../components/home-sections/mailing-list";

export default function Home() {
  return (
    <div>
      <NavBar />
      <HeroSection />
      <HomeSections />
      <MailingList />
      <Footer />
    </div>
  );
}
