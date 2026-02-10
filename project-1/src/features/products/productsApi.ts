import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import * as Sentry from "@sentry/react";

/**
 * Interface for Product data.
 */
export interface Product {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    description: string;
    discountPercentage: number;
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
 */
const baseQuery = fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' });
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
            // This prevents malformed "envelope" requests (Sentry 400 errors)
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
    }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi;
