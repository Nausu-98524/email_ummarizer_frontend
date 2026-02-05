import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";

const Input = ({
  id = "",
  type = "text",
  label = "",
  disabled = false,
  required = false,
  value,
  placeholder,
  errors,
  step,
  name,
  onChange,
  rightLabel,
  onkeyDown,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <label className="block text-sm mb-1 font-semibold text-[#222325]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {rightLabel && <div>{rightLabel}</div>}
      </div>
      <div className="relative">
        <input
          id={id}
          name={name}
          disabled={disabled}
          type={showPassword ? "text" : type}
          value={value}
          step={step}
          onChange={onChange}
          onKeyDown={onkeyDown}
          placeholder={placeholder}
          className={`px-4 py-2 w-full rounded-md border border-[#E2E2EA] bg-white text-[#222325] 
            text-sm md:text-sm ${disabled ? "text-black/45 bg-gray-100" : "text-[#222325]"} placeholder:text-[#22232559]  focus:outline-none focus:ring-0 focus:border-[#1b64e4]
            ${errors ? "border border-red-500" : ""}
            `}
        />

        {type === "password" && (
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-6 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <FaRegEyeSlash size={18} />
            ) : (
              <FaRegEye size={18} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
