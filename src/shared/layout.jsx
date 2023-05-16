import React from "react";
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./sidebar";

const Layout = ({ children }) => {
  return (
    <>
      <div className="flex w-full">
        <Sidebar></Sidebar>
        <div className="w-full">
          <Header className="header move"></Header>
          <main className="child move">{children}</main>
          <Footer className="footer move"></Footer>
        </div>
      </div>
    </>
  );
};

export default Layout;
