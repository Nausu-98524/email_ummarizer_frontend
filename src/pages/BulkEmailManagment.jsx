import { useEffect, useState } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import { SiTicktick } from "react-icons/si";
import { RiDraftLine } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import Button from "../components/ui/Button";
import {
  getEmailDetailsService,
  sendEmailInBulk,
  syncEmailsService,
} from "../services/dashboardService";
import toast from "react-hot-toast";
import { Pagination } from "@mui/material";
import CommonLoader from "../components/common/CommonLoader";
import Swal from "sweetalert2";
import RichTextEditor from "../components/responseEditor/RichTextEditor";
import BulkSendProgressModal from "../components/common/BulkSendProgressModal";

const styles = {
  Unread: "bg-blue-100 text-blue-600",
  DraftSaved: "bg-yellow-100 text-yellow-600",
  ReadResponded: "bg-green-100 text-green-600",
};

const BulkEmailManagment = () => {
  const [loading, setLoading] = useState(false);
  const [syncEmailLoader, setSyncEmailLoader] = useState(false);
  const [mailDetails, setMailDetails] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  // .............Pagination Start...............
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // .............Pagination End...............

  //BULK MANAGMENT TEXT EDITOR
  const [responseBody, setResponseBody] = useState("");

  // Bulksend progress
  const [starting, setStarting] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [openProgressModal, setOpenProgressModal] = useState(false);
  const [error, setError] = useState("");

  const handleRefresh = () => {
    setCurrentPageNo(1);
    setPageSize(10);
    setSearch("");
    setStatusFilter("");
    setSelectedIds([]);
    GetAllMailDeatils(1, 10, "", "");
  };

  const handleAllCheck = (e) => {
    if (e.target.checked) {
      // select all
      const allIds =
        mailDetails && mailDetails?.emails?.map((item) => item._id);
      setSelectedIds(allIds);
    } else {
      // unselect all
      setSelectedIds([]);
    }
  };

  const handleRowCheck = (e, row_id) => {
    if (e.target.checked) {
      setSelectedIds((prev) => [...prev, row_id]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== row_id));
    }
  };

  const handleSendBulkEmails = async () => {
    if (selectedIds?.length === 0) {
      await Swal.fire({
        title: "ERROR",
        text: "Please select emails first!",
        icon: "error",
      });
      return;
    }

    try {
      setError("");
      setStarting(true);

      let payload = {
        emailIds: selectedIds,
        responseBody: responseBody,
      };

      const { data } = await sendEmailInBulk(payload);

      setJobId(data.jobId);
      setOpenProgressModal(true);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to start bulk send");
    } finally {
      setStarting(false);
    }
  };

  const GetAllMailDeatils = async (page, limit, serach, statusFilter) => {
    let type = "execptRead";
    try {
      setLoading(true);
      const { data } = await getEmailDetailsService(
        page,
        limit,
        serach,
        statusFilter,
        type,
      );
      if (data?.success) {
        setMailDetails(data);
      }
    } catch (error) {
      console.log(error, "yusdfty");
      let { data } = error;
      toast?.error(data?.message || error?.data?.message);
      setMailDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSynEmails = async () => {
    try {
      setSyncEmailLoader(true);
      const { data } = await syncEmailsService();

      if (data?.success) {
        toast.success(data?.message);
        setSyncEmailLoader(false);
        GetAllMailDeatils(currentPageNo, pageSize);
      }
    } catch (error) {
      let { data } = error;
      toast.error(data.message);
    } finally {
      setSyncEmailLoader(false);
    }
  };

  useEffect(() => {
    GetAllMailDeatils(currentPageNo, pageSize);
  }, [currentPageNo, pageSize]);

  return (
    <>
      {/* ....................HEADER SECTION................. */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold text-black/80">Bulk Send</h1>
          <p className="text-sm mt-1 text-gray-600">
            Manage and respond to emails in bulk
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSendBulkEmails}
            disabled={starting || !selectedIds?.length}
            defaultIcon="send"
            text={
              starting ? "Starting..." : `Bulk Send (${selectedIds?.length})`
            }
            variant="green"
          />
          <Button
            onClick={handleRefresh}
            text="Refresh"
            defaultIcon="Refresh"
            variant="refresh"
          />
          <div className="w-fit">
            <Button
              onClick={handleSynEmails}
              text="Sync Mails"
              defaultIcon="mail"
              variant="primary"
            />
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-md bg-red-50 p-2 my-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {/* ....................RICH EDITOR SECTION................. */}
      <div className="mt-4 shadow-sm rounded-md">
        <RichTextEditor
          key={"new"}
          value={responseBody}
          onChange={setResponseBody}
          placeholder="Type your response here..."
        />
      </div>
      {/* ....................TABLE SECTION................. */}
      <div className="mt-4 bg-white p-3 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            Total Records : <span className="font-semibold">{mailDetails?.pagination?.total || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-2 py-2 w-fit rounded-md border border-[#E2E2EA] bg-white text-[#222325] 
                          text-sm md:text-sm  
                          focus:outline-none focus:ring-0 focus:border-[#1b64e4]
                        `}
              >
                <option value="">--Select status--</option>
                <option value="Unread">Unread</option>
                <option value="DraftSaved">Draft Saved</option>
              </select>
            </div>
            <div className="flex items-center gap-0.5">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="search here..."
                className={`px-4 py-2 w-60 rounded-md border border-[#E2E2EA] bg-white text-[#222325] 
                          text-sm md:text-sm placeholder:text-[#22232559]  
                          focus:outline-none focus:ring-0 focus:border-[#1b64e4]
                        `}
              />
              <div
                onClick={() =>
                  GetAllMailDeatils(
                    currentPageNo,
                    pageSize,
                    search,
                    statusFilter,
                  )
                }
                className={`bg-green-500 w-fit px-4 py-2.25 rounded-md cursor-pointer`}
              >
                <FiSearch className="text-white" size={18} />
              </div>
            </div>
          </div>
          <div>
            <select
              onChange={(e) => {
                const pageSize = e.target.value;
                setCurrentPageNo(1);
                setPageSize(pageSize);
              }}
              className={`px-2 py-2 w-20 rounded-md border border-[#E2E2EA] bg-white text-[#222325] 
                          text-sm md:text-sm  
                          focus:outline-none focus:ring-0 focus:border-[#1b64e4]
                        `}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="overflow-x-auto w-full">
            <table className="common-table w-full">
              {/* Header Loader */}
              <thead>
                <tr className="animate-pulse">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <th key={index} className="p-3.5">
                      <div className="h-4 w-full bg-gray-300 rounded"></div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body Loader */}
              <tbody>
                {Array.from({ length: pageSize }).map((_, rowIndex) => (
                  <tr key={rowIndex} className="animate-pulse">
                    {Array.from({ length: 8 }).map((_, colIndex) => (
                      <td key={colIndex} className="p3.5">
                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            {mailDetails?.emails && mailDetails?.emails?.length > 0 ? (
              <div className="overflow-x-auto w-full">
                <table className="common-table">
                  <thead>
                    <tr>
                      <th className="px-4">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={
                              mailDetails?.emails?.length > 0 &&
                              selectedIds.length === mailDetails.emails.length
                            }
                            onChange={handleAllCheck}
                          />
                        </div>
                      </th>
                      <th>Nick Name</th>
                      <th>Email Id</th>
                      <th>Subject</th>
                      <th>From Email</th>
                      <th>Summary</th>
                      <th>Message Body</th>
                      <th>Response</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mailDetails?.emails &&
                      mailDetails?.emails?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(item._id)}
                                onChange={(e) => handleRowCheck(e, item._id)}
                              />
                            </div>
                          </td>
                          <td className="text-sm font-normal text-zinc-700">
                            {item.nickName}
                          </td>
                          <td className="text-sm font-normal text-zinc-700">
                            {item.mailBoxEmailId}
                          </td>
                          <td className="text-sm font-normal text-zinc-700">
                            {item.subject}
                          </td>
                          <td className="text-sm font-normal text-zinc-700">
                            {item.fromEmail}
                          </td>
                          <td className="text-sm font-normal text-zinc-700">
                            {"AI Genrated Summary"}
                          </td>
                          <td className="text-sm font-normal text-zinc-700">
                            {"Message Body"}
                          </td>

                          <td className="text-sm font-normal text-zinc-700">
                            <div
                              //   onClick={() => handleOpenTextEditor(item)}
                              className={` px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap cursor-pointer ${
                                styles[item.status] ||
                                "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {item.status === "Unread" ? (
                                <div className="flex items-center gap-1">
                                  <MdAddCircleOutline size={16} />
                                  Create Response
                                </div>
                              ) : item.status === "DraftSaved" ? (
                                <div className="flex items-center gap-1">
                                  <RiDraftLine size={16} />
                                  Edit Draft
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <SiTicktick size={16} />
                                  Response Sent
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="text-sm font-normal text-zinc-700">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                                styles[item.status] ||
                                "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {item.status === "DraftSaved"
                                ? "Draft Saved"
                                : item.status === "ReadResponded"
                                  ? "Read & Responded"
                                  : "Unread"}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-60 flex items-center justify-center text-xl font-semibold">
                No Data Found
              </div>
            )}
          </>
        )}

        {mailDetails?.pagination?.total > 20 && (
          <div>
            <div className="mt-2 flex items-center justify-between">
              <div className="">
                Showing page{" "}
                <span className="font-semibold"> {currentPageNo} </span> of{" "}
                <span className="font-semibold">
                  {mailDetails?.pagination?.totalPages}
                </span>
              </div>
              <div className="">
                <Pagination
                  count={mailDetails?.pagination?.totalPages}
                  page={currentPageNo}
                  color="primary"
                  variant="outlined"
                  onChange={(_, value) => {
                    setCurrentPageNo(value);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <CommonLoader
        isVisible={syncEmailLoader}
        type="email"
        message="Syncing Emails..."
        subtitle="Please wait while we fetch your emails"
      />

      <BulkSendProgressModal
        open={openProgressModal}
        onClose={() => {
          setOpenProgressModal(false);
          setResponseBody(false);
          setSelectedIds([]);
          GetAllMailDeatils(currentPageNo, pageSize);
        }}
        jobId={jobId}
        // onDone={() => GetAllMailDeatils(currentPageNo, pageSize)}
      />
    </>
  );
};

export default BulkEmailManagment;
