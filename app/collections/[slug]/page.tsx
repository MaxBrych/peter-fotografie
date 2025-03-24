// collections/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PhotoGallery from "@/components/photo-gallery";
import { fetchCollectionBySlug, fetchPhotosByCollection, fetchCollections, getOptimizedImageUrl } from "@/lib/sanity";
import type { Collection, Photo } from "@/lib/types";

interface CollectionPageProps {
  params: {
    slug: string;
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const collection = await fetchCollectionBySlug(params.slug);

  if (!collection) {
    notFound();
  }

  const photos = await fetchPhotosByCollection(collection._id);
  const collections = await fetchCollections();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-center space-x-6">
        {collections.map((col: Collection) => (
          <Link
            key={col._id}
            href={`/collections/${col.slug}`}
            className={`text-sm ${col.slug === params.slug ? "text-black font-medium" : "text-gray-600"} hover:text-black hover:underline flex items-center gap-1`}
          >
            {col.title}
            <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-500">
              {col.photoCount || 0}
            </span>
          </Link>
        ))}
      </div>

      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-medium mb-4">{collection.title}</h1>
        {collection.description && <p className="text-gray-600">{collection.description}</p>}
        {collection.photoCount !== undefined && (
          <p className="text-gray-500 mt-2">
            {collection.photoCount} {collection.photoCount === 1 ? 'photo' : 'photos'}
          </p>
        )}
       {collection.coverImageUrl && getOptimizedImageUrl(collection.coverImageUrl) && (
  <div className="mt-6 relative h-80">
    <Image 
      src={getOptimizedImageUrl(collection.coverImageUrl) || ''}
      alt={collection.title}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className="object-contain"
      unoptimized
    />
  </div>
)}


      </div>

      {photos.length > 0 ? (
        <PhotoGallery photos={photos} />
      ) : (
        <p className="text-center text-gray-600">No photos found in this collection.</p>
      )}
    </div>
  );
}
