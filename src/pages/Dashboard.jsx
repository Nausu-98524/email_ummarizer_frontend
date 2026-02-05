import { useEffect, useState } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import { SiTicktick } from "react-icons/si";
import { RiDraftLine } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import Button from "../components/ui/Button";
import {
  getEmailDetailsService,
  syncEmailsService,
} from "../services/dashboardService";
import toast from "react-hot-toast";
import { Pagination } from "@mui/material";
import ResponseEditorModal from "../components/responseEditor/ResponseEditorModal";
import CommonLoader from "../components/common/CommonLoader";
import { formatExactDateTime } from "../components/common/common";

const styles = {
  Unread: "bg-blue-100 text-blue-600",
  DraftSaved: "bg-yellow-100 text-yellow-600",
  ReadResponded: "bg-green-100 text-green-600",
};

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [syncEmailLoader, setSyncEmailLoader] = useState(false);
  const [mailDetails, setMailDetails] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  // .............Pagination Start...............
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // .............Pagination End...............

  //............TextEditor............
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [selectedMailbox, setSelectedMailbox] = useState(null);

  const handleOpenTextEditor = (emaildetails) => {
    // Test mailbox data
    const tempMailbox = {
      id: emaildetails?._id,
      nickname: emaildetails?.nickName,
      email: emaildetails?.mailBoxEmailId,
    };

    // Test email data
    const tempEmail = {
      id: emaildetails?._id,
      from: emaildetails?.nickName,
      fromEmail: emaildetails?.fromEmail,
      subject: emaildetails?.subject,
      body: emaildetails?.messageBody,
      responseBody: emaildetails?.responseBody,
      summary: emaildetails?.aiSummary,
      date: formatExactDateTime(emaildetails?.receivedAt),
      status: emaildetails?.status,
      savedDraftAt: emaildetails?.savedDraftAt || "",
    };

    setSelectedMailbox(tempMailbox);
    setSelectedEmail(tempEmail);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedEmail(null);
    setSelectedMailbox(null);
    GetAllMailDeatils(currentPageNo, pageSize);
  };

  //..........Text Editor End..........

  const handleRefresh = () => {
    setCurrentPageNo(1);
    setPageSize(10);
    setSearch("");
    setStatusFilter("");
    GetAllMailDeatils(1, 10, "", "");
  };

  const GetAllMailDeatils = async (page, limit, serach, statusFilter) => {
    try {
      setLoading(true);
      const { data } = await getEmailDetailsService(
        page,
        limit,
        serach,
        statusFilter,
      );
      if (data?.success) {
        setMailDetails(data);
      }
    } catch (error) {
      let { data } = error;
      toast.error(data.message);
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
          <h1 className="text-2xl font-semibold text-black/80">
            Email Dashboard
          </h1>
          <p className="text-sm mt-1 text-gray-600">
            Manage and respond to emails across all your mailboxes
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* <Button
            onClick={handleOpenEditor}
            text="Open Texteditor"
            variant="refresh"
          /> */}
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
      {/* ....................CARD SECTION................. */}
      {loading ? (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-l-4
          ${i === 0 ? "border-blue-500" : i === 1 ? "border-yellow-500" : i === 2 ? "border-green-500" : "border-purple-500"}
          `}
            >
              <div className="flex items-center justify-between">
                {/* Icon skeleton */}
                <div>
                  {/* Title skeleton */}
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>

                  {/* Number skeleton */}
                  <div className="h-10 w-24 bg-gray-300 rounded mt-3 animate-pulse"></div>
                </div>
                <div className="h-14 w-14 rounded-full bg-gray-200 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Unread */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Total Unread
                </p>
                <p className="text-4xl font-semibold text-gray-900 mt-4">
                  {" "}
                  {mailDetails?.cardDetails?.Unread || 0}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Drafts Saved */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Drafts Saved
                </p>
                <p className="text-4xl font-semibold text-gray-900 mt-4">
                  {" "}
                  {mailDetails?.cardDetails?.DraftSaved || 0}
                </p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Responded */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Responded
                </p>
                <p className="text-4xl font-semibold text-gray-900 mt-4">
                  {" "}
                  {mailDetails?.cardDetails?.ReadResponded || 0}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <SiTicktick className="text-green-600 w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Active Mailboxes */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Active Mailboxes
                </p>
                <p className="text-4xl font-semibold text-gray-900 mt-4">
                  {" "}
                  {mailDetails?.cardDetails?.ActiveEmailBox || 0}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ....................TABLE SECTION................. */}
      <div className="mt-4 bg-white p-3 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-2">
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
                <option value="ReadResponded">Responded</option>
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
                      <th>Nick Name</th>
                      <th>Email Id</th>
                      <th>Subject</th>
                      <th>From Email</th>
                      <th>Response</th>
                      <th>Status</th>
                      <th>Summary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mailDetails?.emails &&
                      mailDetails?.emails?.map((item, index) => (
                        <tr key={index}>
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
                            <div
                              onClick={() => handleOpenTextEditor(item)}
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
                           <td className="text-sm font-normal text-zinc-700">
                            {item.aiSummary}
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
                    console.log(value, "testjkfdgskujdsfgyu");
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="email-dashboard">
        <ResponseEditorModal
          isOpen={isEditorOpen}
          onClose={handleCloseEditor}
          email={selectedEmail}
          mailbox={selectedMailbox}
        />
      </div>

      <CommonLoader
        isVisible={syncEmailLoader}
        type="email"
        message="Syncing Emails..."
        subtitle="Please wait while we fetch your emails. it may take longer."
      />
    </>
  );
};

export default Dashboard;
