import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      
      {/* 404 Number */}
      <h1 className="text-6xl sm:text-7xl font-bold text-[#468432]">
        404
      </h1>

      {/* Message */}
      <h2 className="text-2xl sm:text-3xl font-semibold mt-4">
        Page Not Found
      </h2>

      <p className="text-gray-600 mt-2 max-w-md">
        The page you are looking for doesn’t exist or has been moved.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Go Back
        </button>

        <button
          onClick={() => navigate("/")}
          className="px-5 py-3 bg-[#468432] text-white rounded-lg hover:bg-[#3a6b2a]"
        >
          Go Home
        </button>

      </div>
    </div>
  );
}