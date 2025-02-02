import { useDrag } from "react-dnd";
import { useMapContext } from "../../utils/useContexts";
import PropTypes from "prop-types";

const DragTools = ({ type, data, children }) => {
  const { setIsDragging } = useMapContext();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: data,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  }));

  return (
    <button
      ref={drag}
      onDrag={() => setIsDragging(true)}
      className={`btn-flex-icon-text text-md btn-bg-white cursor-move ${isDragging ? "opacity-50" : "opacity-100"
        }`}
    >
      {children}
    </button>
  );
};

DragTools.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export default DragTools;
