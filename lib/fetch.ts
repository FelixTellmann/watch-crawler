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
    data: method !== "GET" ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method,
    url: `https://${SHOPIFY_API_KEY}:${SHOPIFY_API_PASSWORD}@${SHOPIFY_API_STORE}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}/${api.replace(
      /^\//,
      ""
    )}`,
  };
  return axios(config);
};

export const fetchShopifyGQL = (gql: string): AxiosPromise => {
  return axios({
    data: gql,
    headers: {
      Accept: "application/graphql",
      "Content-Type": "application/graphql",
      "X-Shopify-Access-Token": SHOPIFY_API_PASSWORD,
    },
    method: "POST",
    url: `https://${SHOPIFY_API_STORE}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
  });
};
