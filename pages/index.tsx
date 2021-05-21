import axios from "axios";
import Link from "next/link";
import Loading from "public/icons/loading.svg";
import { FC, useEffect, useRef, useState } from "react";
import { IoCopy } from "react-icons/io5";
import validator from "validator";

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
          site.data["currentImages"].push({ src: src, id: id });
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
          siteData["currentImages"].push({ src: src, id: id });
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
          siteData["currentImages"].push({ src: src, id: id });
        });
      }
      if (product?.data?.id) {
        siteData["onShopify"] = true;
      }
      return siteData;
    });
    setLoading(false);
  };

  return (
    <>
      <div className="w-screen min-h-screen bg-gradient-to-b from-blueGray-300 to-lightBlue-200">
        <div className="pt-24 pb-12 m-auto max-w-[800px]">
          <h2 className="mb-2 text-2xl font-bold">Enter the product id and watch link.</h2>
          <p className="mb-4 text-sm">
            Currently working with links from:{" "}
            <Link href="https://www.watch.co.uk/">
              <a className="hover:text-blue-500 underline ">www.watch.co.uk</a>
            </Link>{" "}
            and{" "}
            <Link href="https://www.houseofwatches.co.uk/">
              <a className="hover:text-blue-500 underline ">www.houseofwatches.co.uk</a>
            </Link>
          </p>
          <label className="flex items-center mb-3 ">
            <input
              ref={shopifyProductRef}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="py-1 px-1 pl-2 leading-relaxed placeholder-opacity-60 bg-white rounded-md border border-gray-400 border-solid shadow-sm min-w-[200px] h-[42px] text-[12px] "
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
          <form onSubmit={handleSubmit}>
            <label className="flex py-1 px-1 pl-2 bg-white rounded-md border border-gray-400 border-solid shadow-sm">
              <input
                ref={urlInput}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className="flex-1 leading-relaxed placeholder-opacity-60 h-[32px] text-[12px]"
                defaultValue=""
                placeholder="https://www.watch.co.uk/w1168g2.htm"
                size={1}
                spellCheck="false"
                type="text"
              />
              <button
                className="flex justify-center items-center py-1 px-4 text-white bg-pink-600 hover:opacity-80 min-w-[76px] h-[32px] rounded-[4px]"
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
            <div className="flex justify-center mx-auto mb-8 max-w-[800px]">
              <button
                className="flex justify-center items-center py-1 px-4 text-white bg-pink-600 hover:opacity-80 min-w-[76px] h-[48px] rounded-[4px]"
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
            <h3 className="mx-auto mb-2 text-2xl font-semibold max-w-[780px]">Current Images on Shopify</h3>
            <div className="grid grid-cols-6 items-end mx-auto mb-6 gap-[15px] max-w-[780px]">
              {siteData.currentImages.map(({ src, id }) => (
                <div key={src} className="relative">
                  <img alt={src} className="flex h-auto max-h-full w-[137px]" src={src} />
                  <div className="flex absolute top-0 left-0 justify-end items-end w-full h-full opacity-0 hover:opacity-100">
                    <button
                      className="flex justify-center items-center py-1 px-2 mx-auto mr-2 mb-2 text-white whitespace-nowrap bg-pink-600 hover:bg-pink-700 rounded-sm text-[12px]"
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
            <h3 className="mx-auto mb-2 text-2xl font-semibold max-w-[780px]">Images found on site</h3>
            <div
              className="grid grid-cols-3 mx-auto gap-[15px] max-w-[780px] "
              style={{ gridTemplateRows: "repeat(auto-fit, minmax(250px, 250px))" }}
            >
              {siteData.images.map(imgUrl => (
                <div key={imgUrl} className="relative bg-white">
                  <img className="mx-auto w-auto max-w-full h-auto max-h-full bg" src={imgUrl} />

                  {siteData.onShopify ? (
                    <div className="flex absolute top-0 left-0 justify-end items-end w-full h-full opacity-0 hover:opacity-100">
                      <button
                        className="flex justify-center items-center py-1 px-4 mx-auto mr-4 mb-4 text-sm text-white bg-pink-600 hover:bg-pink-700 h-[32px] rounded-[4px]"
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
