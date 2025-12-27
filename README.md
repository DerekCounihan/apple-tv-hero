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
- **Accessible** - Respects `prefers-reduced-motion` for users who need it
- **TypeScript First** - Fully typed because we're not animals

## Prerequisites

- **Node.js** 18.17 or later
- **pnpm** (recommended) - Install with `npm install -g pnpm`

## Try It Out

```bash
git clone https://github.com/DerekCounihan/apple-tv-hero.git
cd apple-tv-hero
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000). You'll see a grid of movie-style cards. **Click any card** to see the parallax effect in action!

> **What you'll see:** The card opens in a modal with instant color transition, dreamy blur effect, Ken Burns zoom, and content sliding up. This uses Next.js App Router's intercepted routes.

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
| 2. Blur | 200ms | Dreamy blur overlay fades in (300ms duration) |
| 3. Image Start | 1000ms | Hero image begins fading in with Ken Burns zoom |
| 4. Content | 400ms | Extended content container slides up |
| 5. Image Complete | 3000ms | Hero image fully visible (2s fade duration) |
| 6. Title | 2500ms | Title animates in with slide-up effect |
| 7. Description | 2700ms | Description fades in slightly after title |

## Props Reference

### ParallaxHeroLayout

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `heroImage` | `string` | required | Your hero image URL |
| `heroAlt` | `string` | required | Alt text for accessibility |
| `title` | `string` | required | Page title (shown in sticky header) |
| `subtitle` | `string` | - | Optional subtitle for sticky header |
| `heroHeight` | `number` | `320` | Height in pixels (ignored if aspectRatio set) |
| `aspectRatio` | `"auto" \| "1/1" \| "4/3" \| "16/9" \| "3/4"` | - | Responsive height based on width |
| `useColorExtraction` | `boolean` | `false` | Enable the color magic |
| `heroExtendedContent` | `ReactNode` | - | Content that appears over the hero |
| `heroOverlay` | `ReactNode` | - | Content to overlay on hero image |
| `children` | `ReactNode` | - | Main scrollable content |
| `leftAction` | `ReactNode` | Close/Back button | Custom left action button |
| `rightAction` | `ReactNode` | - | Custom right action button |
| `centerAction` | `ReactNode` | - | Custom center action element |
| `fallbackHref` | `string` | - | Fallback href for back button |
| `showGradient` | `boolean` | `true` | Show gradient overlay on hero |
| `heroBlur` | `boolean` | `false` | Apply blur effect to hero image |
| `className` | `string` | - | Additional container classes |

### Hero Content Components

#### HeroTitle
Animated title with fade-in and slide-up effect.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Title text |
| `delay` | `number` | `2.5` | Animation delay in seconds |
| `className` | `string` | - | Additional classes |

#### HeroDescription
Subtle description text that appears below the button.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Description text |
| `delay` | `number` | `2.7` | Animation delay in seconds |
| `className` | `string` | - | Additional classes |

#### HeroExtendedContent
Container for overlay content with visibility controls.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Content |
| `showOnDesktop` | `boolean` | `false` | Show on desktop (hidden by default) |
| `className` | `string` | - | Additional classes |

#### HeroActionButton
Primary/secondary action buttons with icon support.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Button text |
| `onClick` | `() => void` | required | Click handler |
| `icon` | `ReactNode` | - | Icon before text |
| `variant` | `"primary" \| "secondary"` | `"primary"` | Button style |
| `loading` | `boolean` | `false` | Show loading state |
| `disabled` | `boolean` | `false` | Disable button |
| `delay` | `number` | `2.6` | Animation delay in seconds |

#### HeroProgressBar
Segmented progress indicator.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `total` | `number` | required | Total segments |
| `completed` | `number` | required | Completed segments |

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

## Understanding the Demo Architecture

This demo uses **Next.js App Router** with **intercepted routes** to show the parallax effect in both modal and full-page contexts:

```
app/
├── page.tsx                    # Home grid of cards
├── @modal/
│   ├── (.)item/[id]/page.tsx   # Intercepted route (modal view)
│   └── default.tsx             # Empty default for parallel route
└── item/[id]/page.tsx          # Full page (direct URL access)
```

When you click a card, the intercepted route shows the parallax hero in a modal. You can also access the full page directly via URL for SEO.

> **For your project:** If you only need a full page (no modal), you can simplify to just `/item/[id]/page.tsx`.

## Troubleshooting

### Color extraction not working
- Ensure the image domain is in your `next.config.ts` remotePatterns
- Check browser console for CORS errors
- Verify `useColorExtraction={true}` is set
- Images must support `crossOrigin="anonymous"`

### Modal not closing properly
- Ensure modal context is set up (see `modal-context.tsx`)
- Check that scroll container ref is properly passed
- Verify Next.js App Router `@modal` slot is configured

### Images look blurry
- This is the blur phase! It fades to crisp after Ken Burns effect
- If image stays blurry, check `isHeroImageLoaded` state
- Verify image URLs are correct and accessible

### Animation stuttering
- Check for too many parallel animations
- Consider disabling blur on mobile with `heroBlur={false}`
- Profile with Chrome DevTools Performance tab

### "Cross-Origin Request Blocked" error
- Add image domain to `next.config.ts` remotePatterns
- Ensure the image server returns `Access-Control-Allow-Origin: *` header

### Pre-warm not working
- Use the exact same URL for thumbnail and detail view
- Check that `preWarmImageColor` is called after image loads
- Cache holds max 100 images (LRU eviction)

## FAQ

### Can I use this with local images?
Yes! Import your image and pass it directly: `heroImage={myImage.src}`

### Does color extraction work on all image types?
Works best on JPG/PNG. SVG and animated GIFs may not work as expected.

### How do I customize the animation timing?
Edit the animation constants in:
- `parallax-hero-layout.tsx` - Hero entrance timing
- `hero-content/*.tsx` - Individual component delays

### Can I use this with Next.js Image optimization?
Yes! The component uses `<Image>` from Next.js internally.

### What about dark mode?
The component applies a soft dark overlay for contrast. Works great in dark mode by default.

### Performance on mobile?
Pre-warm colors on image load for instant transitions. The LRU cache handles memory efficiently.

### Can I disable the blur effect?
The blur is part of the Apple TV effect. For simpler use, set `useColorExtraction={false}`.

### How do I make content scrollable?
Pass any content as `children` - it automatically works with the parallax scroll container.

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
- Accessibility improvements

### Development Setup

```bash
git clone https://github.com/DerekCounihan/apple-tv-hero.git
cd apple-tv-hero
pnpm install
pnpm dev
```

### Code Style
- TypeScript for type safety
- Component names in PascalCase
- Props interfaces with JSDoc comments
- Follow existing component structure

Just open a PR or issue - all contributions are welcome!

## License

MIT - go wild!

## Credits

Inspired by the beautiful Apple TV+ app animations. Sample images from [Unsplash](https://unsplash.com).

---

Made with care. Star it if you like it!
