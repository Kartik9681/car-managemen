const CarList = ({ cars }) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cars.map((car) => (
          <div key={car._id} className="border p-4 rounded">
            <img src={car.images[0]} alt={car.title} className="w-full h-32 object-cover mb-2" />
            <h3 className="text-lg">{car.title}</h3>
            <p>{car.description}</p>
            <button className="bg-blue-500 text-white py-1 px-4 rounded">View Details</button>
          </div>
        ))}
      </div>
    );
  };
  
  export default CarList;
  