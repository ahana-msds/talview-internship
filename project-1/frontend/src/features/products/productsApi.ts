import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import * as Sentry from "@sentry/react";

/**
 * Interface for Product data.
 * Now includes stock, brand, category, rating, and images from PostgreSQL.
 */
export interface Product {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    description: string;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    images: string[];
}

/**
 * Interface for API response containing a list of products.
 */
interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

/**
 * Custom base query wrapper that reports errors to Sentry.
 * Now points to our own backend (PostgreSQL-backed) instead of DummyJSON directly.
 */
const baseQuery = fetchBaseQuery({ baseUrl: 'http://localhost:4002/api/' });
const baseQueryWithSentry: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error) {
        // Report error to Sentry if it's not a common 404
        if (result.error.status !== 404) {
            console.log("Sentry: Explicitly capturing API Error:", result.error);

            // Wrap the plain RTK Query error object in a real Error instance
            const errorMsg = (result.error as any).error || `API Error ${result.error.status}`;
            Sentry.captureException(new Error(`API_FAILURE: ${errorMsg}`), {
                extra: { endpoint: api.endpoint, status: result.error.status }
            });
        }
    }
    return result;
};

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: baseQueryWithSentry,
    endpoints: (builder) => ({
        getProducts: builder.query<ProductResponse, { limit: number; skip: number }>({
            query: ({ limit, skip }) => `products?limit=${limit}&skip=${skip}`,
        }),
        getProductById: builder.query<Product, string | number>({
            query: (id) => `products/${id}`,
        }),
        getCategories: builder.query<{ slug: string; name: string; url: string }[], void>({
            query: () => 'products/categories',
        }),
        searchProducts: builder.query<ProductResponse, { q: string; limit: number; skip: number }>({
            query: ({ q, limit, skip }) => `products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`,
        }),
        getProductsByCategory: builder.query<ProductResponse, { category: string; limit: number; skip: number }>({
            query: ({ category, limit, skip }) => `products/category/${category}?limit=${limit}&skip=${skip}`,
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useGetCategoriesQuery,
    useSearchProductsQuery,
    useGetProductsByCategoryQuery,
} = productsApi;
