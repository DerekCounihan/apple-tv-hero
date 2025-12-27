"use client";

import { use } from "react";
import { Play, ArrowLeft } from "lucide-react";
import Link from "next/link";
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
import { getSampleItem } from "@/data/sample-items";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ItemPage({ params }: PageProps) {
  const { id } = use(params);
  const item = getSampleItem(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Back button - fixed position for direct navigation */}
      <Link
        href="/"
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-md transition-colors hover:bg-black/70"
      >
        <ArrowLeft className="h-5 w-5 text-white" />
      </Link>

      <ParallaxHeroLayout
        heroImage={item.image}
        heroAlt={item.title}
        title={item.title}
        aspectRatio="auto"
        useColorExtraction={true}
        heroExtendedContent={
          <HeroExtendedContent showOnDesktop>
            <HeroTitle delay={2.5}>{item.title}</HeroTitle>
            <HeroActionButton
              onClick={() => alert("Get Started clicked!")}
              icon={<Play className="h-4 w-4" />}
            >
              Get Started
            </HeroActionButton>
            <HeroDescription>{item.tagline}</HeroDescription>
          </HeroExtendedContent>
        }
      >
        <ParallaxHeroContent>
          <div className="px-5 py-6">
            <h2 className="text-lg font-semibold text-white">{item.subtitle}</h2>
            <p className="mt-3 text-white/70 leading-relaxed">
              {item.description}
            </p>

            {item.stats && (
              <div className="mt-6 rounded-xl bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Progress</span>
                  <span className="font-medium text-white">
                    {item.stats.progress} / {item.stats.total}
                  </span>
                </div>
              </div>
            )}

            {/* Demo content sections */}
            <div className="mt-8 space-y-6">
              <section>
                <h3 className="font-semibold text-white">About this experience</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">
                  This is the direct page view of the Apple TV-style parallax
                  hero effect. You can navigate here directly by URL or share
                  this link with others.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-white">Animation phases</h3>
                <ul className="mt-2 space-y-1 text-sm text-white/60">
                  <li>• Instant color background from extraction</li>
                  <li>• Blur overlay fades in (200ms)</li>
                  <li>• Full image with Ken Burns (1000ms)</li>
                  <li>• Content slides up (staggered)</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-white">Try it yourself</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">
                  Scroll down to see the parallax effect as the hero image
                  responds to scroll position. The gradient mask creates a
                  seamless transition to the content area.
                </p>
              </section>
            </div>

            {/* Spacer for scroll demo */}
            <div className="h-48" />
          </div>
        </ParallaxHeroContent>
      </ParallaxHeroLayout>
    </div>
  );
}
