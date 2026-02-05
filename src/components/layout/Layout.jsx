import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [sideClose, setSideClose] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      setSideClose(true);
    }
  }, []);

  const handleClick = () => {
    setSideClose((prev) => !prev);
  };

  return true ? (
    <>
      <div className="relative h-full min-h-screen w-full bg-[#EEF2F5]">
        <div
          className={`fixed ${
            sideClose ? "-translate-x-80" : ""
          } w-75 z-20 transition-all duration-300 ease-in bg-white h-screen`}
        >
          <Sidebar handleClick={handleClick} sideClose={sideClose} />
        </div>
        <div
          className={`${
            sideClose ? "ms-0" : "md:ms-75"
          } transition-all duration-300 ease-in`}
        >
          <div
            className={`${
              sideClose ? "" : "px-3"
            } p-3 sticky z-10 top-0 w-full bg-white`}
          >
            <Navbar handleClick={handleClick} sideClose={sideClose} />
          </div>
          <div className={` p-5`}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  ) : (
    <Navigate to="/" replace={true} />
  );
};

export default Layout;
