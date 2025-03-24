// components/CollectionPhotosView.tsx
import React, { useEffect, useState } from 'react';
import { useClient } from 'sanity';
import { Box, Card, Flex, Grid, Heading, Stack, Text } from '@sanity/ui';

interface Photo {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  price?: number;
  imageUrl: string;
}

interface CollectionPhotosViewProps {
  documentId: string;
  document: {
    displayed: {
      title: string;
    }
  }
}

export const CollectionPhotosView: React.FC<CollectionPhotosViewProps> = (props) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const client = useClient({apiVersion: '2023-05-03'});
  const { documentId } = props;
  const collectionTitle = props.document.displayed.title;

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const result = await client.fetch(
          `*[_type == "photo" && references($collectionId)] {
            _id,
            title,
            "slug": slug.current,
            description,
            price,
            "imageUrl": image.asset->url,
            displayOrder
          } | order(displayOrder asc, title asc)`,
          { collectionId: documentId }
        );
        setPhotos(result);
      } catch (error) {
        console.error('Error fetching photos for collection:', error);
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchPhotos();
    }
  }, [documentId, client]);

  if (loading) {
    return <Box padding={4}>Loading photos...</Box>;
  }

  return (
    <Box padding={4}>
      <Stack space={4}>
        <Heading size={2}>Photos in "{collectionTitle}" ({photos.length})</Heading>
        {photos.length === 0 ? (
          <Text>No photos in this collection yet.</Text>
        ) : (
          <Grid columns={[1, 2, 3]} gap={4}>
            {photos.map((photo) => (
              <Card key={photo._id} padding={3} radius={2} shadow={1}>
                <Stack space={3}>
                  {photo.imageUrl && (
                    <Box>
                      <img 
                        src={photo.imageUrl} 
                        alt={photo.title} 
                        style={{ width: '100%', aspectRatio: '3/2', objectFit: 'cover' }} 
                      />
                    </Box>
                  )}
                  <Flex direction="column" gap={2}>
                    <Heading size={3}>{photo.title}</Heading>
                    {photo.description && <Text size={1}>{photo.description}</Text>}
                    {photo.price !== undefined && <Text size={1}>Price: ${photo.price}</Text>}
                  </Flex>
                </Stack>
              </Card>
            ))}
          </Grid>
        )}
      </Stack>
    </Box>
  );
};
