import axios, { AxiosPromise } from "axios";

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_PASSWORD = process.env.SHOPIFY_API_PASSWORD;
const SHOPIFY_API_STORE = process.env.SHOPIFY_API_STORE;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION;

type fetchProps = (
  api: string,
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  body?: unknown | string
) => AxiosPromise;

export const fetchShopify: fetchProps = (api, method = "GET", body = {}) => {
  const config = {
    method,
    url: `https://${SHOPIFY_API_KEY}:${SHOPIFY_API_PASSWORD}@${SHOPIFY_API_STORE}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}/${api.replace(
      /^\//,
      ""
    )}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: method !== "GET" ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
  };
  return axios(config);
};
