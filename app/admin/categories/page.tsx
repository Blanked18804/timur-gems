import CategoriesTableForm from '@/components/admin/categoriesTableForm'
import PageLayout from '@/components/admin/pageLayout'
import { getCategories } from '@/utils/actions/categories.action'

export default async function Categories() {

  const stoneTypes = await getCategories("stone_types");
  const shapes = await getCategories("shapes");
  const colors = await getCategories("colors");

  return (
    <PageLayout>
        <section className='pr-16 w-full my-16 flex flex-col gap-16'>
          <CategoriesTableForm categories={stoneTypes} name={"Stone Types"} />
          <CategoriesTableForm categories={shapes} name={"Shapes"} />
          <CategoriesTableForm categories={colors} name={"Colors"} />
        </section>
    </PageLayout>
  )
}
