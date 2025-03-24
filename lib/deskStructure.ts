// deskStructure.ts
import type { StructureBuilder } from 'sanity/desk';
import { BsFillCollectionFill } from 'react-icons/bs';

// Custom component for viewing photos in a collection will be implemented separately

export const deskStructure = (S: StructureBuilder) => {
  return S.list()
    .title('Content')
    .items([
      // Regular document types
      S.listItem()
        .title('Photos')
        .schemaType('photo')
        .child(S.documentTypeList('photo').title('Photos')),
        
      // Custom collection view with count
      S.listItem()
        .title('Collections')
        .icon(BsFillCollectionFill)
        .child(
          S.documentTypeList('collection')
            .title('Collections')
            .child(documentId => 
              S.document()
                .documentId(documentId)
                .schemaType('collection')
                .views([
                  S.view.form().title('Details'),
                  S.view
                    .component(CollectionPhotosView) // We'll define this separately
                    .title('Collection Photos')
                ])
            )
        ),
      
      // Other document types as needed
      ...S.documentTypeListItems().filter(
        listItem => !['collection', 'photo'].includes(listItem.getId() as string)
      )
    ]);
};

// This component will need to be imported and defined separately
function CollectionPhotosView(props) {
  // We'll define this component separately
  return null;
}
