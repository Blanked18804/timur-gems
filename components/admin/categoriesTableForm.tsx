"use client"

import { ProductCategory } from '@/sharedTableTypes'
import { Edit, Trash } from 'lucide-react'
import { useState } from 'react'

export default function CategoriesTableForm({ categories, name}: { categories: ProductCategory, name: string }) {
    const [canSave, setCanSave] = useState(false)

    return (
        <div className='w-full flex flex-col gap-4 '>
            <h2 className='text-3xl'>{name}</h2>
            <table className='w-full table-fixed text-sm border border-border'>
                <thead className='border-b border-border'>
                    <tr className='text-left'>
                        <th className="w-12 px-4 py-3">
                            <input type="checkbox" />
                        </th>
                        <th className="px-4 py-4 font-medium">Name</th>
                        <th className="px-4 py-4 font-medium">Edit</th>
                        <th className="px-4 py-4 font-medium">Delete</th>
                        <th className="px-4 py-4 font-medium">Action</th>
                    </tr>
                </thead>

                <tbody className='divide-y divide-border'>
                    {categories.map((category: ProductCategory) => {
                        return (
                            <tr key={category.id} className='transition-colors hover:bg-muted/10'>
                                <td className="w-12 px-4 py-3">
                                    <input type="checkbox" />
                                </td>
                                <td className="px-4 py-4 font-medium">{category.name}</td>

                                <td className="px-4 py-4 font-medium">
                                    <button className='hover:text-gold'>
                                        <Edit size={16} />
                                    </button>
                                </td>
                                
                                <td className="px-4 py-4 font-medium">
                                    <button className='hover:text-red-500'>
                                        <Trash size={16} />
                                    </button>
                                </td>

                                <td className="px-4 py-4 font-medium">
                                    <button className={`${canSave ? "btn" : "btn-disabled"}`}>
                                        Save
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
