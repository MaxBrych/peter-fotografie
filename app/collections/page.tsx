import Link from "next/link"
import Image from "next/image"
import { fetchCollections, fetchPhotosByCollection } from "@/lib/sanity"

export default async function CollectionsPage() {
  const collections = await fetchCollections()

  // Get a featured photo for each collection
  const collectionsWithPhoto = await Promise.all(
    collections.map(async (collection) => {
      const photos = await fetchPhotosByCollection(collection._id)
      return {
        ...collection,
        featuredPhoto: photos.length > 0 ? photos[0] : null,
      }
    }),
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-medium text-center mb-12">Collections</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collectionsWithPhoto.map((collection) => (
          <Link key={collection._id} href={`/collections/${collection.slug}`} className="group">
            <div className="relative aspect-[4/3] mb-4 overflow-hidden">
              {collection.featuredPhoto ? (
                <Image
                  src={`${collection.featuredPhoto.imageUrl}?w=800&q=75`}
                  alt={collection.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No photos</span>
                </div>
              )}
            </div>
            <h2 className="text-xl font-medium group-hover:underline">{collection.title}</h2>
            {collection.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{collection.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

