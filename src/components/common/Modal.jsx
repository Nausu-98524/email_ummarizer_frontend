const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  subTitle,
  size = "md",
  showCloseButton = true,
  closeOnOverlay = false,
  border = true,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-7xl w-full mx-4",
    fit: "max-w-fit",
  };

  return (
    <div className="fixed inset-0 z-10 flex items-start justify-center p-4 pt-28">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]} max-h-[calc(100vh-8rem)] flex flex-col`}
      >
        {/* Header - Sticky */}
        {(title || showCloseButton) && (
          <div
            className={`flex items-center justify-between ${border && "border-b border-gray-200 py-4 "}  px-6 shrink-0`}
          >
            <div>
              {title && (
                <h2 className="text-xl font-semibold text-[#222325]">
                  {title}
                </h2>
              )}
              {subTitle && <p className="text-sm text-black/60">{subTitle}</p>}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 cursor-pointer rounded-full transition-colors ml-auto"
              >
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body - Scrollable */}
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
      </div>
    </div>
  );
};
export default Modal;
