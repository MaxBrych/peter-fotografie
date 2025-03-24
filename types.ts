// types.ts
export interface Collection {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    coverImageUrl?: string;
    photoCount?: number;
  }
  
  export interface Photo {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    price?: number;
    imageUrl: string;
    collections?: Collection[];
    dateTaken?: string;
    cameraSettings?: {
      camera?: string;
      lens?: string;
      aperture?: string;
      shutterSpeed?: string;
      iso?: string;
    };
    displayOrder?: number;
  }
  