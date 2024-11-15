import React from "react";

import { GridLoader } from "react-spinners";

const Logout = loading => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}
    >
      <GridLoader color="green" loading={loading} size={20} />
    </div>
  );
};

export default Logout;
