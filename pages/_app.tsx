import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC } from "react";
import "styles/tailwind.css";
import "styles/theme.scss";
// import "tailwindcss/tailwind.css";

const title = "Watch Parser";
const url = "http://localhost:3000/";
const description = "Watch Parser";
const site_name = "Watch Parser";

export const App: FC<AppProps> = ({ pageProps, Component }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <link
          as="font"
          crossOrigin="anonymous"
          href="/fonts/inter-var-latin.woff2"
          rel="preload"
          type="font/woff2"
        />
        <meta content="strict-origin-when-cross-origin" name="referrer" />
        <meta charSet="UTF-8" />
        <link href="/favicon/apple-icon-57x57.png" rel="apple-touch-icon" sizes="57x57" />
        <link href="/favicon/apple-icon-60x60.png" rel="apple-touch-icon" sizes="60x60" />
        <link href="/favicon/apple-icon-72x72.png" rel="apple-touch-icon" sizes="72x72" />
        <link href="/favicon/apple-icon-76x76.png" rel="apple-touch-icon" sizes="76x76" />
        <link href="/favicon/apple-icon-114x114.png" rel="apple-touch-icon" sizes="114x114" />
        <link href="/favicon/apple-icon-120x120.png" rel="apple-touch-icon" sizes="120x120" />
        <link href="/favicon/apple-icon-144x144.png" rel="apple-touch-icon" sizes="144x144" />
        <link href="/favicon/apple-icon-152x152.png" rel="apple-touch-icon" sizes="152x152" />
        <link href="/favicon/apple-icon-180x180.png" rel="apple-touch-icon" sizes="180x180" />
        <link
          href="/favicon/android-icon-192x192.png"
          rel="icon"
          sizes="192x192"
          type="image/png"
        />
        <link href="/favicon/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicon/favicon-96x96.png" rel="icon" sizes="96x96" type="image/png" />
        <link href="/favicon/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
        <link href="/favicon/manifest.json" rel="manifest" />
        <meta content="#ffffff" name="msapplication-TileColor" />
        <meta content="/ms-icon-144x144.png" name="msapplication-TileImage" />
        <meta content="#ffffff" name="theme-color" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <>
        <DefaultSeo
          canonical={`${url}${router.pathname}`}
          description={description}
          openGraph={{
            description,
            images: [
              {
                alt: title,
                height: 630,
                url: "https://www.tellmann.co.za/images/og-default.jpg",
                width: 1200,
              },
            ],
            locale: "en_IE",
            site_name,
            title,
            type: "website",
            url,
          }}
          title={title}
          twitter={{
            cardType: "summary_large_image",
            handle: "@Tellmann",
            site: "@FelixTellmann",
          }}
        />
      </>
      <Component {...pageProps} />
      <style global jsx>{`
        @font-face {
          font-family: "Inter";
          font-style: normal;
          font-weight: 100 900;
          font-display: optional;
          src: url(/fonts/inter-var-latin.woff2) format("woff2");
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
            U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }

        html {
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol", "Noto Color Emoji";
        }
      `}</style>
    </>
  );
};

export default App;
