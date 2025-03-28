import { createClient } from "next-sanity"
import type { Photo, Collection } from "./types"
import imageUrlBuilder from '@sanity/image-url';


// Check if the required environment variables are available
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET



// Throw a more helpful error if the environment variables are missing
if (!projectId) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID")
}

if (!dataset) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SANITY_DATASET")
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2023-05-03",
  useCdn: process.env.NODE_ENV === "production",
})
// Initialize the builder with your Sanity client
const builder = imageUrlBuilder(client);
// Create a function that generates image URLs
export function urlFor(source: any) {
  return builder.image(source);
}

export async function fetchPhotos(): Promise<Photo[]> {
  const query = `*[_type == "photo"] {
    _id,
    title,
    "slug": slug.current,
    description,
    price,
    "imageUrl": image.asset->url, 
    "collections": collections[]->{ _id, title, "slug": slug.current },
    dateTaken,
    cameraSettings,
    displayOrder
  } | order(displayOrder asc, _createdAt desc)`

  try {
    const photos = await client.fetch(query);
    return photos
      .filter((photo: any) => photo.imageUrl) // Filter out photos without images
      .map((photo: any) => ({
        ...photo,
        imageUrl: getOptimizedImageUrl(photo.imageUrl) || null
      }));
  } catch (error) {
    console.error("Error fetching photos:", error)
    return []
  }
}


export async function fetchPhotoBySlug(slug: string): Promise<Photo | null> {
  const query = `*[_type == "photo" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    price,
    "imageUrl": image.asset->url,
    "collections": collections[]->{ _id, title, "slug": slug.current },
    dateTaken,
    cameraSettings
  }`

  try {
    return await client.fetch(query, { slug })
  } catch (error) {
    console.error("Error fetching photo:", error)
    return null
  }
}

export async function fetchCollections(): Promise<Collection[]> {
  const query = `*[_type == "collection"] {
    _id,
    title,
    "slug": slug.current,
    description,
    "coverImageUrl": coverImage->image.asset->url,
    "photoCount": count(*[_type == "photo" && references(^._id)])
  } | order(displayOrder asc, title asc)`

  try {
    return await client.fetch(query)
  } catch (error) {
    console.error("Error fetching collections:", error)
    return []
  }
}

export async function fetchCollectionBySlug(slug: string): Promise<Collection | null> {
  const query = `*[_type == "collection" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    "coverImageUrl": coverImage->image.asset->url,
    "photoCount": count(*[_type == "photo" && references(^._id)])
  }`

  try {
    return await client.fetch(query, { slug })
  } catch (error) {
    console.error("Error fetching collection:", error)
    return null
  }
}

export async function fetchPhotosByCollection(collectionId: string): Promise<Photo[]> {
  const query = `*[_type == "photo" && $collectionId in collections[]._ref] {
    _id,
    title,
    "slug": slug.current,
    description,
    price,
    "imageUrl": image.asset->url,
    "collections": collections[]->{ _id, title, "slug": slug.current },
    dateTaken,
    cameraSettings,
    displayOrder
  } | order(displayOrder asc, _createdAt desc)`

  try {
    return await client.fetch(query, { collectionId })
  } catch (error) {
    console.error("Error fetching photos by collection:", error)
    return []
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<any | null> {
  const query = `*[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description
  }`

  try {
    return await client.fetch(query, { slug })
  } catch (error) {
    console.error("Error fetching category:", error)
    return null
  }
}

export async function fetchPhotosByCategory(categoryId: string): Promise<Photo[]> {
  const query = `*[_type == "photo" && $categoryId in categories[]._ref] {
    _id,
    title,
    "slug": slug.current,
    description,
    price,
    "imageUrl": image.asset->url,
    "collections": collections[]->{ _id, title, "slug": slug.current },
    dateTaken,
    cameraSettings,
    displayOrder
  } | order(displayOrder asc, _createdAt desc)`

  try {
    return await client.fetch(query, { categoryId })
  } catch (error) {
    console.error("Error fetching photos by category:", error)
    return []
  }
}
export function getOptimizedImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;
  
  // Remove any existing query parameters
  const baseUrl = imageUrl.split('?')[0];
  
  // Add Sanity image transformation parameters for better format support
  return `${baseUrl}?auto=format,compress&fit=crop&w=800&q=80`;
}

export async function fetchCategories(): Promise<any[]> {
  const query = `*[_type == "category"] {
    _id,
    title,
    "slug": slug.current,
    description,
    "photoCount": count(*[_type == "photo" && references(^._id)])
  } | order(title asc)`

  try {
    return await client.fetch(query)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}