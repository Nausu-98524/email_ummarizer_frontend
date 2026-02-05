import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { RiMailAddLine } from "react-icons/ri";
import { LiaMailBulkSolid } from "react-icons/lia";


const Roles = {
  ADMIN: "admin",
};
let response = {
  getMenu: [
    {
      cssClass: "fa fa-gears",
      menuText: "Email Dashboard",
      folderName: "EmailDashboard",
      icon: LuLayoutDashboard,
      access: [Roles.ADMIN],
    },
    {
      menuText: "Mailbox Configuration",
      folderName: "MailboxConfiguration",
      icon: RiMailAddLine,
      access: [Roles.ADMIN],
    },
    {
      menuText: "Bulk Send",
      folderName: "BulkEmailManagement",
      icon: LiaMailBulkSolid,
      access: [Roles.ADMIN],
    },
  ],
};

const Sidebar = ({ handleClick, sideClose }) => {
  const [dropdown, setDropdown] = useState();
  const [menuData, setMenuData] = useState(response.getMenu);
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "";

  const pathSegments = location.pathname.split("/");
  const lastUrlValue = pathSegments[pathSegments.length - 1];

  useEffect(() => {
    setDropdown(lastUrlValue);
  }, [location]);

  return (
    <div>
      <div className="relative flex items-center gap-3 px-3 py-3 after:absolute after:w-full after:h-0.5 after:bg-linear-to-r after:from-white after:white after:to-white after:right-0 after:bottom-0">
        <div className="flex justify-start items-center w-full gap-2 mt-4 ms-1">
          <div className="h-8 w-8  rounded-full flex justify-center items-center">
            <img
              src="/images/email-logo.png"
              alt="Email Logo"
              className="h-8 w-20"
            />
          </div>
          {!sideClose && (
            <div className="text-2xl font-bold  text-black text-center">
              E-Summarize
            </div>
          )}
        </div>
        {!sideClose ? (
          <div
            className="absolute -right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-md"
            onClick={handleClick}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-4 stroke-black"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="h-px bg-[#eef2f5]"></div>

      {/* -------------side links------------------- */}

      <ul className="mx-3 mt-6">
        {menuData?.map((menuData, index) => (
          <li key={index} className="mb-3">
            <div
              onClick={() => {
                if (dropdown === menuData?.folderName) {
                  setDropdown(null);
                } else {
                  setDropdown(menuData?.folderName);
                }
                navigate(`/${menuData?.folderName}`);
              }}
              className={`py-2.25 px-4 ${dropdown === menuData?.folderName ? "bg-blue-600 text-white" : "bg-[#EEF2F5]"} w-full text-black/70 flex items-center rounded-lg cursor-pointer justify-between gap-2`}
            >
              <div className={`flex items-center gap-3 text-sm font-medium`}>
                <div className="">
                  {menuData.icon && <menuData.icon size={22} />}
                </div>
                {menuData?.menuText}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
