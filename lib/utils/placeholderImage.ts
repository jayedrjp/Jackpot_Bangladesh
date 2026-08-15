/**
 * TEMPORARY placeholder food photography, sourced by tag (not a specific
 * copyrighted photo, not AI-generated fake "Jackpot" food). Every call site
 * using this should be swapped for a real client-supplied photo uploaded to
 * Firebase Storage before launch — see README "Client Image Workflow".
 */
export function placeholderFoodImage(
  tag: string,
  width = 600,
  height = 450,
): string {
  const seed = Math.abs(hashString(tag));
  return `https://loremflickr.com/${width}/${height}/${encodeURIComponent(tag)}?lock=${seed}`;
}

/**
 * TEMPORARY placeholder avatar photography for testimonial/review UI during
 * development. Swap for real customer photos (with consent) or remove the
 * avatar entirely once wired to real reviews.
 */
export function placeholderAvatarImage(tag: string, size = 160): string {
  const seed = Math.abs(hashString(tag)) + 1000;
  return `https://loremflickr.com/${size}/${size}/${encodeURIComponent(tag)},face?lock=${seed}`;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
