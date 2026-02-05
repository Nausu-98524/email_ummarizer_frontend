import axios from "axios";
import { HTTP_METHOD } from "./HttpMethods";

export const getRequestHeader = async (
  isFormData = false,
  isAuthTokenRequired = true,
  apiKey,
) => {
  const authToken =
    typeof window !== "undefined" ? window.localStorage.getItem("token") : null;

  const headers = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  } else if (isAuthTokenRequired && authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  return { headers };
};

export const onError = (error) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error;
    const responseData = axiosError?.response?.data || null;

    console.log(responseData, "testttttttttttttt");

    if (responseData.message === "Token Expires") {
      if (typeof window !== "undefined") {
        localStorage.clear();
        location.href = "/login";
      }
    }
    return Promise.reject(axiosError.response ?? axiosError);
  }

  return Promise.reject(error);
};

export const ApiCall = async (
  method,
  url,
  requestData = {},
  isFormData = false,
  isAuthTokenRequired = true,
  apiKey,
) => {
  try {
    const config = await getRequestHeader(
      isFormData,
      isAuthTokenRequired,
      apiKey,
    );

    let payload = requestData;

    if (isFormData) {
      if (requestData instanceof FormData) {
        payload = requestData;
      } else {
        const formData = new FormData();
        if (requestData && typeof requestData === "object") {
          Object.keys(requestData).forEach((key) => {
            const value = requestData[key];
            if (value !== null && value !== undefined) {
              formData.append(key, String(value));
            }
          });
        }
        payload = formData;
      }
    }

    switch (method) {
      case HTTP_METHOD.GET:
        return await axios.get(url, config);

      case HTTP_METHOD.POST:
        return await axios.post(url, payload, config);

      case HTTP_METHOD.PUT:
        return await axios.put(url, payload, config);

      case HTTP_METHOD.PATCH:
        return await axios.patch(url, payload, config);

      case HTTP_METHOD.DELETE:
        return await axios.delete(url, {
          ...config,
          data: payload,
        });

      default:
        throw new Error("Unimplemented HTTP Method requested");
    }
  } catch (error) {
    return onError(error);
  }
};
