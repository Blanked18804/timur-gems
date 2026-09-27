import ProductEditForm from '@/components/admin/productEditForm';
import { fetchProductById } from '@/utils/actions/products.action'
import Image from 'next/image'

export default async function ProductDetail({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    console.log(id);
    const product = await fetchProductById(id);
  return (
    <ProductEditForm product={product} />
  )
}
