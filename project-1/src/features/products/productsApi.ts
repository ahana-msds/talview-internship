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
        // Report error to Sentry if it's not a common 404 (filtered globally anyway, but good to be explicit here)
        if (result.error.status !== 404) {
            Sentry.captureException(result.error, {
                extra: {
                    args,
                    status: result.error.status,
                }
            });
        }
    }
    return result;
};

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: baseQueryWithSentry,
    endpoints: (builder) => ({
        getProducts: builder.query<ProductResponse, void>({
            query: () => 'products',
        }),
    }),
});

export const { useGetProductsQuery } = productsApi;
