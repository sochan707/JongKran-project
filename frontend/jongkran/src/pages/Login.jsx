import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const successMessage = location.state?.message;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    const savedUser = JSON.parse(
      localStorage.getItem("registeredUser")
    );

    if (!savedUser) {
      setError("Account not found. Please create an account first.");
      return;
    }

    const emailMatches =
      form.email.trim().toLowerCase() === savedUser.email.toLowerCase();

    const passwordMatches =
      form.password === savedUser.password;

    if (!emailMatches || !passwordMatches) {
      setError("Email or password is incorrect.");
      return;
    }

    // Remove the password before storing the logged-in profile
    const { password, ...loggedInUser } = savedUser;

    localStorage.setItem(
      "userProfile",
      JSON.stringify(loggedInUser)
    );

    localStorage.setItem("isLoggedIn", "true");

    navigate("/");
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6 overflow-auto">
      {/* Fixed 1000 x 680 box */}
      <div className="w-[1000px] h-[680px] shrink-0 rounded-xl overflow-hidden border-2 border-[#468432] bg-white shadow-2xl">
        <div className="grid grid-cols-2 h-full">
          {/* Left Image */}
          <div
            className="bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://admin.sriboga.com/storage/news/1685519127-chef-preparing-food-ingredients-2021-09-24-03-57-22-utc%20(1).webp')",
            }}
          />

          {/* Right Side */}
          <div className="flex items-center justify-center bg-white px-10">
            <div className="w-full max-w-md">
              <h1 className="text-4xl font-bold text-center">
                Welcome to JongKran
              </h1>

              <p className="text-center text-gray-500 mt-2">
                Please enter your details to log in.
              </p>

              {successMessage && (
                <p className="mt-5 bg-green-100 text-green-700 px-4 py-3 rounded-md text-sm">
                  {successMessage}
                </p>
              )}

              {error && (
                <p className="mt-5 bg-red-100 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </p>
              )}

              <form onSubmit={handleLogin} className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#468432]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#468432]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#468432] hover:bg-[#1A5C05] text-white py-3 rounded-lg font-semibold transition"
                >
                  Log In
                </button>
              </form>

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