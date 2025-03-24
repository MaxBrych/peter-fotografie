// page.tsx
import Link from "next/link";
import Image from "next/image";
import PhotoGallery from "@/components/photo-gallery";
import { fetchPhotos, fetchCollections } from "@/lib/sanity";
import type { Collection, Photo } from "@/lib/types";

export default async function Home() {
  let photos: Photo[] = [];
  let collections: Collection[] = [];

  try {
    photos = await fetchPhotos();
    collections = await fetchCollections();
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {collections.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4 text-center">Collections</h2>
          <div className="flex items-center justify-center space-x-6 flex-wrap">
            {collections.map((collection) => (
              <Link
                key={collection._id}
                href={`/collections/${collection.slug}`}
                className="text-sm text-gray-600 hover:text-black hover:underline flex items-center gap-1 mb-2"
              >
                {collection.title}
                <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-500">
                  {collection.photoCount || 0}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <h1 className="text-2xl font-medium mb-6 text-center">All Photos</h1>
      <PhotoGallery photos={photos} />
    </div>
  );
}
