import type { APIRoute } from 'astro';
import { clearCookies, createCookie } from '../../utils/cookie';

const password = process.env.PASSWORD;

export const POST: APIRoute = async ({ request }) => {
  clearCookies();
  const data = await request.json()
  if (!data.token || data.token == "") {
    return new Response(
      JSON.stringify({
        message: "Missing required fields",
      }),
      { status: 400 }
    );
  }
  if (data.token != password) {
    return new Response(
      JSON.stringify({
        message: "Wrong token"
      }), { status: 401 });
  }

  const cookie = createCookie();

  return new Response(
    JSON.stringify({
      message: "Good token",
      token: cookie
    }), { status: 202 }
  )
}

export const GET: APIRoute = async () => {
  return new Response("hello :3", { status: 200 })
}