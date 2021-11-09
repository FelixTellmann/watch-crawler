import { fetchShopify } from "lib/fetch";

import { NextApiRequest, NextApiResponse } from "next";

export default async (
  req: NextApiRequest & { query: { imgId?: string; productId?: string } },
  res: NextApiResponse
) => {
  console.log(req.query?.productId || "");

  if (!req.query?.productId || !req.query?.imgId) {
    res.status(200).json({});
    return;
  }

  const body = {
    image: {
      src: req.query.imgUrl,
    },
  };

  const [result] = await Promise.allSettled([
    fetchShopify(
      `products/${req.query?.productId}/images/${req.query?.imgId}.json`,
      "DELETE",
      body
    ),
  ]);

  if (result.status !== "fulfilled" || !result.value?.data) {
    res.status(200).json({});
    return;
  }

  res.status(200).json(result.value.data);
};
