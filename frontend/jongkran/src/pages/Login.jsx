import { Link, useNavigate } from "react-router-dom";
  
export default function Login() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex items-center justify-center bg-white md:bg-gray-100">
      <div className="grid md:grid-cols-2 w-full max-w-7xl min-h-screen md:min-h-[875px]">
        <div className="hidden md:block bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e')] bg-cover bg-center" />

        <div className="flex items-center justify-center p-[25px]">
          <div className="w-full md:w-[740px] md:h-[750px] bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center">
            <h1 className="title-font text-4xl font-bold text-center">
              Welcome Back
            </h1>

            <p className="text-center text-gray-500 mt-2">
              Please enter your detail to log in.
            </p>

            <form className="mt-8 space-y-5">
              <div>
                <label className="text-sm font-semibold">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="mt-2 w-full bg-gray-200 rounded-md px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="mt-2 w-full bg-gray-200 rounded-md px-4 py-3 outline-none"
                />
              </div>

              <button 
                onClick={() => navigate("/")}
                className="w-full bg-[#468432] hover:bg-[#1A5C05] text-white py-3 rounded-md font-semibold">
                Log In
              </button>
            </form>

            <p className="text-center mt-8 text-sm font-semibold text-gray-500">
              New to JongKran?
            </p>

            <Link
              to="/register"
              className="mt-3 w-full border border-[#468432] text-[#468432] text-center py-3 rounded-md font-semibold hover:bg-[#468432] hover:text-white"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}