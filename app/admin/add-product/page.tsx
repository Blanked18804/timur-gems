import PageLayout from "@/components/admin/pageLayout";
import ProductForm from "@/components/admin/productForm";

export default function AddProduct() {
  return (
    <PageLayout>
          <section className='pr-16 w-full my-16'>
            <ProductForm />
          </section>
    </PageLayout>
  )
}
