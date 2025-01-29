import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function DeleteCar() {
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

    // Fetch car details with the token in the Authorization header
    fetch(`http://localhost:5000/api/cars/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCar(data))
      .catch((err) => setError("Failed to load car details"));
  }, [id, navigate]);

  const handleDelete = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login"); // Redirect to login page if no token is found
      return;
    }

    // Send request to delete the car
    fetch(`http://localhost:5000/api/cars/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete car");
        }
        navigate("/dashboard"); // Redirect back to the dashboard after deletion
      })
      .catch((err) => setError(err.message));
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Delete Car</h2>
      {car ? (
        <>
          <p className="mb-4">Are you sure you want to delete the car?</p>
          <div className="border p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">{car.title}</h3>
            <p>{car.description}</p>
            <div className="mt-4">
              <strong>Tags:</strong>
              <p>{car.tags.join(", ")}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-500 text-white py-2 px-4 rounded-md ml-2 hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default DeleteCar;
