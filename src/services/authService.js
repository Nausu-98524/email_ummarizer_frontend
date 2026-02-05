import { ApiCall } from "../utils/ApiCall";
import { LoginUrl, LogoutUrl } from "../utils/EndPoints";
import { HTTP_METHOD } from "../utils/HttpMethods";

// ..........Login Service............
export const LoginService = async (data) => {
  return ApiCall(HTTP_METHOD.POST, LoginUrl, data, false, false);
};

export const LoginServiceNew = async (data) => {
  return ApiCall(HTTP_METHOD.POST, LoginUrl, data, false, false);
};

// ..........logout Service............
export const logoutService = async (data) => {
  return ApiCall(HTTP_METHOD.POST, LogoutUrl, data, false, true);
};
