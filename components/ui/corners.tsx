/**
 * Registration marks that overhang the four corners of a `.blueprint` box.
 *
 * Rendered as siblings rather than pseudo-elements so the same treatment can be
 * dropped onto any element — article, form, button — without that element
 * having to give up its own ::before/::after.
 */
export function Corners() {
  return (
    <>
      <i aria-hidden className="corner corner-tl" />
      <i aria-hidden className="corner corner-tr" />
      <i aria-hidden className="corner corner-bl" />
      <i aria-hidden className="corner corner-br" />
    </>
  );
}
