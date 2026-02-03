import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ProductList from '../features/products/ProductList';
import { Provider } from 'react-redux';
import { store } from '../app/store';

const meta = {
    title: 'Features/ProductList',
    component: ProductList,
    argTypes: {
        productCount: { control: { type: 'range', min: 1, max: 20 }, description: 'Number of products to display' },
        uiScale: { control: { type: 'range', min: 0.5, max: 2, step: 0.1 }, description: 'Scale the UI size' },
    },
    decorators: [
        (Story) => (
            <Provider store={store}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ProductList>;

export default meta;

type ProductListStoryState = React.ComponentProps<typeof ProductList> & {
    productCount: number;
    uiScale: number;
};

type Story = StoryObj<ProductListStoryState>;

const generateProducts = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        title: `Mock Product ${i + 1}`,
        description: 'Description',
        price: 19.99 + i,
        discountPercentage: 10,
        rating: 4.5,
        stock: 100,
        brand: 'Brand',
        category: 'Category',
        thumbnail: 'https://placehold.co/400',
        images: []
    }));
};

export const Interactive: Story = {
    args: {
        productCount: 6,
        uiScale: 1,
    },
    render: (args) => (
        <div style={{ transform: `scale(${args.uiScale})`, transformOrigin: 'top left' }}>
            {/* @ts-ignore */}
            <ProductList products={generateProducts(args.productCount)} />
        </div>
    )
};
