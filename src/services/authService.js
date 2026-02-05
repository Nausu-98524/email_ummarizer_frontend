import { ApiCall } from "../utils/ApiCall";
import { LoginUrl, LogoutUrl } from "../utils/endpoint";
import { HTTP_METHOD } from "../utils/HttpMethods";


// ..........Login Service............
export const loginService = async (data) => {
  return ApiCall(HTTP_METHOD.POST, LoginUrl, data, false, false);
};

// ..........logout Service............
export const logoutService = async (data) => {
  return ApiCall(HTTP_METHOD.POST, LogoutUrl, data, false, true);
};