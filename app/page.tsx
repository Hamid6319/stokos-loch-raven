import Navbar from "@/components/navbar";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Categories from "../components/categories";
import MenuSection from "@/components/menusection";
import { PRODUCTS } from "@/lib/data/products";
import { POPULAR_ITEMS } from "@/lib/data/popularitems";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Header />  
       <Hero />  
      <Categories />
    {/* <MenuSection title="Popular Menu Items" products={POPULAR_ITEMS} /> */}
     <MenuSection title="Pizzas" products={PRODUCTS} />
    </main>
  );
}
