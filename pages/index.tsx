import { FC } from "react";
import NextLink from "next/link";

type IndexProps = {};

export const Index: FC<IndexProps> = ({}) => {
  return (
    <>
      Welcome. you are in.
      <NextLink href="/app">
        <a>Home</a>
      </NextLink>
    </>
  );
};

export default Index;
