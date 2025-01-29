import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditCar() {
  const { id } = useParams(); // Get the car ID from the URL
  const [car, setCar] = useState({ title: "", description: "", tags: [], images: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login"); // Redirect to login page if no token is found
      return;
    }

    // Fetch the car details
    fetch(`http://localhost:5000/api/cars/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCar(data); // Set car data to state
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((err) => {
        setError("Failed to fetch car details");
        setLoading(false);
      });
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      navigate("/login");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", car.title);
    formData.append("description", car.description);
    formData.append("tags", car.tags.join(","));
  
    // Append image files if present
    if (car.images.length > 0) {
      Array.from(car.images).forEach((image) => {
        formData.append("images", image);
      });
    }
  
    setIsSaving(true);
  
    // Update car details
    fetch(`http://localhost:5000/api/cars/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // Sending FormData, not JSON
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update car");
        }
        navigate("/dashboard"); // Redirect to dashboard after successful update
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsSaving(false));
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar({ ...car, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    setCar({ ...car, images: files, imageUrls });
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Edit Car</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={car.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-semibold">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={car.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-semibold">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={car.tags.join(", ")}
            onChange={(e) => handleChange({ target: { name: "tags", value: e.target.value.split(", ") } })}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="images" className="block text-sm font-semibold">
            Images (Choose files to upload)
          </label>
          <input
  type="file"
  id="images"
  name="images"
  multiple
  onChange={handleImageChange} // This function updates the state with files
  className="w-full p-2 border rounded-md"
/>

        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="bg-gray-500 text-white py-2 px-4 rounded-md ml-2 hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCar;
