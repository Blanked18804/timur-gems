import PageLayout from '@/components/admin/pageLayout';
import ProductForm from '@/components/admin/productForm';
import { fetchProductById } from '@/utils/actions/products.action'
import Image from 'next/image'

export default async function ProductDetail({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    console.log(id);
    const product = await fetchProductById(id);

  return (
    <PageLayout>
      <section className='pt-8 w-full flex flex-col gap-8'>
        <h1 className='text-4xl font-semibold'>Edit Product</h1>
        <ProductForm product={product} />
      </section>
    </PageLayout>
  )
}
