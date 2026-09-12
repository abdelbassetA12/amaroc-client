import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import "./app.css";

// Providers
import { CartProvider } from "./context/CartContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";

// Store components
import TopBar from "./components/landing/components/TopBar";
import MainNavbar from "./components/landing/components/MainNavbar";
import Footer from "./components/landing/components/Footer";
import CartDrawer from "./components/cart/CartDrawer";

// Store pages
import Home from "./pages/home/Home";
import Products from "./pages/home/Products";
import ProductDetails from "./pages/home/ProductDetails";
import Categories from "./pages/home/Categories";
import NewArrivals from "./pages/home/NewArrivals";
import Offers from "./pages/home/Offers";
import Checkout from "./pages/home/Checkout";
import Search from "./pages/home/Search";
import Product from "./pages/home/Product";
import About from "./pages/home/About";
import Shipping from "./pages/home/Shipping";
import Returns from "./pages/home/Returns";
import Privacy from "./pages/home/Privacy";
import NotFound from "./pages/NotFound";

// Admin
import AdminAuth from "./pages/admin/AdminAuth";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";

export default function App() {
  return (
    <CartProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <AppContent />

          <Toaster
            position="top-right"
            reverseOrder={false}
          />
        </BrowserRouter>
      </AdminAuthProvider>
    </CartProvider>
  );
}

function AppContent() {
  const location = useLocation();

  const isAdminRoute =
    location.pathname.startsWith("/admin");

  return (
    <>
      {/* ================================
          STORE HEADER
          يظهر فقط خارج Admin
      ================================= */}

      {!isAdminRoute && (
        <>
          <TopBar />
          <MainNavbar />
        </>
      )}

      {/* ================================
          ROUTES
      ================================= */}

      <Routes>

        {/* ================================
            ADMIN ROUTES
        ================================= */}

        <Route
          path="/admin/auth"
          element={<AdminAuth />}
        />

        <Route element={<AdminProtectedRoute />}>
          <Route
            path="/admin"
            element={
              <div>
                Admin Dashboard
              </div>
            }
          />
        </Route>

        {/* ================================
            STORE ROUTES
        ================================= */}

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

        <Route
          path="/search"
          element={<Search />}
        />

        <Route
          path="/product"
          element={<Product />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/shipping"
          element={<Shipping />}
        />

        <Route
          path="/returns"
          element={<Returns />}
        />

        <Route
          path="/privacy"
          element={<Privacy />}
        />

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

      {/* ================================
          STORE FOOTER
          يظهر فقط خارج Admin
      ================================= */}

      {!isAdminRoute && (
        <>
          <Footer />
          <CartDrawer />
        </>
      )}
    </>
  );
}