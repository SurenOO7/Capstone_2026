import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

const ITERATIONS = 210_000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";
const HASH_PREFIX = "pbkdf2";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString(
    "hex",
  );

  return `${HASH_PREFIX}:${ITERATIONS}:${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [prefix, iterationsValue, salt, hash] = storedHash.split(":");
  const iterations = Number(iterationsValue);

  if (
    prefix !== HASH_PREFIX ||
    !Number.isInteger(iterations) ||
    iterations < ITERATIONS ||
    !salt ||
    !hash
  ) {
    return false;
  }

  const expected = Buffer.from(hash, "hex");
  const actual = pbkdf2Sync(password, salt, iterations, expected.length, DIGEST);

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
