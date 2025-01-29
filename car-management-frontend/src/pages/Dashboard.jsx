import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";

function Dashboard() {
  const [cars, setCars] = useState([]); // Initialize as an empty array
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, [navigate]);

  const fetchCars = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("https://car-management-ltbh.onrender.com/api/cars", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Correctly set the token in the Authorization header
      },
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token");
        }
        return response.json();
      })
      .then((data) => {
        // Ensure the response is an array
        setCars(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err.message));
  };

  // Function to reset the search
  const resetSearch = () => {
    fetchCars(); // Fetch all cars again when resetting
  };

  return (
    <>
      <div className="container m-0 p-0 w-full">
        {/* Pass resetSearch function to header */}
        <Header onSearchResults={setCars} resetSearch={resetSearch} />
      </div>
      <hr></hr>
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-semibold mb-6">Your Cars</h2>
        <button
          onClick={() => navigate("/create-car")}
          className="bg-blue-600 text-white p-3 rounded-md shadow-md hover:bg-blue-700 transition"
        >
          Add New Car
        </button>

        {/* Display error message if any */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {cars && cars.length > 0 ? (
            cars.map((car) => (
              <Link
                key={car._id}
                to={`/car/${car._id}`}
                className="block border rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 p-4"
              >
                {/* Show car image if available, otherwise show a placeholder */}
                <div className="w-full h-40 flex justify-center items-center bg-gray-100 rounded-lg mb-4">
                  {car.images && car.images.length > 0 ? (
                    <img
                      src={`https://car-management-ltbh.onrender.com${car.images[0]}`}
                      alt={car.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-500">No Image Available</p>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-blue-600 mb-2">{car.title}</h3>
                <p className="text-gray-700 mb-2">{car.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{car.tags.join(", ")}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/edit-car/${car._id}`);
                      }}
                      className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/delete-car/${car._id}`);
                      }}
                      className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No cars found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
