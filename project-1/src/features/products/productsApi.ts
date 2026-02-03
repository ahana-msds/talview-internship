import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Product {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    description: string;
    discountPercentage: number;
}

interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
    endpoints: (builder) => ({
        getProducts: builder.query<ProductResponse, void>({
            query: () => 'products',
        }),
    }),
});

export const { useGetProductsQuery } = productsApi;
