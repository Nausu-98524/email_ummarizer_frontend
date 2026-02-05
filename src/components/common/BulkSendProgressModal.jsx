import { useEffect, useState } from "react";
import { getBulkJobProgress } from "../../services/dashboardService";
import Button from "../ui/Button";

export default function BulkSendProgressModal({
  open,
  onClose,
  jobId,
  token,
  onDone,
}) {
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  const handleClose = () => {
    setError("");
    setJob(null);
    onClose();
  };

  useEffect(() => {
    if (!open || !jobId) return;

    let timer = null;

    const poll = async () => {
      try {
        setError("");

        const { data } = await getBulkJobProgress(jobId);
        const j = data.job;
        setJob(j);

        if (j.status === "DONE" || j.status === "FAILED") {
          clearInterval(timer);
          onDone?.(j);
        }
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to fetch progress");
      }
    };

    poll();
    timer = setInterval(poll, 1200);

    return () => clearInterval(timer);
  }, [open, jobId, token, onDone]);

  if (!open) return null;

  const percent = job?.percent ?? 0;
  const status = job?.status ?? "LOADING";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold">Bulk Send Progress</h2>
          <button
            onClick={handleClose}
            className="rounded-md px-2 py-1 text-gray-600 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {error ? (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {/* Progress bar */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-700">
                Status: <span className="font-semibold">{status}</span>
              </span>
              <span className="text-sm font-semibold">{percent}%</span>
            </div>

            <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  status === "FAILED"
                    ? "bg-red-500"
                    : percent === 100
                      ? "bg-green-500"
                      : "bg-blue-600"
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Counters */}
          <div className="grid grid-cols-2 gap-3 text-sm mt-4">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-3 border-l-4 border border-blue-500">
              <div className="text-gray-500">Total</div>
              <div className="text-lg font-semibold">{job?.total ?? 0}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-3 border-l-4 border border-yellow-500">
              <div className="text-gray-500">Processed</div>
              <div className="text-lg font-semibold">{job?.processed ?? 0}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-3 border-l-4 border border-green-500">
              <div className="text-gray-500">Success</div>
              <div className="text-lg font-semibold text-green-600">
                {job?.success ?? 0}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-3 border-l-4 border border-red-500">
              <div className="text-gray-500">Failed</div>
              <div className="text-lg font-semibold text-red-600">
                {job?.failed ?? 0}
              </div>
            </div>
          </div>

          {job?.lastError ? (
            <div className="rounded-md bg-yellow-50 p-3 text-xs text-yellow-800">
              Last error: {job.lastError}
            </div>
          ) : null}

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2">
            <div className="w-fit">
              <Button onClick={handleClose} text={"Close"} variant="danger" />
            </div>

            {(status === "DONE" || status === "FAILED") && (
              <div className="w-fit">
                <Button onClick={handleClose} text={"Okay"} variant="primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
