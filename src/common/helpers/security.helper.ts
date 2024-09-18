import * as argon2 from 'argon2';

export async function createHashedString(value: string) {
  const hash = await argon2.hash(value);
  return hash;
}

export async function verifyHashedString(hash: string, value: string) {
  const match = await argon2.verify(hash, value);
  return match;
}
