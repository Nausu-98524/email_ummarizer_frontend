// src/components/ResponseEditor/AttachmentUploader.jsx
import React, { useState, useCallback } from "react";
import { FiUpload, FiX, FiFile, FiImage, FiFileText } from "react-icons/fi";

const AttachmentUploader = ({ attachments = [], onAttachmentsChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  // File validation
  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      //   "image/gif",
      //   "application/msword",
      //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (file.size > maxSize) {
      alert(`File ${file.name} is too large. Maximum size is 5MB.`);
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      alert(`File type ${file.type} is not allowed.`);
      return false;
    }

    return true;
  };

  //   const fileToBase64 = (file) =>
  //     new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onload = () => resolve(reader.result);
  //       reader.onerror = (error) => reject(error);
  //     });

  //   const handleFiles = useCallback(
  //     async (files) => {
  //       const validFiles = Array.from(files).filter(validateFile);

  //       const newAttachments = await Promise.all(
  //         validFiles.map(async (file) => {
  //           const base64 = await fileToBase64(file);

  //           const extension = file.name.split(".").pop();

  //           return {
  //             id: Date.now() + Math.random(),
  //             name: file.name,
  //             extension,
  //             size: file.size,
  //             type: file.type,
  //             base64,
  //             preview: file.type.startsWith("image/")
  //               ? URL.createObjectURL(file)
  //               : null,
  //           };
  //         }),
  //       );

  //       onAttachmentsChange([...attachments, ...newAttachments]);
  //     },
  //     [attachments, onAttachmentsChange],
  //   );

  //   Handle file selection
  const handleFiles = useCallback(
    (files) => {
      const validFiles = Array.from(files).filter(validateFile);

      const newAttachments = validFiles.map((file) => ({
        id: Date.now() + Math.random(),
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
      }));

      onAttachmentsChange([...attachments, ...newAttachments]);
    },
    [attachments, onAttachmentsChange],
  );

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  // File input change
  const handleInputChange = (e) => {
    if (e.target.files.length) {
      handleFiles(e.target.files);
    }
  };

  // Remove attachment
  const removeAttachment = (id) => {
    const filtered = attachments.filter((att) => att.id !== id);
    onAttachmentsChange(filtered);
  };

  // Get file icon
  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return <FiImage />;
    if (type.includes("pdf")) return <FiFileText />;
    return <FiFile />;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="attachment-uploader mt-2">
      {/* Drop Zone */}
      <div
        className={`dropzone ${isDragging ? "dragging" : ""}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input").click()}
      >
        <FiUpload size={32} />
        <div>
          <p className="dropzone-text">Click to upload or drag and drop</p>
          <p className="dropzone-hint">PDF, DOC, JPG, PNG (max 10MB each)</p>
        </div>
      </div>

      <input
        id="file-input"
        type="file"
        multiple
        onChange={handleInputChange}
        style={{ display: "none" }}
        accept="image/*,.pdf,.doc,.docx"
      />

      {/* Attachment List */}
      {attachments.length > 0 && (
        <div className="attachment-list">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="attachment-item">
              <div className="attachment-icon">
                {getFileIcon(attachment.type)}
              </div>
              <div className="attachment-info">
                <div className="attachment-name">{attachment.name}</div>
                <div className="attachment-size">
                  {formatFileSize(attachment.size)}
                </div>
              </div>
              <button
                className="attachment-remove"
                onClick={() => removeAttachment(attachment.id)}
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentUploader;
