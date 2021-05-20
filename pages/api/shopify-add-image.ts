import { fetchShopify } from "lib/fetch";

import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest & { query: { imgUrl?: string; productId?: string } }, res: NextApiResponse) => {
  console.log(req.query?.productId || "");

  if (!req.query?.productId || !req.query?.imgUrl) {
    res.status(200).json({});
    return;
  }

  const body = {
    image: {
      src: req.query.imgUrl,
    },
  };

  const [result] = await Promise.allSettled([fetchShopify(`products/${req.query?.productId}/images.json`, "POST", body)]);

  if (result.status !== "fulfilled" || !result.value?.data) {
    res.status(200).json({});
    return;
  }

  res.status(200).json(result.value.data);
};
