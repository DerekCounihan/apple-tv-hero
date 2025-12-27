"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { preWarmImageColor } from "@/components/parallax-hero/use-image-color";
import { cn } from "@/lib/utils";

interface SampleCardProps {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  className?: string;
}

/**
 * SampleCard - Demo card that pre-warms color on image load
 *
 * Features:
 * - Image with hover scale effect
 * - Pre-warms color extraction for instant transitions
 * - Links to /item/[id] (intercepted route)
 */
export function SampleCard({
  id,
  title,
  subtitle,
  image,
  className,
}: SampleCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Pre-warm color extraction when image loads
  useEffect(() => {
    if (imageLoaded) {
      preWarmImageColor(image);
    }
  }, [imageLoaded, image]);

  return (
    <Link
      href={`/item/${id}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl bg-neutral-900 transition-transform hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      {/* Image container with aspect ratio */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className={cn(
            "object-cover transition-all duration-500",
            "group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 50vw, 33vw"
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Text content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-semibold text-white text-lg leading-tight line-clamp-2">
            {title}
          </h3>
          <p className="mt-1 text-white/70 text-sm line-clamp-1">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
}
