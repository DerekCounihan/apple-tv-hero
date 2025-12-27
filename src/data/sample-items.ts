export interface SampleItem {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  image: string;
  stats?: {
    progress: number;
    total: number;
  };
}

/**
 * Sample items for the demo
 * Using movie poster style images for a cinematic feel
 */
export const sampleItems: SampleItem[] = [
  {
    id: "1",
    title: "Interstellar",
    subtitle: "A journey beyond the stars",
    tagline:
      "Mankind was born on Earth. It was never meant to die here. A team of explorers travel through a wormhole in space.",
    description:
      "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    image:
      "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=800&h=800&fit=crop",
    stats: { progress: 3, total: 5 },
  },
  {
    id: "2",
    title: "The Deep",
    subtitle: "What lies beneath",
    tagline:
      "In the darkest depths of the ocean, something ancient awakens. Some discoveries were never meant to be made.",
    description:
      "A deep-sea research team encounters an unknown species in the Mariana Trench, forcing them to fight for survival against creatures that have evolved in complete darkness for millions of years.",
    image:
      "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&h=800&fit=crop",
    stats: { progress: 7, total: 10 },
  },
  {
    id: "3",
    title: "Into the Wild",
    subtitle: "Find yourself",
    tagline:
      "He gave away everything he owned and disappeared into the wilderness. This is the true story of his journey.",
    description:
      "After graduating from Emory University, Christopher McCandless abandons his possessions, gives his entire savings to charity, and hitchhikes to Alaska to live in the wilderness alone.",
    image:
      "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=800&h=800&fit=crop",
    stats: { progress: 2, total: 4 },
  },
  {
    id: "4",
    title: "Neon Dreams",
    subtitle: "The city never sleeps",
    tagline:
      "In a city of eight million people, she's looking for the one who got away. Every street corner tells a story.",
    description:
      "A photographer captures the hidden stories of Tokyo's neon-lit streets, where tradition meets technology and lonely souls search for connection in the world's largest metropolis.",
    image:
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=800&fit=crop",
    stats: { progress: 5, total: 8 },
  },
  {
    id: "5",
    title: "Dune",
    subtitle: "Beyond fear, destiny awaits",
    tagline:
      "A mythic journey of a young hero, born into a world of conflict. His fate is written in the sands of time.",
    description:
      "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.",
    image:
      "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800&h=800&fit=crop",
    stats: { progress: 1, total: 3 },
  },
  {
    id: "6",
    title: "Aurora",
    subtitle: "When the sky comes alive",
    tagline:
      "At the edge of the world, where light dances across the frozen sky, one woman discovers the truth about her past.",
    description:
      "A scientist stationed in northern Norway to study the aurora borealis uncovers an ancient mystery that connects the northern lights to her own forgotten memories.",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=800&fit=crop",
    stats: { progress: 4, total: 6 },
  },
];

/**
 * Get a sample item by ID
 */
export function getSampleItem(id: string): SampleItem | undefined {
  return sampleItems.find((item) => item.id === id);
}
