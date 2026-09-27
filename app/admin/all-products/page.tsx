import PageLayout from '@/components/admin/pageLayout';
import ProductTable from '@/components/admin/productTable';
import { fetchProducts } from '@/utils/actions/products.action'
import React from 'react'

export default async function AllProducts() {
  const allProducts = await fetchProducts();

  return (
    <PageLayout>
      <section className='pr-16 w-full'>
        <h1 className='text-4xl font-semibold'>All Products</h1>

        {/* table of products */}
        <ProductTable products={allProducts}/>
      </section>
    </PageLayout>
  )
}
