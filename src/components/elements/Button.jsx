import PropTypes from "prop-types";

const Button = ({
  label,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  size = "md",
  isLoading = false,
  href = null,
  target = "_self",
  icon = null,
  disabled = false,
}) => {
  // Base styles
  // const baseClasses = 'inline-flex items-center justify-center font-medium focus:outline-none transition duration-150 ease-in-out';
  const baseStyles = "rounded-md focus:outline-none transition-all duration-300 flex items-center justify-center";

  // Variants untuk setiap jenis butang (primary, secondary, danger, link)
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500",
    secondary: "bg-gray-300 text-gray-800 hover:bg-gray-400 focus:ring-2 focus:ring-gray-300",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-2 focus:ring-red-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-2 focus:ring-green-500",
    light: "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300",
    link: "text-blue-600 hover:underline focus:outline-none", // Gaya khas untuk link
  };

  // Sizes untuk butang
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  // Loading styles
  const loadingStyles = "opacity-50 cursor-not-allowed";

  // Jika ada `href`, gunakan <a>. Jika tiada, gunakan <button>
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={isLoading ? null : onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${isLoading ? loadingStyles : ""}`}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-t-2 border-gray-500 rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : icon ? (
        <span className="flex items-center space-x-2">
          {icon}
          {label && <span>{label}</span>}
        </span>
      ) : (
        label
      )}
    </button>
  );
};
Button.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  variant: PropTypes.oneOf(["primary", "secondary", "danger", "success", "light", "link"]),
  className: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  isLoading: PropTypes.bool,
  href: PropTypes.string,
  target: PropTypes.string,
  icon: PropTypes.element,
  disabled: PropTypes.bool,
};

export default Button;
