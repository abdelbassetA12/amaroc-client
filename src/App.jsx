 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./app.css";

import { CartProvider } from "./context/CartContext";

import TopBar from "./components/landing/components/TopBar";
import MainNavbar from "./components/landing/components/MainNavbar";
import Footer from "./components/landing/components/Footer";

import CartDrawer from "./components/cart/CartDrawer";

import Home from "./pages/home/Home";
import Products from "./pages/home/Products";
import ProductDetails from "./pages/home/ProductDetails";
import Categories from "./pages/home/Categories";
import NewArrivals from "./pages/home/NewArrivals";
import Offers from "./pages/home/Offers";
import Checkout from "./pages/home/Checkout";

import About from "./pages/home/About";
import Shipping from "./pages/home/Shipping";
import Returns from "./pages/home/Returns";
import Privacy from "./pages/home/Privacy";

import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <TopBar />

        <MainNavbar />

        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/categories"
            element={<Categories />}
          />

          <Route
            path="/new-arrivals"
            element={<NewArrivals />}
          />

          <Route
            path="/offers"
            element={<Offers />}
          />

          <Route
            path="/products/:slug"
            element={<ProductDetails />}
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
<Route path="/shipping" element={<Shipping />} />
<Route path="/returns" element={<Returns />} />
<Route path="/privacy" element={<Privacy />} />

 
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>

        <Footer />

        <CartDrawer />

        <Toaster
          position="top-right"
          reverseOrder={false}
        />
      </BrowserRouter>
    </CartProvider>
  );
}
 



/*
import { BrowserRouter, Routes, Route  } from "react-router-dom";
 import "./app.css";
 
 import TopBar from "./components/landing/components/TopBar";
import MainNavbar from "./components/landing/components/MainNavbar";
import Home from "./pages/home/Home";
 
import Products from "./pages/home/Products";
import ProductDetails from "./pages/home/ProductDetails";
import Categories from "./pages/home/Categories";
import Footer from "./components/landing/components/Footer";
import NewArrivals from "./pages/home/NewArrivals";
import Offers from "./pages/home/Offers";







 
import NotFound from "./pages/NotFound";

import { Toaster } from "react-hot-toast";

 
 


 

 






export default function App() {
 
  return (
    <BrowserRouter>
    <TopBar />

            <MainNavbar />
 
         
    
        <Routes>
        
 

      
          <Route path="/" element={ <Home   />} />
          <Route path="/Products" element={ <Products  />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/offers" element={<Offers />} />



         


          <Route
  path="/products/:slug"
  element={<ProductDetails />}
/>
         
    
        
      
        

 

         
        
       
       
        



          
         
<Route path="*" element={<NotFound />} />
        
         
         
         
          


        </Routes>
        <Footer />
        <Toaster position="top-right" reverseOrder={false} />
    
    </BrowserRouter>
  );
}
 */