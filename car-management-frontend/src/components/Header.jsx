import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({ onSearchResults, resetSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (keyword) => {
    if (!keyword) return; // Prevent empty search

    const token = localStorage.getItem("authToken");
    const id = localStorage.getItem("userID");

    if (!token || !id) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:5000/api/cars/search?keyword=${keyword}&userID=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Send the token for authorization
      },
    })
      .then((response) => response.json())
      .then((data) => {
        onSearchResults(Array.isArray(data) ? data : []); // Ensure the data is an array
      })
      .catch((err) => {
        console.error("Search error:", err);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    navigate("/login"); // Redirect to login
  };

  return (
    <header className="p-4 flex items-center justify-between">
      {/* Logo */}
      <h1
        onClick={() => {
          navigate("/dashboard");
          resetSearch(); // Reset the search and show all cars
        }}
        className="text-3xl font-semibold cursor-pointer hover:text-blue-400 transition"
      >
        Car Management
      </h1>

      {/* Search Bar */}
      <div className="flex items-center space-x-4 border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2 md:w-1/3">
        <Search className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search cars..."
          className="w-full outline-none px-4 py-2 rounded-md text-gray-700 bg-gray-100 focus:ring-2 focus:ring-blue-500 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(searchTerm); // Trigger search on Enter
            }
          }}
        />
        <button
          onClick={() => handleSearch(searchTerm)} // Trigger search on button click
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition focus:outline-none"
        >
          Search
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition focus:outline-none"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
