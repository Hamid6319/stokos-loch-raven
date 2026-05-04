import Navbar from "@/components/navbar";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Categories from "../components/categories";
import MenuSection from "@/components/menusection";
import { PRODUCTS } from "@/lib/data/products";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Header />  
       <Hero />  
      <Categories />
     <MenuSection title="Pizzas" products={PRODUCTS} />
    </main>
  );
}
