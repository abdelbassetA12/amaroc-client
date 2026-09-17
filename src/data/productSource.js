import localProducts from "../components/landing/components/products";
import {
  fetchProductsFromAPI,
  fetchProductFromAPI,
} from "../services/productsService";

const DATA_SOURCE = "local";
// لاحقًا:
// const DATA_SOURCE = "api";

export async function loadProducts() {
  if (DATA_SOURCE === "api") {
    return await fetchProductsFromAPI();
  }

  return localProducts;
}

export async function loadProduct(id) {
  if (DATA_SOURCE === "api") {
    return await fetchProductFromAPI(id);
  }

  return (
    localProducts.find(
      (product) =>
        String(product?._id) === String(id)
    ) || null
  );
}