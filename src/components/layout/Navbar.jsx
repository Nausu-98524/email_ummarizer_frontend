import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineLogout } from "react-icons/md";
import Swal from "sweetalert2";
import { logoutService } from "../../services/authService";

const Navbar = ({ handleClick, sideClose }) => {
  const [heading, setHeading] = useState("");
  const [profileToggle, setProfileToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const fullName = localStorage.getItem("name") || "";
  const role = localStorage.getItem("role") || "";

  const handleLogout = async (e) => {
    e.preventDefault();
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You want to log out.",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setLoader(true);
    try {
      const { data } = await logoutService();

      if (data?.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user-details");
        navigate("/");
      }
    } catch (error) {
      let { data } = error;
      toast.error(data.message);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (location.pathname === "/Dashboard/Dashboard") {
      setHeading("Dashboard");
    }
    if (location.pathname === "/Dashboard/Profile") {
      setHeading("Profile");
    }
  }, [location]);

  return (
    <>
      <header className="antialiased">
        <nav className=" md:px-4 md:py-1 lg:px-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="m-0 flex items-center gap-3 text-xl font-semibold text-zinc-800">
              {sideClose ? (
                <div
                  onClick={handleClick}
                  className="cursor-pointer bg-white shadow-md rounded-full p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                    />
                  </svg>
                </div>
              ) : (
                ""
              )}
              {heading}
            </div>

            <div
              onClick={handleLogout}
              className="bg-red-500 rounded-md text-white font-medium px-4 py-2 hover:shadow-xl hover:bg-red-600 cursor-pointer flex items-center gap-1"
            >
              <MdOutlineLogout size={22} />
              Log Out
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
