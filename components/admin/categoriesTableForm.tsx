"use client"

import { ProductCategory } from '@/sharedTableTypes'
import { deleteCategory, deleteMultipleCategories, updateCategory, updateMultipleCategories } from '@/utils/actions/categories.action';
import { Pencil, PencilOff, Save, Trash, X } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { useState } from 'react'

export default function CategoriesTableForm({ category, categories, name }: { category: string, categories: ProductCategory[], name: string }) {
    const router = useRouter();

    const [editingId, setEditingId] = useState<string[]>([]); // to track rows in edit mode
    const [selectedIds, setSelectedIds] = useState<string[]>([]); // to track checked rows
    const [editedNames, setEditedNames] = useState<Record<string, string>>({}); // to store unsaved changes

    function handleEditButton(id: string) {
        setEditingId(prev => prev.includes(id) ?
            prev.filter(editingId => editingId !== id)
            :
            [...prev, id]);
    }

    // to make sure that all entries are slected
    const allSelected = categories.length > 0 && categories.every(category => selectedIds.includes(category.id));

    function handleSelectAll() {
        setSelectedIds(prev => allSelected ?
            prev.filter(id => !categories.some(category => category.id === id))
            :
            [... new Set([...prev, ...categories.map(category => category.id)])]);
    }

    function handleSelect(id: string) {
        setSelectedIds(prev => prev.includes(id) ?
            prev.filter(selectedId => selectedId !== id)
            :
            [...prev, id]);
    }

    async function handleDelete(id: string) {
        try {
            await deleteCategory(category, id);
            router.refresh();
        }
        catch (error) {
            console.log("Failed to delete the category: ", error);
        }
    }

    async function handleDeleteSelectedButton() {
        if (selectedIds.length === 0) return;

        try {
            await deleteMultipleCategories(category, selectedIds);

            setSelectedIds([]);
            router.refresh();
        }
        catch (error) {
            console.error("Failed to delete categories: ", error);
        }
    }

    async function handleSaveButton(id: string){
        const currentCategory = categories.find(item => item.id === id);

        if (!currentCategory) return;

        const newName = (editedNames[id] ?? currentCategory.name).trim();

        if(!newName){
            alert("Category name cannot be empty.");
            return;
        }

        try{
            await updateCategory(category, id, newName);

            setEditingId(prev => prev.filter(editingId => editingId !== id));
            
            setEditedNames(prev => {
                const updated = {...prev};
                delete updated[id];

                return updated;
            })

            router.refresh();
        }
        catch (error){
            console.error("Failed to update category: ", error);
        }
    }

    async function handleSaveAllButton() {
        if (editingId.length === 0) return;

        const updates = editingId.map(id => {
            const currentCategory = categories.find(item => item.id === id);

            return {
                id,
                name: (editedNames[id] ?? currentCategory?.name ?? "").trim()
            };
        });

        if (updates.some(item => !item.name)) {
            alert("category names cannot be empty.");
            return;
        }

        try{
            await updateMultipleCategories(category, updates);

            setEditingId([]);
            setEditedNames({});

            router.refresh();
        }
        catch(error){
            console.error("Failed to update categories:", error);
        }
    }

    function handleCancelAllButton(){
        setEditingId([]);
        setEditedNames({});
    }

    return (
        <div className='w-full flex flex-col gap-4 '>
            <h2 className='text-3xl'>{name}</h2>

            <div className='flex flex-col gap-8'>
                <table className='w-full table-fixed text-sm border border-border'>
                    <thead className='border-b border-border'>
                        <tr className='text-left'>
                            <th className="w-12 px-4 py-3">
                                <input checked={allSelected} onChange={handleSelectAll} type="checkbox" />
                            </th>
                            <th className="px-4 py-4 font-medium">Name</th>
                            <th className="px-4 py-4 font-medium">Edit</th>
                            <th className="px-4 py-4 font-medium">Delete</th>
                            <th className="px-4 py-4 font-medium">Action</th>
                        </tr>
                    </thead>

                    <tbody className='divide-y divide-border'>
                        {
                            categories.map((category: ProductCategory) => {
                                const isEditing = editingId.includes(category.id);

                                return (
                                    <tr key={category.id} className='transition-colors hover:bg-muted/10'>
                                        <td className="px-4 py-4 font-medium">
                                            <input checked={selectedIds.includes(category.id)} onChange={() => handleSelect(category.id)} type="checkbox" className='max-w-32' />
                                        </td>

                                        {
                                            isEditing ? (
                                                <td className="px-4 py-4 font-medium">
                                                    <input value={editedNames[category.id] ?? category.name} onChange={event => setEditedNames(prev => ({...prev, [category.id]: event.target.value}))} placeholder={category.name} />
                                                </td>
                                            ) : (
                                                <td className="px-4 py-4 font-medium">{category.name}</td>
                                            )}

                                        <td className="px-4 py-4 font-medium">
                                            <button type='button' onClick={() => handleEditButton(category.id)} className='hover:text-gold'>
                                                {isEditing ?
                                                    <PencilOff size={16} />
                                                    :
                                                    <Pencil size={16} />
                                                }
                                            </button>
                                        </td>

                                        <td className="px-4 py-4 font-medium">
                                            <button type='button' onClick={() => handleDelete(category.id)} className='hover:text-red-500'>
                                                <Trash size={16} />
                                            </button>
                                        </td>

                                        <td className="px-4 py-4 font-medium">
                                            <button disabled={!isEditing} onClick={() => handleSaveButton(category.id)} className={`${isEditing ? "btn" : "btn-disabled"}`}>
                                                Save
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
                <div className='flex justify-between'>
                    {
                        selectedIds.length > 0 && (
                        <div>
                            <button type='button' onClick={handleDeleteSelectedButton} className='btn-warn flex gap-2 items-center'><Trash /> Delete Selected {selectedIds.length}</button>
                        </div>)
                    }

                    {
                        editingId.length > 1 && (
                            <div className='flex gap-4'>
                                <button type='button' onClick={handleCancelAllButton} className='btn-secondary flex gap-2 items-center'><X /> Cancel All</button>

                                <button type='button' onClick={handleSaveAllButton} className='btn flex gap-2 items-center'><Save /> Save All {editingId.length}</button>
                            </div>
                        )
                    }

                    {
                        !(editingId.length > 0 || selectedIds.length > 0) && (
                            <button type='button' className='btn ml-auto'>Add New Category</button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
