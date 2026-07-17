import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiRequest } from "../lib/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.username.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!form.email.toLowerCase().endsWith("@gmail.com")) {
      setError("Please enter a valid Gmail address.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    if (!form.agree) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          user_name: form.username.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });
      navigate("/login", { state: { message: "Account created successfully. Please log in." } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
                Create Account
              </h1>

              <p className="text-center text-gray-500 mt-2">
                Create your account to start cooking with us.
              </p>

              {error && (
                <p className="mt-5 bg-red-100 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </p>
              )}

              <form
                onSubmit={handleCreateAccount}
                className="mt-5 space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Username
                  </label>

                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="w-full bg-gray-100 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-[#468432]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full bg-gray-100 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-[#468432]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full bg-gray-100 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-[#468432]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full bg-gray-100 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-[#468432]"
                  />
                </div>

                <label className="flex gap-2 text-sm items-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={form.agree}
                    onChange={handleChange}
                    className="mt-1 accent-[#468432]"
                  />

                  <span>
                    I agree to Terms of Service and Privacy Policy
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full bg-[#468432] hover:bg-[#1A5C05] text-white py-3 rounded-md font-semibold transition"
                >
                  Create Account
                </button>
              </form>

              <div className="flex justify-center gap-2 mt-4 text-sm">
                <span>Already have an account?</span>

                <Link
                  to="/login"
                  className="text-[#468432] font-bold hover:text-[#1A5C05]"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
