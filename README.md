# Apple TV Hero

Bring that gorgeous Apple TV+ parallax effect to your Next.js app! Smooth color extraction, dreamy blur transitions, and that satisfying Ken Burns zoom - all in one easy-to-use component.

<p align="center">
  <img src="demo.gif" alt="Apple TV Hero Demo" width="320" />
</p>

<p align="center">
  <a href="https://apple-tv-hero.vercel.app">View Live Demo</a>
</p>

## Features

- **Instant Color Magic** - Automatically pulls the perfect background color from your images
- **Butter-Smooth Animations** - Three-phase loading that looks incredible every time
- **Ken Burns Effect** - That subtle zoom (1.25x to 1x) that makes everything feel cinematic
- **Scroll Parallax** - Hero responds naturally to scroll with Framer Motion
- **Modal + Page Ready** - Works beautifully in both intercepted route modals and full pages
- **TypeScript First** - Fully typed because we're not animals

## Try It Out

```bash
git clone https://github.com/DerekCounihan/apple-tv-hero.git
cd apple-tv-hero
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000) and click on any card!

## Basic Usage

```tsx
import {
  ParallaxHeroLayout,
  ParallaxHeroContent,
} from "@/components/parallax-hero";
import {
  HeroTitle,
  HeroDescription,
  HeroExtendedContent,
  HeroActionButton,
} from "@/components/hero-content";
import { Play } from "lucide-react";

export default function MyPage() {
  return (
    <ParallaxHeroLayout
      heroImage="/your-image.jpg"
      heroAlt="Description"
      title="Page Title"
      useColorExtraction={true}
      heroExtendedContent={
        <HeroExtendedContent showOnDesktop>
          <HeroTitle>Your Amazing Content</HeroTitle>
          <HeroActionButton onClick={() => {}} icon={<Play />}>
            Get Started
          </HeroActionButton>
          <HeroDescription>
            A beautiful tagline that spans at least two lines
            to give your content that cinematic feel.
          </HeroDescription>
        </HeroExtendedContent>
      }
    >
      <ParallaxHeroContent>
        <div className="px-5 py-6">
          <h2>Your scrollable content goes here</h2>
        </div>
      </ParallaxHeroContent>
    </ParallaxHeroLayout>
  );
}
```

## Pre-Warm Colors for Instant Transitions

The secret sauce! Pre-warm colors when cards load so transitions are instant:

```tsx
import { preWarmImageColor } from "@/components/parallax-hero/use-image-color";

useEffect(() => {
  if (imageLoaded) {
    preWarmImageColor(imageUrl);
  }
}, [imageLoaded, imageUrl]);
```

## Animation Timeline

| Phase | Timing | What Happens |
|-------|--------|--------------|
| 1. Color | 0ms | Background instantly shows extracted color |
| 2. Blur | 200ms | Dreamy blur overlay fades in |
| 3. Image | 1000ms | Hero fades in with Ken Burns zoom |
| 4. Content | 400ms | Extended content slides up |
| 5. Title | 2500ms | Title animates in beautifully |

## Props Reference

### ParallaxHeroLayout

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `heroImage` | `string` | required | Your hero image URL |
| `heroAlt` | `string` | required | Alt text for accessibility |
| `title` | `string` | required | Page title |
| `useColorExtraction` | `boolean` | `true` | Enable the color magic |
| `heroExtendedContent` | `ReactNode` | - | Content that appears over the hero |
| `children` | `ReactNode` | - | Main scrollable content |
| `fallbackColor` | `string` | `"#1a1a1a"` | Fallback if extraction fails |

### Hero Content Components

- **HeroTitle** - Animated title with slide-up effect
- **HeroDescription** - Subtle description text below the button
- **HeroExtendedContent** - Container for overlay content (`showOnDesktop` prop!)
- **HeroActionButton** - Primary/secondary action buttons with icons
- **HeroProgressBar** - Segmented progress indicator

## CORS Note

Color extraction needs images to allow cross-origin access. Add your image domains to `next.config.ts`:

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "your-cdn.com" },
    ],
  },
};
```

## Tech Stack

- Next.js 16+ with App Router
- React 19
- Framer Motion for animations
- Tailwind CSS for styling
- TypeScript throughout

## Want to Make It Better?

This is open source and we'd love your help! Whether it's:
- Adding new animation effects
- Improving color extraction accuracy
- Building new demo examples
- Fixing bugs or improving docs

Just open a PR or issue - all contributions are welcome!

## License

MIT - go wild!

## Credits

Inspired by the beautiful Apple TV+ app animations. Sample images from [Unsplash](https://unsplash.com).

---

Made with care. Star it if you like it!
