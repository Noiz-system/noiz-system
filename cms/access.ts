import type { Access } from "payload";

/**
 * Two roles only: the public reads, signed-in editors write.
 *
 * Everything the landing page renders is public by definition, so the read
 * side is wide open. There is no per-user ownership yet — anyone with an admin
 * account can edit any content.
 */
export const anyone: Access = () => true;

export const authenticated: Access = ({ req }) => Boolean(req.user);

export const publicRead = {
  read: anyone,
  create: authenticated,
  update: authenticated,
  delete: authenticated,
};
