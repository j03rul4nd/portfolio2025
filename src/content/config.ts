import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

const projects = defineCollection({
  type: 'content',
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    projectType: z.string().default("Industrial GIS Platform"),
    duration: z.string().default("18 months"),
    teamSize: z.string().default("6"),
    role: z.string().default("Lead Frontend Developer"),
    year: z.string().default("2024"),
    industry: z.string().default("Industrial Automation"),
    technologies: z.array(z.string()).default([
      "JavaScript", "Leaflet", "AVEVA", "Mapbox", 
      "WMS/WFS", "SVG", "ArcGIS"
    ]),
    projectUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
    features: z.array(z.string()).default([
      "Real-time asset visualization with interactive maps",
      "Integration with multiple GIS providers and custom map creation",
      "Platform migration from OMI to web-based accessibility",
      "Native multi-touch and gesture controls",
      "Highly customizable interface with design system",
      "ArchestrA graphics rendering within maps"
    ]),
    contributions: z.array(z.string()).default([
      "Platform Migration: Migrated service from OMI-only to web-accessible platform",
      "UI/UX Design: Created pixel-perfect responsive interface across all devices",
      "Documentation: Developed comprehensive web documentation and user guides",
      "GIS Innovation: Implemented advanced GIS techniques using Leaflet, WMS, and Mapbox",
      "Architecture: Designed modular and scalable system architecture"
    ]),
    successStories: z.array(z.object({
      title: z.string(),
      description: z.string()
    })).default([
      {
        title: "Barcelona Smart City",
        description: "Real-time management of urban resources including elevators, escalators, public fountains, and irrigation systems for municipal parks."
      },
      {
        title: "Ashghal Qatar Water & Wastewater",
        description: "Management of over 500,000 assets in real-time, integrated with ArcGIS/Esri platform for comprehensive infrastructure control."
      },
      {
        title: "Barcelona Tunnels",
        description: "Advanced monitoring and control of tunnel infrastructure including lighting, traffic systems, and ventilation."
      }
    ]),
    impact: z.array(z.string()).default([
      "Reduced engineering time by 60% through automated GIS item creation",
      "Enabled real-time visualization of industrial assets across multiple platforms",
      "Established new standard for GIS-industrial platform integration",
      "Enhanced accessibility by migrating from desktop-only to web-based solution"
    ])
  }),
});

export const collections = { blog, projects };
