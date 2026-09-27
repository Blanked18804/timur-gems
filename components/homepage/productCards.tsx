import { ProductWithImages } from '@/sharedTableTypes'
import Image from 'next/image'

export default function ProductCards({products}: ProductWithImages[]) {
  return (
    <div className='grid grid-cols-4 gap-4'>
      {products.map((product: ProductWithImages) => {
        return(
          <div key={product.id} className='flex flex-col gap-2 w-full'>
            <div className='relative min-w-1/3 min-h-60'>
              <Image src={product.product_images[0].image_url} alt={product.product_images[0].alt_text ?? product.name} fill />
            </div>

            <h2>{product.name}</h2>
            <p>{product.price}</p>
          </div>
        )
      })}
    </div>
  )
}
