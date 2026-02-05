const BASE_URL = import.meta.env.VITE_API_URL;

//................. Auth Module .................
export const LoginUrl = BASE_URL + "/auth/login";

export const LogoutUrl = BASE_URL + "/auth/logout";

//................. Dashboard Module .................
// export const GetEmailsDetailsURL = (page, limit, search, status) => {
//   return BASE_URL + `/emails/get-all-emails?page=${page}&limit=${limit}&search=${search}&status=${status}`;
// };

export const GetEmailsDetailsURL = (page, limit, search, status, type) => {
  const params = new URLSearchParams();

  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (type) params.append("type", type);

  return `${BASE_URL}/emails/get-all-emails?${params.toString()}`;
};

export const syncEmailsURL = BASE_URL + "/emails/sync-unread-emails";

export const SaveUpdateEmailAsDraftURL = (id) => {
  return BASE_URL + `/emails/saved-as-draft/${id}`;
};

//................. Emailbox Configuration Module .................
export const GetEmailboxConfigurationURL =
  BASE_URL + "/mailbox/get-all-mailboxes";

export const SaveEmailboxConfigurationURL = BASE_URL + "/mailbox/add-mailbox";

export const UpdateEmailboxConfigurationURL = (id) => {
  return BASE_URL + `/mailbox/update-mailbox/${id}`;
};
export const DeleteEmailboxConfigurationURL = (id) => {
  return BASE_URL + `/mailbox/delete-mailbox/${id}`;
};
export const VerifyAppPasswordConfigurationURL =
  BASE_URL + "/mailbox/verify-imap";

export const SendEmailByIdURL = (id) => {
  return BASE_URL + `/emails/send-email-reply/${id}`;
};

export const SendEmailInBulk = BASE_URL + `/emails/send-email-bulk`;

export const GetBulJobProgressByIDURL = (id) => {
  return BASE_URL + `/emails/get-bulk-job-progress/${id}`;
};

export const GenerateAISummaryURL = BASE_URL + `/emails/genrate-ai-summary`;
