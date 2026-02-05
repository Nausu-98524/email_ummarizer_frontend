// src/components/ResponseEditor/RichTextEditor.jsx
import React, { useMemo } from "react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Type your response here...",
}) => {
  // Custom image handler (optional)
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        // You can upload to your server here
        // For now, we'll convert to base64
        const reader = new FileReader();
        reader.onload = (e) => {
          const quill = reactQuillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, "image", e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
  };

  // Toolbar configuration
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          // Font and size
          [{ header: [1, 2, 3, false] }],
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],

          // Text formatting
          ["bold", "italic", "underline", "strike"],

          // Colors
          [{ color: [] }, { background: [] }],

          // Lists and indentation
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],

          // Alignment
          [{ align: [] }],

          // Links and images
          ["link", "image"],

          // Clear formatting
          ["clean"],
        ],
        handlers: {
          // Custom handlers can be added here
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false, // Better paste behavior
      },
    }),
    [],
  );

  // Formats allowed
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
  ];

  const reactQuillRef = React.useRef(null);

  return (
    <div className="rich-text-editor-wrapper">
      <ReactQuill
        ref={reactQuillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="quill-editor"
      />
    </div>
  );
};

export default RichTextEditor;
