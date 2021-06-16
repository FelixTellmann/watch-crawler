import { fetchShopify, fetchShopifyGQL } from "lib/fetch";

import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest & { query: { sku?: string } }, res: NextApiResponse) => {
  console.log(req.query?.sku || "");

  if (!req.query?.sku) {
    res.status(200).json({});
    return;
  }

  const [result] = await Promise.allSettled([
    fetchShopifyGQL(`{
  productVariants(first: 1, query: "sku:${req.query.sku}" ) {
    edges {
      node {
        product {
          id
        }
      }
    }
  }
}`),
  ]);

  if (result.status !== "fulfilled" || !result.value?.data) {
    res.status(200).json({});
    return;
  }

  res
    .status(200)
    .json(result.value.data.data.productVariants?.edges[0]?.node.product.id.replace("gid://shopify/Product/", "") || "");
};
