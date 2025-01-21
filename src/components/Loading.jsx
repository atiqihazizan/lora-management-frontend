import PropTypes from "prop-types";

const Loading = ({ text = "Loading..." }) => (
  <div className="flex items-center justify-center absolute inset-0 bg-transparent">
    <div className="flex items-center space-x-1">
      <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse"></div>
      <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse delay-200"></div>
      <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse delay-400"></div>
    </div>
    <span className="ml-2 text-sm font-medium text-gray-700">{text}</span>
  </div>
);

Loading.propTypes = {
  text: PropTypes.string,
};

export default Loading;
