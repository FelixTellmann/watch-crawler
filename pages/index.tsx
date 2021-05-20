import axios from "axios";
import { fetchShopify } from "lib/fetch";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Loading from "public/icons/loading.svg";
import { IoCopy } from "react-icons/io5";
const validator = require("validator");

type SiteDataProps = {
  content: { table: { td: string; th: string }[]; title: string }[];
  currentImages: { id: number; src: string }[];
  images: string[];
  onShopify: boolean;
};

export const Index: FC = ({}) => {
  const urlInput = useRef<HTMLInputElement>(null);
  const shopifyProductRef = useRef<HTMLInputElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const [clipboardData, setClipboardData] = useState("");
  const [siteData, setSiteData] = useState<SiteDataProps>({ content: [], images: [], currentImages: [], onShopify: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const url = urlInput.current.value;
    if (!validator.isURL(url) || !/watch\.co\.uk\//gi.test(url)) return;
    const site = await axios(`/api/load-url-data?url=${encodeURI(url)}`);
    const product = await axios(`/api/shopify-product?productId=${shopifyProductRef.current.value}`);

    setSiteData(siteData => {
      site.data["currentImages"] = [];
      site.data["onShopify"] = false;
      if (product?.data?.images?.length > 0) {
        product.data.images.map(({ src, id }) => {
          site.data["currentImages"].push({ src: src, id: id });
        });
      }
      if (product?.data) {
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
          siteData["currentImages"].push({ src: src, id: id });
        });
      }
      if (product?.data) {
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
          siteData["currentImages"].push({ src: src, id: id });
        });
      }
      if (product?.data) {
        siteData["onShopify"] = true;
      }
      return siteData;
    });
    setLoading(false);
  };

  return (
    <>
      <div className="w-screen min-h-screen bg-gradient-to-b from-blueGray-300 to-lightBlue-200">
        <div className="pt-24 pb-12 m-auto max-w-[800px] select-none">
          <h2 className="mb-1 text-2xl font-bold">Enter the www.watch.co.uk link.</h2>
          <p className="mb-4">
            <Link href="https://www.watch.co.uk/guess-surge-black-gents-quartz-chronograph-with-date-w1168g2.htm">
              <a className="hover:text-blue-500 underline ">Example. </a>
            </Link>
          </p>
          <label className="flex items-center mb-3 ">
            <input
              ref={shopifyProductRef}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="py-1 px-1 pl-2 min-w-[200px] h-[42px] text-[12px] leading-relaxed placeholder-opacity-60 bg-white rounded-md border border-gray-400 border-solid shadow-sm "
              defaultValue="6773422260374"
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
          <form onSubmit={handleSubmit}>
            <label className="flex py-1 px-1 pl-2 bg-white rounded-md border border-gray-400 border-solid shadow-sm">
              <input
                ref={urlInput}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className="flex-1 h-[32px] text-[12px] leading-relaxed placeholder-opacity-60"
                defaultValue="https://www.watch.co.uk/guess-commander-stainless-steel-watch-with-day-date-dials-gw0056g5.htm"
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
        {siteData.content.length > 0 ? (
          <>
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
            <div className="flex justify-center mx-auto max-w-[800px]">
              <button
                className="flex justify-center items-center py-1 px-4 min-w-[76px] h-[48px] text-white bg-pink-600 rounded-[4px] hover:opacity-80"
                type="button"
                onClick={copyToClipboard}
              >
                Copy Code <IoCopy className="ml-2" />
              </button>
            </div>
          </>
        ) : null}
        {siteData.currentImages.length > 0 ? (
          <>
            <p className="mx-auto max-w-[800px]">Current Images on Shopify</p>
            <div className="grid grid-cols-6 gap-[15px] items-end p-4 mx-auto max-w-[930px]">
              {siteData.currentImages.map(({ src, id }) => (
                <div key={src} className="relative">
                  <img className="flex w-[137px] h-auto max-h-full" src={src} />
                  <div className="flex absolute top-0 left-0 justify-end items-end w-full h-full opacity-0 hover:opacity-100">
                    <button
                      className="flex justify-center items-center py-1 px-4 mx-auto mr-4 mb-4 h-[32px] text-sm text-white whitespace-nowrap bg-pink-600 hover:bg-pink-700 rounded-[4px]"
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
        ) : null}
        {siteData.images.length > 0 ? (
          <>
            <p className="mx-auto max-w-[800px]">Images found on site</p>
            <div className="grid grid-cols-3 gap-[15px] p-4 mx-auto max-w-[930px]">
              {siteData.images.map(imgUrl => (
                <div key={imgUrl} className="relative">
                  <img className="w-full h-auto max-h-full" src={imgUrl} />

                  {siteData.onShopify ? (
                    <div className="flex absolute top-0 left-0 justify-end items-end w-full h-full opacity-0 hover:opacity-100">
                      <button
                        className="flex justify-center items-center py-1 px-4 mx-auto mr-4 mb-4 h-[32px] text-sm text-white bg-pink-600 hover:bg-pink-700 rounded-[4px]"
                        type="button"
                        onClick={() => addImgToShopify(imgUrl)}
                      >
                        {loading ? <Loading style={{ fontSize: "22px" }} /> : <span>Add to Shopify</span>}
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Index;
