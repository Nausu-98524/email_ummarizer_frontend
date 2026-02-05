import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { setFocus } from "../components/common/common";
import { loginService } from "../services/AuthService";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    emailID: "",
    password: "",
  });
  const [togglePassword, setTogglePassword] = useState(false);
  const [loginLoader, setloginLoader] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    let payload = {
      email: formData.emailID,
      password: formData.password,
    };
    try {
      setloginLoader(true);
      const { data } = await loginService(payload);

      if (data?.success) {
        localStorage.setItem("token", data?.token || "");
        localStorage.setItem("user-details", JSON.stringify(data?.user));
        navigate("/EmailDashboard");
      }
    } catch (error) {
      let { data } = error;
      toast.error(data.message);
      setFocus("txtEmailId");
    } finally {
      setloginLoader(false);
    }
  };

  useEffect(() => {
    document.title = "Login";
    setFocus("txtEmailId");
  }, []);
  return (
    <>
      <div className="h-screen w-full overflow-hidden">
        <div className="flex-3 flex items-center justify-center h-screen">
          <div className="px-10 py-6 bg-white w-fit text-center rounded-2xl md:w-1/3 md:px-10 md:py-20">
            <div className="text-center text-2xl font-bold text-black">
              Login in to your account
            </div>
            <div className="text-center text-lg font-normal text-black">
              Welcome Back!
            </div>
            <div className="mt-10">
              {/* --------user input-------------- */}
              <div className="relative mx-auto mb-4">
                <input
                  type="text"
                  className="w-full rounded-lg border border-transparent bg-blue-50 py-2 pe-2 ps-10 focus:border-blue-500 focus:outline-none"
                  placeholder="Email ID"
                  id="txtEmailId"
                  value={formData.emailID}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      emailID: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setFocus("txtPassword");
                    }
                  }}
                />
                <div className="-translate-y-2/4 absolute left-3 top-2/4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 stroke-blue-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </div>
              </div>
              {/* ----------password input------------------ */}
              <div className="relative mx-auto mb-4">
                <input
                  type={togglePassword ? "text" : "password"}
                  className="w-full rounded-lg border border-transparent bg-blue-50 py-2 pe-2 ps-10 focus:border-blue-500 focus:outline-none"
                  placeholder="Password"
                  id="txtPassword"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setFocus("login_btn");
                    }
                  }}
                />
                <div className="-translate-y-2/4 absolute left-3 top-2/4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 stroke-blue-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                </div>

                <div
                  onClick={() => setTogglePassword(!togglePassword)}
                  className="-translate-y-2/4 absolute right-3 top-2/4 cursor-pointer"
                >
                  {togglePassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </div>
              </div>
              {/* ------------submit button---------------- */}
              {/* text-white bg-gradient-to-r from-blue-950 via-purple-900 to-orange-500 */}
              <div className="relative mx-auto my-4">
                <button
                  id="login_btn"
                  onClick={(e) => handleLogin(e)}
                  disabled={loginLoader}
                  className={`block ${
                    loginLoader ? "cursor-not-allowed" : "cursor-pointer"
                  } w-full rounded-md bg-blue-500 px-4 py-2 text-lg font-semibold text-white shadow-lg transition-all ease-in hover:shadow-none hover:-translate-y-1`}
                >
                  {loginLoader ? "Loading..." : "Login"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
