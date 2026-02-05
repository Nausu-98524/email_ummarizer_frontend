import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

import Button from "../components/ui/Button";
import Modal from "../components/common/Modal";
import Input from "../components/ui/Inputbox";
import { setFocus } from "../components/common/common";
import {
  deleteMailBoxService,
  getMailBoxService,
  saveMailBoxService,
  updateMailBoxService,
  verifyEmailAppPAssword,
} from "../services/mailboxConfigurationService";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const MailboxConfiguration = () => {
  const [formData, setFormData] = useState({
    id: "",
    nickName: "",
    emailId: "",
    appPassword: "",
    isVerified: false,
    isActive: false,
  });
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [responseError, setResponseError] = useState("");

  const [mailboxConfigDetails, setMailboxConfigDetails] = useState(null);
  const [error, setError] = useState({});
  const [mode, setMode] = useState("add");

  const validateForm = (mode = "add") => {
    const errors = {};
    if (!formData.nickName.trim()) errors.nickName = "Nick name is required";
    if (!formData.emailId) errors.emailId = "EmailId is required";
    if (mode === "add" && !formData.appPassword)
      errors.appPassword = "App password is required";
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReset = () => {
    setFormData({
      nickName: "",
      emailId: "",
      appPassword: "",
      isActive: false,
    });
    setResponseError("");
  };

  const GetAllMailbox = async () => {
    try {
      setLoading(true);
      const { data } = await getMailBoxService();

      if (data?.success) {
        setMailboxConfigDetails(data);
      }
    } catch (error) {
      let { data } = error;
      toast.error(data.message);
      setMailboxConfigDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAppPassword = async () => {
    if (!validateForm()) return;
    try {
      setVerifyLoading(true);
      const { data } = await verifyEmailAppPAssword(formData);
      if (data?.success) {
        setFormData({ ...formData, isVerified: true });
        setResponseError("");
      }
    } catch (error) {
      let { data } = error;
      setResponseError(data.message);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!formData.isVerified) {
      toast.error("Please verify app Password first!");
      return;
    }

    try {
      setSaveLoading(true);
      const { data } = await saveMailBoxService(formData);

      if (data?.success) {
        toast.success(data.message);
        setIsOpenModal(false);
        GetAllMailbox();
      }
    } catch (error) {
      let { data } = error;
      toast.error(data.message);
    } finally {
      setSaveLoading(false);
    }
    // Implement save logic here
  };

  const handleEdit = async (data) => {
    setMode("edit");
    setFormData(() => ({
      ...formData,
      id: data._id,
      nickName: data.nickName,
      emailId: data.emailId,
      appPassword: data.appPassword,
      isActive: data.isActive,
    }));
    setIsOpenModal(true);
  };

  const handleUpdate = async () => {
    if (!validateForm("edit")) return;
    try {
      setSaveLoading(true);
      const { data } = await updateMailBoxService(formData.id, formData);

      if (data?.success) {
        toast.success(data.message);
        setIsOpenModal(false);
        GetAllMailbox();
      }
    } catch (error) {
      let { data } = error;
      toast.error(data.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setSaveLoading(true);

      const { data } = await deleteMailBoxService(id);

      if (data?.success) {
        toast.success(data.message);
        GetAllMailbox();
      }
    } catch (error) {
      const { data } = error.response || {};
      toast.error(data?.message || "Something went wrong");
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    GetAllMailbox();
  }, []);

  useEffect(() => {
    if (isOpenModal) {
      setFocus("nickName");
    } else {
      handleReset();
    }
  }, [isOpenModal]);
  return (
    <>
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold">Mailbox Configuration</h1>
          <p className="text-sm mt-1 text-gray-600">
            Add multiple emails and manage emails
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            text="Refresh"
            onClick={GetAllMailbox}
            defaultIcon="Refresh"
            variant="refresh"
          />
          <div className="w-fit">
            <Button
              text="Add Mailbox"
              onClick={() => {
                setMode("add");
                setIsOpenModal(true);
              }}
              defaultIcon="Add"
              variant="primary"
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="mailbox-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="mailbox-card flex flex-col justify-between p-4 border rounded-lg animate-pulse">
                {/* Top Section */}
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-6 w-40 bg-gray-200 rounded"></div>
                    <div className="h-4 w-52 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                </div>

                {/* App Password Section */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                </div>

                {/* Bottom Section */}
                <div className="flex items-center justify-between mt-4">
                  <div className="h-6 w-28 bg-gray-200 rounded-full"></div>

                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mailbox-grid">
            {mailboxConfigDetails !== null &&
              mailboxConfigDetails?.mailboxes?.map((mailconfig, index) => (
                <div
                  key={index}
                  className="mailbox-card flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-semibold">
                        {mailconfig?.nickName || ""}
                      </div>
                      <div className=" mt-1 text-sm text-black/80">
                        {mailconfig?.emailId || ""}
                      </div>
                    </div>
                    <span
                      className={`text-sm 
                  ${
                    mailconfig?.isActive
                      ? "bg-green-100 text-green-600 "
                      : "bg-red-100 text-red-600  "
                  }
                    px-4 py-1 rounded-full`}
                    >
                      {mailconfig?.isActive ? "Active" : "In-Active"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="text-sm flex items-center">
                      <span className="pe-2 text-black font-semibold">
                        App Password
                      </span>{" "}
                      :{" "}
                      <span className="text-black/60 ps-2">
                        {mailconfig?.appPassword || ""}
                      </span>
                    </div>
                    <div>
                      {/* <FaRegEye
                      className="text-black cursor-pointer"
                      size={16}
                      title="view"
                    /> */}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {mailconfig.isVerified ? (
                      <div className="text-sm flex items-center gap-1 bg-green-100 text-green-500 px-3 py-1 rounded-full cursor-pointer">
                        <RiVerifiedBadgeFill size={16} /> Verified
                      </div>
                    ) : (
                      <div className="text-sm flex items-center gap-1 bg-yellow-100 text-yellow-500 px-3 py-1 rounded-full cursor-pointer">
                        <MdErrorOutline size={16} /> verify Pending
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleEdit(mailconfig)}
                        className="text-sm flex items-center gap-1 bg-blue-100 text-blue-600 hover:bg-blue-200 px-2 py-1 rounded-md cursor-pointer"
                      >
                        <FiEdit size={16} title="Edit" />
                      </button>

                      <button
                        onClick={(e) => handleDelete(e, mailconfig._id)}
                        className="text-sm flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded-md cursor-pointer"
                      >
                        <RiDeleteBin6Line size={16} title="Delete" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            <div
              className="mailbox-card border-dashed border-2 border-gray-300 flex items-center justify-center min-h-50 cursor-pointer"
              onClick={() => {
                setMode("add");
                setIsOpenModal(true);
              }}
            >
              <div className="text-center text-gray-600">
                <div className="text-3xl mb-2">➕</div>
                <div className="font-semibold">Add New Mailbox</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ...........Modal.............. */}
      <Modal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        title="Mailbox Configuration"
        subTitle="Add mailbox details here"
        size="xl"
      >
        {responseError && (
          <div className="flex items-center justify-center bg-red-100 text-red-500 text-sm p-2 mb-4 rounded-md">
            {responseError}
          </div>
        )}

        <div className=" flex items-center gap-4 mb-4">
          <div className="flex-1">
            <Input
              id="nickName"
              type="text"
              label="Nickname"
              placeholder="Enter a Nickname "
              required={true}
              value={formData.nickName}
              errors={error.nickName}
              disabled={loading}
              onChange={(e) => {
                setFormData({ ...formData, nickName: e.target.value });
                setError({ ...error, nickName: "" });
              }}
            />
          </div>

          <div className="flex-1">
            <Input
              id="txtEmailId"
              type="email"
              label="Email Address"
              placeholder="Enter your email address"
              required={true}
              value={formData.emailId}
              errors={error.emailId}
              disabled={loading}
              onChange={(e) => {
                setFormData({ ...formData, emailId: e.target.value });
                setError({ ...error, emailId: "" });
              }}
            />
          </div>
        </div>
        <div className=" flex items-center gap-4 mb-4">
          <div className="flex-1">
            <Input
              id="txtAppPassword"
              label="App Password"
              placeholder="Enter App Password"
              required={true}
              value={formData.appPassword}
              errors={error.appPassword}
              disabled={loading || mode === "edit"}
              onChange={(e) => {
                setFormData({ ...formData, appPassword: e.target.value });
                setError({ ...error, appPassword: "" });
              }}
              rightLabel={
                <div
                  onClick={() => {
                    if (mode === "add") {
                      handleVerifyAppPassword();
                    }
                  }}
                  className={`flex items-center gap-1 px-2 text-xs rounded-full
                  ${
                    formData.isVerified
                      ? "bg-green-100 text-green-500 hover:text-green-600"
                      : "bg-yellow-100 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-200 cursor-pointer"
                  }
                 `}
                >
                  {verifyLoading ? (
                    <div>loading...</div>
                  ) : (
                    <>
                      {formData.isVerified ? (
                        <>
                          {" "}
                          <RiVerifiedBadgeFill size={12} /> Verified{" "}
                        </>
                      ) : (
                        <>
                          {" "}
                          <MdErrorOutline size={12} /> Verify Now
                        </>
                      )}
                    </>
                  )}
                </div>
              }
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm mb-1 font-semibold text-[#222325]">
              Is Active
            </label>
            <div className="relative inline-block w-11 h-5">
              <input
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                id="isActive"
                type="checkbox"
                className="peer appearance-none w-11 h-5 bg-slate-100 border border-gray-200 rounded-full checked:bg-blue-600 cursor-pointer transition-colors duration-300 outline-none focus:ring-1 focus:ring-blue-500"
              />
              <label
                htmlFor="isActive"
                className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-blue-600 cursor-pointer"
              ></label>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-fit mt-6">
          <Button
            text={mode === "add" ? "Save" : "Update"}
            loading={saveLoading}
            disabled={saveLoading}
            variant="green"
            defaultIcon="Add"
            onClick={mode === "add" ? handleSave : handleUpdate}
          />

          <Button
            text="Clear"
            variant="refresh"
            defaultIcon="Refresh"
            disabled={saveLoading}
            onClick={handleReset}
          />
          <Button
            text="cancel"
            variant="danger"
            disabled={saveLoading}
            onClick={() => setIsOpenModal(false)}
          />
        </div>
      </Modal>
    </>
  );
};

export default MailboxConfiguration;
