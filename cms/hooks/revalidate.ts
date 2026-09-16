import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";
import { revalidatePath } from "next/cache";

/**
 * Every collection and global feeds the one landing page, so any edit means the
 * prerendered page — in both languages — is stale.
 *
 * `revalidatePath("/", "layout")` is the documented "invalidate everything"
 * idiom. It is deliberately used over a `/(frontend)/[locale]` page path,
 * which would silently stop matching if the route group were renamed.
 *
 * The seed script runs outside a Next.js request, where `revalidatePath`
 * throws; it opts out through `context.disableRevalidate`.
 */
function revalidateLanding(context: Record<string, unknown>) {
  if (context.disableRevalidate) return;
  revalidatePath("/", "layout");
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({
  doc,
  req,
}) => {
  revalidateLanding(req.context);
  return doc;
};

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({
  doc,
  req,
}) => {
  revalidateLanding(req.context);
  return doc;
};

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = ({
  doc,
  req,
}) => {
  revalidateLanding(req.context);
  return doc;
};

/** Hook set shared by every content collection. */
export const collectionRevalidation = {
  afterChange: [revalidateAfterChange],
  afterDelete: [revalidateAfterDelete],
};
