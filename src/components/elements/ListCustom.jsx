import PropTypes from 'prop-types';

const ListCustom = ({ items, onItemClick, className, children, itemClassName }) => {
  return (
    <ul className={`list-none p-0 ${className}`}>
      {items.map((item, index) => (
        <li
          key={index}
          className={`py-2 px-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${typeof itemClassName === 'function' ? itemClassName(item, index) : itemClassName}`}
          onClick={() => onItemClick && onItemClick(item, index)}
        >
          {children ? children(item, index) : item}
        </li>
      ))}
    </ul>
  );
};

ListCustom.propTypes = {
  items: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
  ])).isRequired,
  onItemClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.func, // Function to render custom content for each item
  itemClassName: PropTypes.oneOfType([
    PropTypes.string, // Static className
    PropTypes.func,   // Function to dynamically generate className based on item and index
  ]),
};

// ListCustom.defaultProps = {
//   onItemClick: null,
//   className: '',
//   children: null,
//   itemClassName: '',
// };

export default ListCustom;

// <ul className="space-y-2">
//   {Object.entries(selectedMarker.prop || {}).map(([key, children], index) => (
//     <li
//       key={index}
//       className="flex items-center justify-between p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
//     >
//       <span>{key}</span>
//       <button
//         onClick={() => deleteProp(key)}
//         className="text-red-500 hover:text-red-700 focus:outline-none"
//       >
//         <FaTimes className="w-5 h-5" />
//       </button>
//     </li>
//   ))}
// </ul>