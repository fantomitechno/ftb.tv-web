import type { APIRoute } from "astro";
import { prisma } from "../../utils/database";

interface TokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string[]
  token_type: string
}

const getToken = async (code: string) => {
  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_ID}&client_secret=${process.env.TWITCH_SECRET}&grant_type=authorization_code&redirect_uri=https://${process.env.REDIRECT_URI}/api/twitch&code=${code}`,
    {
      method: 'POST'
    }
  );
  const json: TokenResponse = await res.json();

  const oldToken = await prisma.token.findFirst();
  if (oldToken) await prisma.token.delete({ where: oldToken });

  await prisma.token.create({
    data: {
      accessToken: json.access_token,
      expiresIn: json.expires_in,
      refreshToken: json.refresh_token
    }
  });
};

export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get("code");
  await getToken(<string>code);
  return new Response("Got token");
}