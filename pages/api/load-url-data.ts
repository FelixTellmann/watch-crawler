import axios from "axios";
import { JSDOM } from "jsdom";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest & { query: { url?: string } }, res: NextApiResponse) => {
  console.log(req.query?.url || "");

  const [result] = await Promise.allSettled([axios(req.query?.url || "")]);
  if (result.status !== "fulfilled") {
    res.status(200).json([]);
    return;
  }
  // console.log(result.data);
  const { document, location } = new JSDOM(result.value.data).window;

  if (document.querySelectorAll(".specs_specifications").length === 0) {
    res.status(200).json([]);
    return;
  }

  const { host } = location;
  const data = { content: [], images: [] };

  document.querySelectorAll(".main-img a").forEach(node => {
    if (node?.href) {
      data.images.push(`https://www.watch.co.uk${node.href}`);
    }
  });

  document
    .querySelectorAll(".specs_specifications")[0]
    .querySelectorAll(".foldable")
    .forEach((node, i) => {
      const title = node.querySelectorAll("h3")[0]?.innerHTML.replace(/^(.*?)<.*/gi, "$1");
      console.log(title);
      const table = [];
      node.querySelectorAll("tr")?.forEach(row => {
        if (row.querySelector("th")?.textContent) {
          table.push({ th: row.querySelector("th")?.textContent, td: row.querySelector("td")?.textContent });
        }
      });
      data.content.push({ title, table });
    });

  res.status(200).json(data);
};
