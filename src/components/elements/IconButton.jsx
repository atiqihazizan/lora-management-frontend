import PropTypes from "prop-types";

const IconButton = ({ icon, onClick, className = "", size = "md" }) => {
  // Saiz butang berdasarkan prop size
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-full bg-gray-100 hover:bg-gray-200 shadow-md flex items-center justify-center ${sizes[size]} ${className}`}
    >
      {icon}
    </button>
  );
};

IconButton.propTypes = {
  icon: PropTypes.element.isRequired, // Ikon mesti dihantar sebagai elemen React
  onClick: PropTypes.func,
  className: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

export default IconButton;
