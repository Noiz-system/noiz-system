import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getPayload } from "payload";
import config from "@payload-config";

/**
 * Copies the files behind existing Media documents into the object storage
 * bucket (`S3_*` in `.env`), so documents created before storage was turned
 * on keep working once it is.
 *
 *   pnpm media:upload            – dry run: lists the files missing from the bucket
 *   pnpm media:upload --apply    – uploads them
 *
 * Each file is looked up in `media/`, then in `scripts/seed/assets/` (Payload
 * may have stored a brand file as `name-1.svg`; the seed asset is `name.svg`).
 * The object key is the document's prefix and filename, which is what the
 * storage adapter reads, so `/api/media/file/<name>` URLs stay the same.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SEARCH_DIRS = [path.join(root, "media"), path.join(root, "scripts/seed/assets")];
const apply = process.argv.includes("--apply");

async function main() {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) throw new Error("S3_BUCKET is not set: nothing to upload to.");

  const client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION ?? "us-east-2",
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });

  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "media",
    pagination: false,
    depth: 0,
  });
  payload.logger.info(
    `${apply ? "Uploading to" : "Dry run against"} bucket "${bucket}" (${docs.length} media documents)`,
  );

  let missing = 0;
  let notFound = 0;
  for (const doc of docs) {
    if (!doc.filename) continue;
    const key = doc.prefix ? `${doc.prefix.replace(/\/$/, "")}/${doc.filename}` : doc.filename;

    if (await exists(client, bucket, key)) {
      payload.logger.info(`✓ ${key} already in the bucket`);
      continue;
    }
    missing += 1;

    const source = await findLocalFile(doc.filename);
    if (!source) {
      notFound += 1;
      payload.logger.warn(`✗ ${key}: no local copy found — re-upload it in /admin`);
      continue;
    }

    if (!apply) {
      payload.logger.info(`• would upload ${key} from ${path.relative(root, source)}`);
      continue;
    }
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: await readFile(source),
        ContentType: doc.mimeType ?? undefined,
      }),
    );
    payload.logger.info(`↑ uploaded ${key}`);
  }

  if (missing === 0) payload.logger.info("Every media file is already in the bucket.");
  else if (!apply) payload.logger.info(`${missing - notFound} file(s) to upload. Re-run with --apply.`);
  else payload.logger.info(`Done: ${missing - notFound} file(s) uploaded.`);
}

async function exists(client: S3Client, bucket: string, key: string) {
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch (error) {
    const status = (error as { $metadata?: { httpStatusCode?: number } }).$metadata
      ?.httpStatusCode;
    if (status === 404) return false;
    throw error;
  }
}

/** `media/<name>`, else the seed asset with the `-N` suffix Payload may have added removed. */
async function findLocalFile(filename: string) {
  const original = filename.replace(/-\d+(\.[^.]+)$/, "$1");
  for (const dir of SEARCH_DIRS) {
    for (const name of new Set([filename, original])) {
      const candidate = path.join(dir, name);
      try {
        await access(candidate);
        return candidate;
      } catch {
        // try the next one
      }
    }
  }
  return null;
}

await main();
process.exit(0);
