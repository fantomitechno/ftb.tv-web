import { randomUUID } from 'crypto';


const cookies = new Map<string, number>();

const isValidCookie = (cookie: string) => {
  clearCookies();
  const expiration = cookies.get(cookie) ?? 0;
  return expiration > Date.now();
}

const createCookie = () => {
  const uuid = randomUUID()
  cookies.set(
    uuid,
    Date.now() + 20 * 60 * 1000)
  return uuid;
}

const deleteCookie = (cookie: string) => {
  return cookies.delete(cookie);
}

const clearCookies = () => {
  let cleared = 0;
  for (const [cookie, expiration] of cookies.entries()) {
    if (expiration < Date.now()) {
      cookies.delete(cookie);
      cleared++;
    }
  }
  return cleared;
}

export { isValidCookie, createCookie, deleteCookie, clearCookies };