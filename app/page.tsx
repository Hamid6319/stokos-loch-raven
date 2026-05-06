import Navbar from "@/components/navbar";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Categories from "../components/categories";
import MenuSection from "@/components/menusection";
import { PRODUCTS } from "@/lib/data/products";
import { POPULAR_ITEMS } from "@/lib/data/popularitems";



export default function Home() {
  return (
    <main className="bg-white dark:bg-black min-h-screen">
      <Navbar />
      <Header />  
      <Hero />  
      <Categories />
      
      {/* 
         Wrapping sections in a container. 
         Note: The 'id' props must match the 'id's in CATEGORIES array 
      */}
      <div className="flex flex-col pb-20">
        
        <MenuSection 
          id="trending" 
          title="Popular Menu Items" 
          products={POPULAR_ITEMS.filter((p: any) => p.category === "trending")} 
        />

        <MenuSection 
          id="pizzas" 
          title="Pizzas" 
         products={PRODUCTS.filter((p: any) => p.category === "pizzas")}
        />


        {/* Add more sections as needed matching the IDs in your Categories list */}
        
      </div>
    </main>
  );
}