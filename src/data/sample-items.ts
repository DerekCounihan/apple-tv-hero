export interface SampleItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  stats?: {
    progress: number;
    total: number;
  };
}

/**
 * Sample items for the demo
 * Using Unsplash Source for placeholder images
 */
export const sampleItems: SampleItem[] = [
  {
    id: "1",
    title: "Mountain Adventure",
    subtitle: "Explore the peaks",
    description:
      "A breathtaking journey through the highest peaks of the Alps. Experience the thrill of climbing, the serenity of alpine lakes, and the majesty of snow-capped summits that touch the sky.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=1000&fit=crop",
    stats: { progress: 3, total: 5 },
  },
  {
    id: "2",
    title: "Ocean Dreams",
    subtitle: "Dive into the blue",
    description:
      "Discover the wonders beneath the waves. From vibrant coral reefs to mysterious deep-sea creatures, the ocean holds secrets waiting to be explored by those brave enough to dive in.",
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&h=1000&fit=crop",
    stats: { progress: 7, total: 10 },
  },
  {
    id: "3",
    title: "Forest Escape",
    subtitle: "Find your peace",
    description:
      "Step into ancient woodlands where time seems to stand still. The whisper of leaves, the song of birds, and the dappled sunlight create a sanctuary for the soul.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=1000&fit=crop",
    stats: { progress: 2, total: 4 },
  },
  {
    id: "4",
    title: "City Nights",
    subtitle: "Urban exploration",
    description:
      "When the sun sets, the city comes alive with a different energy. Neon lights reflect off wet streets, and every corner holds a new adventure waiting to unfold.",
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=1000&fit=crop",
    stats: { progress: 5, total: 8 },
  },
  {
    id: "5",
    title: "Desert Horizons",
    subtitle: "Endless golden sands",
    description:
      "Where the earth meets the sky in a dance of light and shadow. The desert teaches patience, resilience, and reveals beauty in the most unexpected places.",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&h=1000&fit=crop",
    stats: { progress: 1, total: 3 },
  },
  {
    id: "6",
    title: "Northern Lights",
    subtitle: "Nature's light show",
    description:
      "Witness the aurora borealis paint the night sky with ethereal colors. This celestial dance of green, purple, and blue is nature's most spectacular display.",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=1000&fit=crop",
    stats: { progress: 4, total: 6 },
  },
];

/**
 * Get a sample item by ID
 */
export function getSampleItem(id: string): SampleItem | undefined {
  return sampleItems.find((item) => item.id === id);
}
