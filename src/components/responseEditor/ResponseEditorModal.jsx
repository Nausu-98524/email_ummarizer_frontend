// src/components/ResponseEditor/ResponseEditorModal.jsx
import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { FiCheck, FiLoader, FiX } from "react-icons/fi";
import { RiAiGenerate2 } from "react-icons/ri";
import RichTextEditor from "./RichTextEditor";
import AttachmentUploader from "./AttachmentUploader";
import { extractHtmlFromMime, formatTimestamp } from "../common/common";
import toast from "react-hot-toast";
import {
  generateAiSummary,
  saveUpdateEmailsDraftService,
  sendEmailsByIdService,
} from "../../services/dashboardService";
import Swal from "sweetalert2";
// import { saveDraft, sendEmail } from '../../services/emailService';

const ResponseEditorModal = ({ isOpen, onClose, email, mailbox }) => {
  const [responseBody, setResponseBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [subject, setSubject] = useState("");
  const [aiResponseText, setAiResponseText] = useState("");
  const [delayTimer, setDelayTimer] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [sendEmailLoading, setSendEmailLoading] = useState(false);
  const [aiGenerateLoading, setAiGenerateLoading] = useState(false);
  const html = extractHtmlFromMime(email?.body);
  const safeHtml = DOMPurify.sanitize(html);

  const handleClose = () => {
    setResponseBody("");
    setAiResponseText("");
    onClose();
  };

  useEffect(() => {
    if (!isOpen || !email) return;

    setDelayTimer(true);

    const t = setTimeout(() => {
      setDelayTimer(false);

      // SET STATE HERE - after delay
      setResponseBody(email?.responseBody || "<p></p>");
      setAiResponseText(email?.summary || "");
      setSubject(email.subject ? `Re: ${email.subject}` : "");
      setAttachments([]);
    }, 1000);

    return () => clearTimeout(t);
  }, [isOpen, email?.id]);

  // Handle send
  const handleSend = async () => {
    if (!responseBody.trim()) {
      await Swal.fire({
        title: "Are you sure?",
        text: "Please write a response before sending.",
        icon: "error",
        confirmButtonText: "Yes",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to send this mail.",
      icon: "warning",
      confirmButtonText: "Yes",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    try {
      setSendEmailLoading(true);

      let payload = {
        to: email.fromEmail,
        responseBody: responseBody,
      };

      try {
        setSendEmailLoading(true);
        const { data } = await sendEmailsByIdService(email?.id, payload);

        if (data?.success) {
          toast.success(data?.message);
          setSendEmailLoading(false);
        }
      } catch (error) {
        let { data } = error;
        toast.error(data?.message);
      } finally {
        setSendEmailLoading(false);
      }
      handleClose();
    } catch (error) {
      console.error("Send error:", error);
      toast.error("Failed to send email. Please try again.");
    }
  };

  // Handle GenrateAI Text
  const handleGenrateAIText = async () => {
    let payload = {
      id: email?.id,
      html: safeHtml,
    };

    try {
      setAiGenerateLoading(true);
      const { data } = await generateAiSummary(payload);

      if (data?.success) {
        setAiGenerateLoading(false);
        setAiResponseText(data?.summary);
      }
    } catch (error) {
      console.log(error);
      let { data } = error;
      toast.error(data?.message);
    } finally {
      setAiGenerateLoading(false);
    }
  };

  // Handle manual save
  const handleSaveDraft = async () => {
    let payload = {
      responseBody: responseBody,
    };

    try {
      setDraftLoading(true);
      const { data } = await saveUpdateEmailsDraftService(email?.id, payload);

      if (data?.success) {
        toast.success(data?.message);
        setDraftLoading(false);
      }
    } catch (error) {
      let { data } = error;
      toast.error(data?.message);
    } finally {
      setDraftLoading(false);
    }
  };

  if (!isOpen || !email) return null;

  if (delayTimer) {
    return (
      <div>
        <div className="modal-overlay">
          <div className="editor-modal h-100 flex items-center justify-center">
            <div className="simple-loader">
              <div className="simple-spinner"></div>
              <p className="loader-message dark">{"Loading..."}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="editor-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="editor-header">
          <h2 className="editor-title">✍️ Compose Response</h2>
          <button className="close-btn" onClick={handleClose}>
            <FiX />
          </button>
        </div>

        {/* Body */}
        <div className="editor-body">
          {/* Left: Original Email */}
          <div className="original-email-section">
            <div style={{ background: "#fff" }} className="info-box mt-2">
              <div className="flex items-center justify-between">
                <div className="info-box-title">🤖 AI Summary</div>
                {aiResponseText === "" && (
                  <div
                    onClick={() => {
                      if (!aiGenerateLoading) {
                        handleGenrateAIText();
                      }
                    }}
                    className="bg-violet-100 text-violet-600 font-semibold px-4 py-1 rounded-full flex items-center gap-1 cursor-pointer hover:bg-violet-200"
                  >
                    <RiAiGenerate2 size={22} />
                    <div className="text-sm">
                      {aiGenerateLoading ? "loading..." : "Generate AI Summary"}
                    </div>
                  </div>
                )}
              </div>
              {aiResponseText && (
                <div className="info-box-text">{aiResponseText}</div>
              )}
            </div>

            <div className="email-card">
              <div className="email-card-header">📨 Original Email</div>

              <div className="email-meta">
                <div className="email-meta-row">
                  <span className="email-meta-label">From:</span>
                  <span className="email-meta-value">{email.from}</span>
                </div>
                <div className="email-meta-row">
                  <span className="email-meta-label">Subject:</span>
                  <span className="email-meta-value">{email.subject}</span>
                </div>
                <div className="email-meta-row">
                  <span className="email-meta-label">Date:</span>
                  <span className="email-meta-value">{email.date}</span>
                </div>
              </div>

              <div
                className="prose max-w-none email-body"
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />

              {/* <div className="email-body">{email.body}</div> */}
            </div>
            <div className="info-box mt-2">
              <div className="info-box-title">📧 Sending From</div>
              <div className="info-box-text">
                This email will be sent from: <strong>{mailbox.email}</strong>
              </div>
            </div>
          </div>

          {/* Right: Response Editor */}
          <div className="response-section">
            {/* Rich Text Editor */}
            <div className="">
              <RichTextEditor
                key={email?.responseBody || "new"}
                value={responseBody}
                onChange={setResponseBody}
                placeholder="Type your response here..."
              />
            </div>

            {/* Attachments
            <AttachmentUploader
              attachments={attachments}
              onAttachmentsChange={setAttachments}
            />
             */}
          </div>
        </div>

        {/* Footer */}
        <div className="editor-footer">
          <div>
            <h5 className="hidden">Testt</h5>
            {draftLoading ? (
              <div className="draft-save-indicator">
                <FiLoader className="spinner" />
                <span className="save-text">Saving draft...</span>
              </div>
            ) : sendEmailLoading ? (
              <div className="draft-save-indicator">
                <FiLoader className="spinner" />
                <span className="save-text">Sending mail...</span>
              </div>
            ) : (
              <>
                {email.savedDraftAt !== "" && (
                  <div className="draft-save-indicator">
                    <FiCheck className="check-icon" />
                    <span className="save-text success">
                      Draft saved {formatTimestamp(email.savedDraftAt)}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="footer-actions">
            <button
              className="editor-btn editor-btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="editor-btn editor-btn-secondary"
              onClick={handleSaveDraft}
            >
              {!draftLoading ? "💾 Save Draft" : "loading..."}
            </button>
            <button
              className="editor-btn editor-btn-primary"
              disabled={sendEmailLoading}
              onClick={handleSend}
            >
              {sendEmailLoading ? "Sending..." : "✉️ Send Email"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseEditorModal;
