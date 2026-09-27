import ProductTable from '@/components/admin/productTable';
import { fetchProducts } from '@/utils/actions/products.action'
import React from 'react'

export default async function AllProducts() {
  const allProducts = await fetchProducts();

  return (
    <section className='px-16 py-8'>
        <h1 className='text-4xl'>All Products</h1>

        {/* table of products */}
        <ProductTable products={allProducts}/>
    </section>
  )
}
