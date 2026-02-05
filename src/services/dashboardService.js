import { ApiCall } from "../utils/ApiCall";
import {
  GenerateAISummaryURL,
  GetBulJobProgressByIDURL,
  GetEmailsDetailsURL,
  SaveUpdateEmailAsDraftURL,
  SendEmailByIdURL,
  SendEmailInBulk,
  syncEmailsURL,
} from "../utils/endpoint";
import { HTTP_METHOD } from "../utils/HttpMethods";

// ..........Get E-Mails Details............
export const getEmailDetailsService = async (
  page = 1,
  limit = 20,
  search = "",
  status = "",
  type = ""
) => {
  return ApiCall(
    HTTP_METHOD.GET,
    GetEmailsDetailsURL(page, limit, search, status, type),
    {},
    false,
    true,
  );
};

export const syncEmailsService = async (data) => {
  return ApiCall(HTTP_METHOD.POST, syncEmailsURL, data, false, true);
};

export const saveUpdateEmailsDraftService = async (id, data) => {
  return ApiCall(
    HTTP_METHOD.PUT,
    SaveUpdateEmailAsDraftURL(id),
    data,
    false,
    true,
  );
};

export const sendEmailsByIdService = async (id, data) => {
  return ApiCall(HTTP_METHOD.POST, SendEmailByIdURL(id), data, false, true);
};

export const sendEmailInBulk = async (data) => {
  return ApiCall(HTTP_METHOD.POST, SendEmailInBulk, data, false, true);
};

export const getBulkJobProgress = async (id) => {
  return ApiCall(HTTP_METHOD.GET, GetBulJobProgressByIDURL(id), {}, false, true);
};

export const generateAiSummary = async (data) => {
  return ApiCall(HTTP_METHOD.POST, GenerateAISummaryURL, data, false, true);
};

// export const updateMailBoxService = async (id, data) => {
//   return ApiCall(
//     HTTP_METHOD.PATCH,
//     UpdateEmailboxConfigurationURL(id),
//     data,
//     false,
//     true,
//   );
// };
// export const deleteMailBoxService = async (id, data) => {
//   return ApiCall(
//     HTTP_METHOD.DELETE,
//     DeleteEmailboxConfigurationURL(id),
//     data,
//     false,
//     true,
//   );
// };

// export const verifyEmailAppPAssword = async (data) => {
//   return ApiCall(
//     HTTP_METHOD.POST,
//     VerifyAppPasswordConfigurationURL,
//     data,
//     false,
//     true,
//   );
// };
