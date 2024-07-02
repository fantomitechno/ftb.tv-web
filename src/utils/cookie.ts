import { randomUUID } from 'crypto';

const channels = process.env.CHANNELS!.split(",");
const cookies = new Map<string, { expritation: number, channel: string, channelId: string }>();

const isValidCookie = (cookie: string) => {
  clearCookies();
  const value = cookies.get(cookie);
  return value && value.expritation > Date.now() && channels.includes(value.channel);
}

const createCookie = (channel: string, channelId: string) => {
  const uuid = randomUUID()
  cookies.set(
    uuid,
    {
      expritation: Date.now() + 60 * 60 * 1000,
      channel,
      channelId
    })
  return uuid;
}

const getChannel = (cookie: string) => {
  return cookies.get(cookie)!.channelId;
}

const deleteCookie = (cookie: string) => {
  return cookies.delete(cookie);
}

const clearCookies = () => {
  let cleared = 0;
  for (const [cookie, value] of cookies.entries()) {
    if (value.expritation < Date.now()) {
      deleteCookie(cookie);
      cleared++;
    }
  }
  return cleared;
}

export { isValidCookie, createCookie, deleteCookie, clearCookies, getChannel };