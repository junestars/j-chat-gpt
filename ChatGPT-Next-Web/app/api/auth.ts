import { NextRequest } from "next/server";
import { getServerSideConfig } from "../config/server";

const parseJSON = (response: any) => {
  return response.json ? response.json() : response;
};

async function verifyToken(token: string) {
  const url = `${process.env.NEXT_PUBLIC_NODE_SERVER_BASE_URL}/verify-auth`;
  const data = JSON.stringify({ token });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: data,
  });

  const { statusCode, message, apiKey } = await parseJSON(response);

  if (statusCode === "000000") {
    const serverConfig = getServerSideConfig();
    // 使用验证接口返回的，或是环境变量配置的 apiKey
    return { error: false, message: "", apiKey: apiKey || serverConfig.apiKey };
  } else {
    return Promise.reject({
      error: true,
      message: message || "Invalid token",
      statusCode,
    });
  }
}

export async function auth(req: NextRequest) {
  const token = req.headers.get("x-auth-token") ?? "";

  if (!token) {
    // 没有传 token 则直接验证失败
    return Promise.reject({ error: true, message: "not found token" });
  }

  return verifyToken(token);
}