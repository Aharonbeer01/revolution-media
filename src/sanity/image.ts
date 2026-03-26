import { createImageUrlBuilder as imageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "./client";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0];

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
