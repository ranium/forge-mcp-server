import fetch from 'node-fetch';
import { ForgeApiRequest } from "../core/types/protocols.js";

export async function callForgeApi(req: ForgeApiRequest, forgeApiKey: string): Promise<any> {
  const baseUrl = "https://forge.laravel.com/api/v1";
  const url = baseUrl + req.endpoint;
  
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${forgeApiKey}`,
    "Accept": "application/json",
    "Content-Type": "application/json"
  };

  let response;
  try {
    response = await fetch(url, {
      method: req.method.toUpperCase(),
      headers,
      body: req.data ? JSON.stringify(req.data) : undefined,
    });
  } catch (err) {
    throw new Error(`Network error: ${err}`);
  }

  const contentType = response.headers.get("content-type");
  let result;
  if (contentType && contentType.includes("application/json")) {
    result = await response.json();
  } else {
    result = await response.text();
  }

  if (!response.ok) {
    throw new Error(`Forge API error (${response.status}): ${JSON.stringify(result)}`);
  }

  return result;
} 