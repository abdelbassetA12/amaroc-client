import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

const ProductContext =
  createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export function ProductProvider({
  children,
}) {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${API_URL}/api/products`
      );

      const data = response.data;

      setProducts(
        data.products ||
          data.data ||
          []
      );
    } catch (err) {
      console.error(
        "Failed to fetch products:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "تعذر جلب المنتجات"
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        refreshProducts:
          fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context =
    useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProducts must be used inside ProductProvider"
    );
  }

  return context;
}