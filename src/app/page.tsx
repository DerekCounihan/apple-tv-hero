import { SampleCard } from "@/components/demo/sample-card";
import { sampleItems } from "@/data/sample-items";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <h1 className="text-xl font-bold">Apple TV Hero Demo</h1>
          <p className="text-sm text-white/60">
            Click any card to see the parallax effect
          </p>
        </div>
      </header>

      {/* Card Grid */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {sampleItems.map((item) => (
            <SampleCard
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle={item.subtitle}
              image={item.image}
            />
          ))}
        </div>

        {/* Info Section */}
        <section className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <span className="text-white">1. Color Extraction</span> — When a
              card image loads, the dominant color is extracted and cached
            </li>
            <li>
              <span className="text-white">2. Instant Transition</span> — On
              click, the cached color displays immediately as a solid background
            </li>
            <li>
              <span className="text-white">3. Blur Phase</span> — A blurred
              version of the image fades in with a gradient mask
            </li>
            <li>
              <span className="text-white">4. Ken Burns</span> — The full image
              reveals with a subtle zoom animation (1.25x → 1x)
            </li>
            <li>
              <span className="text-white">5. Content Reveal</span> — Title and
              content slide up with staggered timing
            </li>
          </ul>
        </section>

        {/* GitHub Link */}
        <footer className="mt-8 text-center text-sm text-white/40">
          <a
            href="https://github.com/DerekCounihan/apple-tv-hero"
            className="hover:text-white/70"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub →
          </a>
        </footer>
      </main>
    </div>
  );
}
