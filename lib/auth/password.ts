import { hash, compare } from 'bcryptjs';
export async function hashPassword(pw: string) { return hash(pw, 12); }
export async function comparePassword(pw: string, hash: string) { return compare(pw, hash); }
