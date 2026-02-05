import { MdAdd } from "react-icons/md";
import { LuRefreshCcw } from "react-icons/lu";
import { HiOutlineMail } from "react-icons/hi";
import { FiSend } from "react-icons/fi";
const Button = ({
  text,
  onClick,
  className = "",
  textClassName = "",
  loading = false,
  disabled = false,
  variant = "primary",
  defaultIcon = "",
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${variant === "primary" 
          ? "btn-primary" : variant === "refresh" 
          ? "btn-refresh" : variant === "danger" 
          ? "btn-danger" : "btn-green"} 
        ${className}
        ${disabled ? "cursor-not-allowed opacity-80" : " cursor-pointer"} 
        rounded-md flex items-center justify-center w-full hover:shadow-lg`}
    >
      {loading ? (
        <span className=" text-sm font-medium">Loading...</span>
      ) : (
        <div className="flex items-center gap-1">
          {defaultIcon === "Add" && <MdAdd size={20} />}
          {defaultIcon === "Refresh" && <LuRefreshCcw size={16} />}
          {defaultIcon === "mail" && <HiOutlineMail size={16} />}
          {defaultIcon === "send" && <FiSend size={16} />}
          <p className={` ${textClassName} font-medium text-sm text-nowrap`}>{text}</p>
        </div>
      )}
    </button>
  );
};

export default Button;
