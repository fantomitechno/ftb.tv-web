import type { APIRoute } from "astro";
import { prisma } from "../../utils/database";
import { createCookie, deleteCookie } from "../../utils/cookie";

interface TokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  token_type: string
}

export interface SimplifiedUserResponse {
  id: string,
  login: string
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

  const userRes = await fetch("https://api.twitch.tv/helix/users",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${json.access_token}`,
        "Client-Id": process.env.TWITCH_ID!,
        "Content-Type": "application/json",
      }
    }
  )

  const user: SimplifiedUserResponse = (await userRes.json()).data[0];

  await prisma.token.create({
    data: {
      channelId: user.id,
      accessToken: json.access_token,
      expiresIn: json.expires_in,
      refreshToken: json.refresh_token
    }
  });

  return user
};

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get("code");
  const user = await getToken(code!);
  const oldToken = cookies.get("token")?.value;
  if (oldToken) deleteCookie(oldToken);
  cookies.set("token", createCookie(user.login, user.id), { path: "/" });
  return redirect("/admin", 302);
}