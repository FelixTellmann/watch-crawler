import axios from "axios";
import Link from "next/link";
import Loading from "public/icons/loading.svg";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { IoCloudDownloadOutline, IoCopy } from "react-icons/io5";
import validator from "validator";
import multiDownload from "multi-download";
import { saveAs } from "file-saver";

type SiteDataProps = {
  content: { table: { td: string; th: string }[]; title: string }[];
  currentImages: { id: number; src: string }[];
  images: string[];
  onShopify: boolean;
};

export const Index: FC = ({}) => {
  const urlInput = useRef<HTMLInputElement>(null);
  const shopifyProductRef = useRef<HTMLInputElement>(null);
  const shopifySKURef = useRef<HTMLInputElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const [clipboardData, setClipboardData] = useState("");
  const [siteData, setSiteData] = useState<SiteDataProps>({ content: [], currentImages: [], images: [], onShopify: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const url = urlInput.current.value;
    if (!validator.isURL(url)) {
      setLoading(false);
      return;
    }

    const site = await axios(`/api/load-url-data?url=${encodeURI(url)}`);
    const product = await axios(`/api/shopify-product?productId=${shopifyProductRef.current.value}`);

    console.log(product);
    setSiteData(siteData => {
      site.data["currentImages"] = [];
      site.data["onShopify"] = false;
      if (product?.data?.images?.length > 0) {
        product.data.images.map(({ src, id }) => {
          site.data["currentImages"].push({ id: id, src: src });
        });
      }
      if (product?.data?.id) {
        site.data["onShopify"] = true;
      }
      return site.data;
    });
    setLoading(false);
  };

  useEffect(() => {
    console.log(document.getElementById("fx-tabs"));
    const content = document.getElementById("fx-tabs")?.parentElement.innerHTML;
    setClipboardData(content);
  }, [siteData]);

  const copyToClipboard = e => {
    e.preventDefault();
    navigator?.clipboard.writeText(clipboardData);
  };

  const addImgToShopify = async (imgUrl: string) => {
    setLoading(true);
    await axios(`/api/shopify-add-image?imgUrl=${encodeURI(imgUrl)}&productId=${shopifyProductRef.current.value}`);
    const product = await axios(`/api/shopify-product?productId=${shopifyProductRef.current.value}`);
    setSiteData(siteData => {
      siteData["currentImages"] = [];
      siteData["onShopify"] = false;
      if (product?.data?.images?.length > 0) {
        product.data.images.map(({ src, id }) => {
          siteData["currentImages"].push({ id: id, src: src });
        });
      }
      if (product?.data?.id) {
        siteData["onShopify"] = true;
      }
      return siteData;
    });
    setLoading(false);
  };

  const removeFromShopify = async (id: number) => {
    setLoading(true);
    await axios(`/api/shopify-delete-image?&productId=${shopifyProductRef.current.value}&imgId=${id}`);
    const product = await axios(`/api/shopify-product?productId=${shopifyProductRef.current.value}`);
    setSiteData(siteData => {
      siteData["currentImages"] = [];
      siteData["onShopify"] = false;
      if (product?.data?.images?.length > 0) {
        product.data.images.map(({ src, id }) => {
          siteData["currentImages"].push({ id: id, src: src });
        });
      }
      if (product?.data?.id) {
        siteData["onShopify"] = true;
      }
      return siteData;
    });
    setLoading(false);
  };

  const openLinksGetProductId = async () => {
    if (shopifySKURef.current.value !== "") {
      const sku = shopifySKURef.current.value;
      const urls = [
        `https://www.watch.co.uk/watches/?search=${sku.replace(/D(.)$/, "E$1")}`,
        `https://www.houseofwatches.co.uk/catalogsearch/result/?q=${sku.replace(/D(.)$/, "E$1")}`,
        `https://freshpikk.com/catalogsearch/result/?q=${sku}`,
        `https://www.flipkart.com/search?q=${sku}`,
        `https://www.google.com/search?q=${sku}&sxsrf=ALeKk02S-JB8pPtMfCnOUldfDtXI6KadDg:1623764438397&source=lnms&tbm=isch&sa=X&ved=2ahUKEwi5jLL04ZnxAhUChf0HHdmrCF4Q_AUoAXoECAEQAw&biw=1920&bih=920`,
      ];

      for (let i = 0; i < urls.length; i++) {
        window.open(urls[i], "_blank");
      }

      const productId = (await axios(`/api/shopify-product-sku?sku=${sku}`)).data;
      if (productId !== "") {
        shopifyProductRef.current.value = productId;
      }
    }
  };

  const downloadImages = useCallback(async e => {
    e.preventDefault();
    e.stopPropagation();
    console.log(siteData.images);
    /*    await multiDownload(siteData.images, {
      rename: ({ url, index, urls }) =>
        `${shopifySKURef.current.value}-${index}.${url.split(".")[url.split(".").length - 1]}`,
    });*/

    siteData.images.forEach((imgUrl, index) => {
      saveAs(imgUrl, `${shopifySKURef.current.value}-${index}.${imgUrl.split(".")[imgUrl.split(".").length - 1]}`);
    });
  }, [siteData]);

  return (
    <>
      <div className="w-full min-h-screen bg-gradient-to-b from-blueGray-300 to-lightBlue-200">
        <div className="pt-24 pb-12 m-auto max-w-[800px]">
          <h2 className="mb-2 text-2xl font-bold">Enter the product id and watch link.</h2>
          <p className="mb-4 text-sm">
            Currently working with links from:{" "}
            <Link href="https://www.watch.co.uk/">
              <a className="hover:text-blue-500 underline" referrerPolicy="no-referrer" target="_blank">
                www.watch.co.uk
              </a>
            </Link>{" "}
            and{" "}
            <Link href="https://www.houseofwatches.co.uk/">
              <a className="hover:text-blue-500 underline " referrerPolicy="no-referrer" target="_blank">
                www.houseofwatches.co.uk
              </a>
            </Link>
          </p>
          <label className="flex items-center mb-3 ">
            <input
              ref={shopifySKURef}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="py-1 px-1 pl-2 min-w-[200px] h-[42px] text-[12px] leading-relaxed placeholder-opacity-60 bg-white rounded-md border border-gray-400 border-solid shadow-sm "
              defaultValue=""
              placeholder="Product SKU"
              size={1}
              spellCheck="false"
              type="text"
            />
            <span className="flex ml-2 text-sm whitespace-nowrap ">Enter Product SKU</span>
            <button
              className="flex justify-center items-center py-1 px-4 ml-auto min-w-[76px] h-[32px] text-white bg-pink-600 rounded-[4px] hover:opacity-80"
              type="button"
              onClick={openLinksGetProductId}
            >
              Open Links / get Product Id
            </button>
          </label>

          <form onSubmit={handleSubmit}>
            <label className="flex items-center mb-3 ">
              <input
                ref={shopifyProductRef}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className="py-1 px-1 pl-2 min-w-[200px] h-[42px] text-[12px] leading-relaxed placeholder-opacity-60 bg-white rounded-md border border-gray-400 border-solid shadow-sm "
                defaultValue=""
                placeholder="Shopify Product Id"
                size={1}
                spellCheck="false"
                type="text"
              />
              <span className="flex ml-2 text-sm whitespace-nowrap ">
                I.e.: https://broadwayjewellers-co-za.myshopify.com/admin/products/{" "}
                <mark className="highlight">6773422260374</mark>
              </span>
            </label>

            <label className="flex py-1 px-1 pl-2 bg-white rounded-md border border-gray-400 border-solid shadow-sm">
              <input
                ref={urlInput}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className="flex-1 h-[32px] text-[12px] leading-relaxed placeholder-opacity-60"
                defaultValue=""
                placeholder="https://www.watch.co.uk/w1168g2.htm"
                size={1}
                spellCheck="false"
                type="text"
              />
              <button
                className="flex justify-center items-center py-1 px-4 min-w-[76px] h-[32px] text-white bg-pink-600 rounded-[4px] hover:opacity-80"
                type="submit"
              >
                {loading ? <Loading style={{ fontSize: "22px" }} /> : <span>Go</span>}
              </button>
            </label>
          </form>
        </div>
        {siteData.content.length > 0
          ? <>
              <div ref={contentContainerRef} className="hidden py-4 m-auto max-w-[800px]">
                <pre>
                  <div className="fx-tabs" id="fx-tabs">
                    {siteData.content.map(({ title, table }, i) => (
                      <div key={i} className="fx-tab-item">
                        <h3 className="fx-tab-heading" data-tab-index={i}>
                          {title}
                        </h3>
                        <div className="fx-tab-content" data-tab-index={i}>
                          <table>
                            <tbody>
                              {table.map(({ th, td }, j) => (
                                <tr key={j}>
                                  <th>{th}</th>
                                  <td>{td}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </pre>
              </div>
              <div className="flex justify-center mx-auto mb-8 max-w-[800px]">
                <button
                  className="flex justify-center items-center py-1 px-4 min-w-[76px] h-[48px] text-white bg-pink-600 rounded-[4px] hover:opacity-80"
                  type="button"
                  onClick={copyToClipboard}
                >
                  Copy Code <IoCopy className="ml-2" />
                </button>
              </div>
            </>
          : null}
        {siteData.currentImages.length > 0
          ? <>
              <h3 className="mx-auto mb-2 max-w-[780px] text-2xl font-semibold">Current Images on Shopify</h3>
              <div className="grid grid-cols-6 gap-[15px] items-end mx-auto mb-6 max-w-[780px]">
                {siteData.currentImages.map(({ src, id }) => (
                  <div key={src} className="relative">
                    <img alt={src} className="flex w-[137px] h-auto max-h-full" src={src} />
                    <div className="flex absolute top-0 left-0 justify-end items-end w-full h-full opacity-0 hover:opacity-100">
                      <button
                        className="flex justify-center items-center py-1 px-2 mx-auto mr-2 mb-2 text-[12px] text-white whitespace-nowrap bg-pink-600 hover:bg-pink-700 rounded-sm"
                        type="button"
                        onClick={() => removeFromShopify(id)}
                      >
                        {loading ? <Loading style={{ fontSize: "22px" }} /> : <span>Delete</span>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          : null}
        {siteData.images.length > 0
          ? <>
              <div className="flex justify-between mx-auto mb-2 max-w-[780px]">
                <h3 className=" text-2xl font-semibold">Images found on site</h3>
                <button
                  className="flex justify-center items-center py-1 px-4 h-[32px] text-[20px] text-white bg-pink-600 rounded-[4px] hover:opacity-80"
                  onClick={downloadImages}
                >
                  <IoCloudDownloadOutline />
                </button>
              </div>

              <div
                className="grid grid-cols-3 gap-[15px] mx-auto max-w-[780px] "
                style={{ gridTemplateRows: "repeat(auto-fit, minmax(250px, 250px))" }}
              >
                {siteData.images.map((imgUrl, i) => (
                  <div key={`${imgUrl}${i}`} className="relative bg-white">
                    <img className="mx-auto w-auto max-w-full h-auto max-h-full bg" src={imgUrl} />

                    {siteData.onShopify
                      ? <div className="flex absolute top-0 left-0 justify-end items-end w-full h-full opacity-0 hover:opacity-100">
                          <button
                            className="flex justify-center items-center py-1 px-4 mx-auto mr-4 mb-4 h-[32px] text-sm text-white bg-pink-600 hover:bg-pink-700 rounded-[4px]"
                            type="button"
                            onClick={() => addImgToShopify(imgUrl)}
                          >
                            {loading ? <Loading style={{ fontSize: "22px" }} /> : <span>Add to Shopify</span>}
                          </button>
                        </div>
                      : null}
                  </div>
                ))}
              </div>
            </>
          : null}
      </div>
    </>
  );
};

export default Index;
