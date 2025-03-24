// schemas/collection.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: "collection",
  title: "Collection",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "reference",
      to: [{ type: "photo" }],
      description: "Select a photo to be used as the collection cover",
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      description: "Collections are sorted by this number (lower numbers appear first)",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "coverImage.image",
      photoCount: "photoCount",
    },
    prepare({ title, media, photoCount }) {
      return {
        title,
        subtitle: photoCount ? `${photoCount} photos` : 'No photos',
        media,
      };
    },
  },
});
