import Link from "next/link"
import PhotoGallery from "@/components/photo-gallery"
import { fetchPhotos, fetchCollections } from "@/lib/sanity"

export default async function Home() {
  let photos = []
  let collections = []

  try {
    photos = await fetchPhotos()
    collections = await fetchCollections()
  } catch (error) {
    console.error("Error fetching data:", error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {collections.length > 0 && (
        <div className="mb-8 flex items-center justify-center space-x-6">
          {collections.map((collection) => (
            <Link
              key={collection._id}
              href={`/collections/${collection.slug}`}
              className="text-sm text-gray-600 hover:text-black hover:underline"
            >
              {collection.title}
            </Link>
          ))}
        </div>
      )}

      <PhotoGallery photos={photos} />
    </div>
  )
}

