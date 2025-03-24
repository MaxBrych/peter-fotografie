import Link from "next/link"
import { notFound } from "next/navigation"
import PhotoGallery from "@/components/photo-gallery"
import { fetchCategoryBySlug, fetchPhotosByCategory, fetchCategories } from "@/lib/sanity"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await fetchCategoryBySlug(params.slug)

  if (!category) {
    notFound()
  }

  const photos = await fetchPhotosByCategory(category._id)
  const categories = await fetchCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-center space-x-6">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/categories/${cat.slug}`}
            className={`text-sm ${cat.slug === params.slug ? "text-black font-medium" : "text-gray-600"} hover:text-black hover:underline`}
          >
            {cat.title}
          </Link>
        ))}
      </div>

      <h1 className="text-2xl font-medium text-center mb-8">{category.title}</h1>

      {photos.length > 0 ? (
        <PhotoGallery photos={photos} />
      ) : (
        <p className="text-center text-gray-600">No photos found in this category.</p>
      )}
    </div>
  )
}

