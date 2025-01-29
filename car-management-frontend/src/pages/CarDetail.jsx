import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CarDetail() {
  const { id } = useParams(); // Get the car ID from the URL
  const [car, setCar] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Retrieve the token

    if (!token) {
      navigate("/login"); // Redirect to login page if no token is found
      return;
    }

    // Fetch the car details with the token in the Authorization header
    fetch(`http://localhost:5000/api/cars/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Set the token in the Authorization header
      },
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token");
        }
        return response.json();
      })
      .then((data) => setCar(data)) // Successfully set the car data
      .catch((err) => setError(err.message)); // Set the error message if any
  }, [id, navigate]);

  if (error) return <p className="text-red-500">{error}</p>; // Show error if there is one
  if (!car) return <p>Loading...</p>;

  return (
    <>
      {/* Header with Car Management link */}
      <header className="p-4 flex items-center justify-between mb-6">
        <h1
          onClick={() => navigate("/dashboard")}
          className="text-3xl font-bold cursor-pointer hover:text-blue-400 transition"
        >
          Car Management
        </h1>
      </header>
      <hr></hr>

      <div className="container mx-auto p-6">
        {/* Car Detail Card */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-semibold mb-4">{car.title}</h2>
          <p className="text-lg text-gray-700 mb-4">{car.description}</p>

          {/* Car Images Section */}
          {car.images && car.images.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-4">Car Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {car.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={`http://localhost:5000${image}`} // Serve the images from the 'uploads' folder
                      alt={`Car image ${index + 1}`}
                      className="w-full h-64 object-cover rounded-md shadow-md transition transform group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-gray-500">No images available for this car.</p>
          )}

          {/* Tags Section */}
          <div className="mt-6">
            <strong className="text-xl">Tags:</strong>
            <p className="text-lg text-gray-700 mt-2">{car.tags.join(", ")}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CarDetail;
