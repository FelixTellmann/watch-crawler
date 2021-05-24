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

const parseWatchshopCom = async (url: string): Promise<ReturnModel> => {
  const [result] = await Promise.allSettled([axios(url || "")]);
  if (result.status !== "fulfilled") return { content: [], images: [] };

  const { document, location } = new JSDOM(result.value.data).window;
  const { host } = location;
  const data = { content: [], images: [] };

  if (document.querySelectorAll(".product-img").length === 0) return { content: [], images: [] };

  document.querySelectorAll(".product-img img").forEach(node => {
    if (node?.src) {
      data.images.push(`http:${node.src}`);
    }
  });
  return data;
};

const parseAzzamwatchesCom = async (url: string): Promise<ReturnModel> => {
  const [result] = await Promise.allSettled([axios(url || "")]);
  if (result.status !== "fulfilled") return { content: [], images: [] };

  const { document, location } = new JSDOM(result.value.data).window;
  const { host } = location;
  const data = { content: [], images: [] };

  if (document.querySelectorAll(".product-detail-image").length === 0) return { content: [], images: [] };

  document.querySelectorAll(".product-detail-image a.gallery-image").forEach(node => {
    if (node?.href) {
      data.images.push(`http:${node.href}`);
    }
  });
  return data;
};

const parseBellalunaCoZa = async (url: string): Promise<ReturnModel> => {
  const [result] = await Promise.allSettled([axios(url || "")]);
  if (result.status !== "fulfilled") return { content: [], images: [] };

  const { document, location } = new JSDOM(result.value.data).window;
  const { host } = location;
  const data = { content: [], images: [] };

  if (document.querySelectorAll(".product-img-box").length === 0) return { content: [], images: [] };

  document.querySelectorAll(".product-img-box a.fancybox").forEach(node => {
    if (node?.href) {
      data.images.push(`https:${node.href}`);
    }
  });
  return data;
};

const parseBrandfieldCom = async (url: string): Promise<ReturnModel> => {
  const [result] = await Promise.allSettled([axios(url || "")]);
  if (result.status !== "fulfilled") return { content: [], images: [] };

  const { document, location } = new JSDOM(result.value.data).window;
  const { host } = location;
  const data = { content: [], images: [] };

  if (document.querySelectorAll(".product-image-gallery").length === 0) return { content: [], images: [] };

  document.querySelectorAll(".product-image-gallery img").forEach(node => {
    if (node?.dataset?.src) {
      data.images.push(`${node?.dataset?.src}`);
    }
  });
  return data;
};

const parseWatchesprimeCom = async (url: string): Promise<ReturnModel> => {
  const [result] = await Promise.allSettled([axios(url || "")]);
  if (result.status !== "fulfilled") return { content: [], images: [] };

  const { document, location } = new JSDOM(result.value.data).window;
  const { host } = location;
  const data = { content: [], images: [] };

  if (document.querySelectorAll(".woocommerce-product-gallery").length === 0) return { content: [], images: [] };

  document.querySelectorAll(".woocommerce-product-gallery a").forEach(node => {
    if (node?.href) {
      data.images.push(`${node.href}`);
    }
  });
  return data;
};

const parseWatchfinderCoZa = async (url: string): Promise<ReturnModel> => {
  const [result] = await Promise.allSettled([axios(url || "")]);
  if (result.status !== "fulfilled") return { content: [], images: [] };

  const { document, location } = new JSDOM(result.value.data).window;
  const { host } = location;
  const data = { content: [], images: [] };

  if (document.querySelectorAll(".product-img-column").length === 0) return { content: [], images: [] };

  document.querySelectorAll(".product-img-column a").forEach(node => {
    if (node?.href) {
      data.images.push(`${node.href}`);
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

  if (/watchshop\.com/gi.test(req.query?.url)) {
    const data = await parseWatchshopCom(req.query.url);
    res.status(200).json(data);
    return;
  }

  if (/azzamwatches\.com/gi.test(req.query?.url)) {
    const data = await parseAzzamwatchesCom(req.query.url);
    res.status(200).json(data);
    return;
  }

  if (/bellaluna\.co\.za/gi.test(req.query?.url)) {
    const data = await parseBellalunaCoZa(req.query.url);
    res.status(200).json(data);
    return;
  }

  if (/brandfield\.com/gi.test(req.query?.url)) {
    const data = await parseBrandfieldCom(req.query.url);
    res.status(200).json(data);
    return;
  }

  if (/watchesprime\.com/gi.test(req.query?.url)) {
    const data = await parseWatchesprimeCom(req.query.url);
    res.status(200).json(data);
    return;
  }

  if (/watchfinder\.co\.za/gi.test(req.query?.url)) {
    const data = await parseWatchfinderCoZa(req.query.url);
    res.status(200).json(data);
    return;
  }

  res.status(200).json({ content: [], images: [] });
};
