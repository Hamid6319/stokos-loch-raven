import Navbar from "@/components/navbar";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Categories from "../components/categories";
// import Herosection from "@/components/herosection";
// import TrustBar from "@/components/trustbar";
// import Features from "@/components/feature";
// import HowItWorks from "@/components/HowItWorks"; 
// import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Header />  
       <Hero />  
      <Categories />

    </main>
  );
}
