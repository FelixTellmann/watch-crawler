import { fetchShopify } from "lib/fetch";

import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest & { query: { productId?: string } }, res: NextApiResponse) => {
  console.log(req.query?.productId || "");

  if (!req.query?.productId) {
    res.status(200).json({});
    return;
  }

  const [result] = await Promise.allSettled([fetchShopify(`products/${req.query?.productId}`)]);

  if (result.status !== "fulfilled" || !result.value?.data?.product) {
    res.status(200).json({});
    return;
  }

  res.status(200).json(result.value.data.product);
};
