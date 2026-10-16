import PageLayout from "@/components/admin/pageLayout";
import ProductForm from "@/components/admin/productForm";
import { getCategories } from "@/utils/actions/categories.action";

export default async function AddProduct() {
  const categories = await Promise.all([
    getCategories("stone_types"),
    getCategories("shapes"),
    getCategories("colors")
  ])


  return (
    <PageLayout>
          <section className='pr-16 w-full my-16'>
            <ProductForm categories={categories} />
          </section>
    </PageLayout>
  )
}
