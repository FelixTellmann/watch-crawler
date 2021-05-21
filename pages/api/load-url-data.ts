import axios from "axios";
import { JSDOM } from "jsdom";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";

type ReturnModel = { content: { table: { td: string; th: string }[]; title: string }[]; images: string[] };

const parseWatchCoUk = async (url: string): Promise<ReturnModel> => {
  const [result] = await Promise.allSettled([axios(url || "")]);
  if (result.status !== "fulfilled") return { content: [], images: [] };

  const { document, location } = new JSDOM(result.value.data).window;
  const { host } = location;
  const data = { content: [], images: [] };

  if (document.querySelectorAll(".specs_specifications").length === 0) return { content: [], images: [] };

  document.querySelectorAll(".main-img a").forEach(node => {
    if (node?.href) {
      if (validator.isURL(node.href)) {
        data.images.push(`${node.href}`);
      }
      if (!validator.isURL(node.href)) {
        data.images.push(`https://www.watch.co.uk${node.href}`);
      }
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

  return data;
};

const parseHouseofwatchesCoUk = async (url: string): Promise<ReturnModel> => {
  const [result] = await Promise.allSettled([axios(url || "")]);
  if (result.status !== "fulfilled") return { content: [], images: [] };

  const { document, location } = new JSDOM(result.value.data).window;
  const { host } = location;
  const data = { content: [], images: [] };

  if (document.querySelectorAll(".product-spec").length === 0) return { content: [], images: [] };

  document.querySelectorAll(".product-image-gallery a").forEach(node => {
    if (node?.href) {
      if (validator.isURL(node.href)) {
        data.images.push(`${node.href}`);
      }
      if (!validator.isURL(node.href)) {
        data.images.push(`https://www.houseofwatches.co.uk/${node.href}`);
      }
    }
  });

  document.querySelectorAll(".product-spec table tr th, .product-spec table tr td").forEach(node => {
    if (node.localName === "th") {
      data.content.push({ title: node.textContent, table: [] });
    }

    if (node.localName === "td" && /<strong>/gi.test(node.innerHTML)) {
      data.content[data.content.length - 1].table.push({ th: node.textContent, td: "" });
    }

    if (node.localName === "td" && !/<strong>/gi.test(node.innerHTML)) {
      data.content[data.content.length - 1].table[data.content[data.content.length - 1].table.length - 1].td =
        node.textContent;
    }
  });

  return data;
};

export default async (req: NextApiRequest & { query: { url?: string } }, res: NextApiResponse) => {
  if (!validator.isURL(req.query?.url)) {
    console.log(req.query?.url || "");
    res.status(200).json({ content: [], images: [] });
    return;
  }

  if (/watch\.co\.uk/gi.test(req.query?.url)) {
    const data = await parseWatchCoUk(req.query.url);
    res.status(200).json(data);
    return;
  }
  if (/houseofwatches\.co\.uk/gi.test(req.query?.url)) {
    const data = await parseHouseofwatchesCoUk(req.query.url);
    res.status(200).json(data);
    return;
  }

  res.status(200).json({ content: [], images: [] });
};
