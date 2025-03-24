"use client"

import Image from "next/image"
import Link from "next/link"
import type { Photo } from "@/lib/types"

interface PhotoGalleryProps {
  photos: Photo[]
}

export default function PhotoGallery({ photos = [] }: PhotoGalleryProps) {
  // Create columns for masonry layout
  const createColumns = (photos: Photo[], columnCount: number) => {
    const columns: Photo[][] = Array.from({ length: columnCount }, () => [])

    photos.forEach((photo, index) => {
      columns[index % columnCount].push(photo)
    })

    return columns
  }

  // Responsive column count
  const columns = createColumns(photos, 3)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-4">
          {column.map((photo) => (
            <Link key={photo._id} href={`/photos/${photo.slug}`} className="block w-full">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={`${photo.imageUrl}?w=800&q=75`} // Lower quality preview
                  alt={photo.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}

