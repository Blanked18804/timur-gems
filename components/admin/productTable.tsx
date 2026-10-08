import { ProductWithImages } from '@/sharedTableTypes'
import { Edit, Trash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductTable({products}: {products: ProductWithImages}) {
  return (
    <div className='w-full overflow-x-auto border border-border'>
      <table className='w-full table-fixed text-sm'>
        <thead className='border-b border-border'>
          <tr className='text-left'>
            <th className="w-12 px-4 py-3">
              <input type="checkbox" />
            </th>
            <th className="px-4 py-4 font-medium">Image</th>
            <th className="px-4 py-4 font-medium">Name</th>
            <th className="px-4 py-4 font-medium">Stone</th>
            <th className="px-4 py-4 font-medium">Color</th>
            <th className="px-4 py-4 font-medium">Price</th>
            <th className="px-4 py-4 font-medium">Discount</th>
            <th className="px-4 py-4 font-medium">Stock</th>
            <th className="px-4 py-4 font-medium">Action</th>
          </tr>
        </thead>

        <tbody className='divide-y divide-border'>
          {products.map((product: ProductWithImages) => {
            return(
              <tr key={product.id} className='transition-colors hover:bg-muted/10'>
                <td className="w-12 px-4 py-3">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-4">
                  <div className="relative h-12 w-12 overflow-hidden border">
                    <Image src={product.product_images[0].image_url} alt={product.product_images[0].alt_text ?? product.name} fill className='object-cover'/>
                  </div>
                </td>
                <td className="px-4 py-4 font-medium">{product.name}</td>
                <td className="px-4 py-4 text-muted-foreground">{product.stone_type}</td>
                <td className="px-4 py-4">{product.color}</td>
                <td className="px-4 py-4">{product.price}</td>
                <td className="px-4 py-4">{product.discounted_price ? `Rs. ${product.discounted_price}` : "-" }</td>
                <td className="px-4 py-4">{product.stock_quantity}</td>
                <td className="px-4 py-4">
                  <div className='flex gap-8 items-center'>
                    <Link href={`/admin/product-detail/${[product.id]}`} className='hover:text-gold'>
                      <Edit size={16} />
                    </Link>
                    <button className='hover:text-red-500'>
                      <Trash size={16}/>
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
