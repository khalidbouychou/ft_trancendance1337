import React from "react";

import { SyncLoader } from "react-spinners";

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
      <SyncLoader color="#ffff" loading={loading} height={80} width={8} />
    </div>
  );
};

export default Logout;
