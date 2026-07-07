import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl rounded-xl overflow-hidden border-[2px] border-[#468432] bg-white shadow-2xl">
        <div className="grid md:grid-cols-2 min-h-[630px]">

          {/* Left Image */}
          <div
            className="hidden md:block bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://admin.sriboga.com/storage/news/1685519127-chef-preparing-food-ingredients-2021-09-24-03-57-22-utc%20(1).webp')",
            }}
          />

          {/* Right Side */}
          <div className="flex items-start justify-center bg-white py-12 px-10">
            <div className="w-full max-w-md mt-5">

              {/* Heading */}
              <h1 className="text-4xl font-bold text-center">
                Welcome to JongKran
              </h1>

              <p className="text-center text-gray-500 mt-2">
                Please enter your details to log in.
              </p>

              {/* Form */}
              <form className="mt-5 space-y-4">

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 focus:outline-none focus:ring-[1px] focus:ring-[#468432]"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-semibold mb-2">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 focus:outline-none focus:ring-[1px] focus:ring-[#468432]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="w-full bg-[#468432] hover:bg-[#1A5C05] text-white py-3 rounded-lg font-semibold transition"
                >
                  Log In
                </button>
              </form>

              {/* Register */}
              <div className="mt-5 text-center">
                <p className="text-gray-500 text-sm">
                  New to JongKran?
                </p>

                <Link
                  to="/register"
                  className="mt-4 block w-full border border-[#468432] text-[#468432] py-3 rounded-lg font-semibold hover:bg-[#468432] hover:text-white transition"
                >
                  Create Account
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}