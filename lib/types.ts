export interface Collection {
  _id: string
  title: string
  slug: string
  description?: string
}

export interface Photo {
  _id: string
  title: string
  slug: string
  description?: string
  price: number
  imageUrl: string
  collections?: Collection[]
}

