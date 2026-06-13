import { Link } from "react-router-dom";

export default function Register() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white md:bg-gray-100">
      <div className="grid md:grid-cols-2 w-full max-w-7xl min-h-screen md:min-h-[875px]">
        <div className="hidden md:block bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e')] bg-cover bg-center" />

        <div className="flex items-center justify-center p-[25px]">
          <div className="w-full md:w-[740px] md:h-[875px] bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center">
            <h1 className="title-font text-4xl font-bold text-center">
              Create Account
            </h1>

            <p className="text-center text-gray-500 mt-2">
              Create your account to start cooking with us.
            </p>

            <form className="mt-8 space-y-4">
              <input className="w-full bg-gray-200 rounded-md px-4 py-3" placeholder="Full Name" />
              <input className="w-full bg-gray-200 rounded-md px-4 py-3" placeholder="Email Address" />
              <input className="w-full bg-gray-200 rounded-md px-4 py-3" placeholder="Password" type="password" />
              <input className="w-full bg-gray-200 rounded-md px-4 py-3" placeholder="Confirm Password" type="password" />

              <label className="flex gap-2 text-sm">
                <input type="checkbox" />
                I agree to Terms of Service and Privacy Policy
              </label>

              <button className="w-full bg-[#468432] hover:bg-[#1A5C05] text-white py-3 rounded-md font-semibold">
                Create Account
              </button>
            </form>

            <p className="text-center mt-8 text-sm">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="mt-3 text-center text-[#468432] font-bold"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}