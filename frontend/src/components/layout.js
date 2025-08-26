import React from "react";
import Header from "./header";

function Layout({ children }) {
  return (
    <div>
      <Header />
      <div style={{ padding: "20px" }}>
        {children}
      </div>
    </div>
  );
}

export default Layout;
