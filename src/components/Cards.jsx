const Card = ({title, description}) => (
  <div className="bg-white shadow-md rounded p-4">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </div>
)

export default Card;