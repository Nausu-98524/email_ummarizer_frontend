import { ApiCall } from "../utils/ApiCall";
import {
  DeleteEmailboxConfigurationURL,
  GetEmailboxConfigurationURL,
  SaveEmailboxConfigurationURL,
  UpdateEmailboxConfigurationURL,
  VerifyAppPasswordConfigurationURL,
} from "../utils/EndPoints";
import { HTTP_METHOD } from "../utils/HttpMethods";

// ..........Mail Box Service............
export const getMailBoxService = async () => {
  return ApiCall(HTTP_METHOD.GET, GetEmailboxConfigurationURL, {}, false, true);
};

export const saveMailBoxService = async (data) => {
  return ApiCall(
    HTTP_METHOD.POST,
    SaveEmailboxConfigurationURL,
    data,
    false,
    true,
  );
};
export const updateMailBoxService = async (id, data) => {
  return ApiCall(
    HTTP_METHOD.PATCH,
    UpdateEmailboxConfigurationURL(id),
    data,
    false,
    true,
  );
};
export const deleteMailBoxService = async (id, data) => {
  return ApiCall(
    HTTP_METHOD.DELETE,
    DeleteEmailboxConfigurationURL(id),
    data,
    false,
    true,
  );
};

export const verifyEmailAppPAssword = async (data) => {
  return ApiCall(
    HTTP_METHOD.POST,
    VerifyAppPasswordConfigurationURL,
    data,
    false,
    true,
  );
};
