import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome to Car Management</h1>
      <p className="text-lg text-gray-700 mb-6">Manage your cars, upload images, and track your inventory with ease.</p>
      
      <div className="flex space-x-4">
        <Link
          to="/login"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Home;
