// sanity.config.ts
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { deskStructure } from "./lib/deskStructure";

export default defineConfig({
  name: "photo-gallery",
  title: "Photo Gallery",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  plugins: [
    deskTool({
      structure: deskStructure
    }), 
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },

  basePath: "/studio",
});
