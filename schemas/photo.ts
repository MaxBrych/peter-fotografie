// schemas/photo.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: "photo",
  title: "Photo",
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
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "collections",
      title: "Collections",
      type: "array",
      of: [{ type: "reference", to: { type: "collection" } }],
    }),
    defineField({
      name: "dateTaken",
      title: "Date Taken",
      type: "datetime",
    }),
    defineField({
      name: "cameraSettings",
      title: "Camera Settings",
      type: "object",
      fields: [
        {name: "camera", title: "Camera", type: "string"},
        {name: "lens", title: "Lens", type: "string"},
        {name: "aperture", title: "Aperture", type: "string"},
        {name: "shutterSpeed", title: "Shutter Speed", type: "string"},
        {name: "iso", title: "ISO", type: "string"},
      ],
      options: {
        collapsible: true,
        collapsed: true,
      }
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      description: "Photos are sorted by this number within collections",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      collection0: "collections.0.title",
      collection1: "collections.1.title",
    },
    prepare({title, media, collection0, collection1}) {
      const collections = [collection0, collection1].filter(Boolean);
      const subtitle = collections.length > 0 
        ? `In: ${collections.join(', ')}${collections.length > 2 ? '...' : ''}`
        : 'Not in any collection';
      
      return {
        title,
        subtitle,
        media
      };
    }
  }
});
