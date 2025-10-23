import React, { Suspense } from "react";
import VerifyComponent from "./verify-component";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyComponent />
    </Suspense>
  );
};

export default page;
