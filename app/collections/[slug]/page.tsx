import Link from "next/link"
import { notFound } from "next/navigation"
import PhotoGallery from "@/components/photo-gallery"
import { fetchCollectionBySlug, fetchPhotosByCollection, fetchCollections } from "@/lib/sanity"

interface CollectionPageProps {
  params: {
    slug: string
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const collection = await fetchCollectionBySlug(params.slug)

  if (!collection) {
    notFound()
  }

  const photos = await fetchPhotosByCollection(collection._id)
  const collections = await fetchCollections()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-center space-x-6">
        {collections.map((col) => (
          <Link
            key={col._id}
            href={`/collections/${col.slug}`}
            className={`text-sm ${col.slug === params.slug ? "text-black font-medium" : "text-gray-600"} hover:text-black hover:underline`}
          >
            {col.title}
          </Link>
        ))}
      </div>

      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-medium mb-4">{collection.title}</h1>
        {collection.description && <p className="text-gray-600">{collection.description}</p>}
      </div>

      {photos.length > 0 ? (
        <PhotoGallery photos={photos} />
      ) : (
        <p className="text-center text-gray-600">No photos found in this collection.</p>
      )}
    </div>
  )
}

