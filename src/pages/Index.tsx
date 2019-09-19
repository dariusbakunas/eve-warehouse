import React from "react";
import Link from "next/link";

const Index = () => {
  return (
    <React.Fragment>
      <h1>Index</h1>
      <Link href="/home">
        <a>Home</a>
      </Link>
    </React.Fragment>
  );
};

export default Index;
