import Image from "next/image";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { resolveImage } from "@/lib/cms";
import type { Media } from "@/payload-types";

/**
 * An upload field's image, or the hatched placeholder while no image is set.
 *
 * Renders with `fill`, so the parent decides the box: give it a size and
 * `position: relative` (the `.blueprint` frame already is).
 */
export function CmsImage({
  media,
  placeholderLabel,
  sizes,
  onPanel = false,
}: {
  media: number | Media | null | undefined;
  /** Shown in the placeholder; also seeds its unique hatch pattern id. */
  placeholderLabel: string;
  /** `sizes` hint for `next/image`; describes the box's rendered width. */
  sizes: string;
  onPanel?: boolean;
}) {
  const image = resolveImage(media);

  if (!image) {
    return <MediaPlaceholder label={placeholderLabel} onPanel={onPanel} />;
  }

  return (
    <Image
      src={image.url}
      alt={image.alt}
      fill
      sizes={sizes}
      className="object-cover"
    />
  );
}
