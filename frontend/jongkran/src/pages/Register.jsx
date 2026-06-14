import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

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

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!form.email.includes("@") || !form.email.includes(".")) {
      setError("Please enter a valid email.");
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
      setError("Please agree to the terms first.");
      return;
    }

    navigate("/login");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white md:bg-gray-100">
      <div className="grid md:grid-cols-2 w-full max-w-7xl min-h-screen md:min-h-[875px]">
        <div className="hidden md:block bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e')] bg-cover bg-center" />

        <div className="flex items-center justify-center p-[25px]">
          <div className="w-full md:w-[740px] md:h-[750px] bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center">
            <h1 className="title-font text-4xl font-bold text-center">
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

            <form onSubmit={handleCreateAccount} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Username
                </label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full bg-gray-200 rounded-md px-4 py-3 outline-none"
                  placeholder="Username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Email Address
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-gray-200 rounded-md px-4 py-3 outline-none"
                  placeholder="Email Address"
                  type="email"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Password
                </label>
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-gray-200 rounded-md px-4 py-3 outline-none"
                  placeholder="Password"
                  type="password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-gray-200 rounded-md px-4 py-3 outline-none"
                  placeholder="Confirm Password"
                  type="password"
                />
              </div>

              <label className="flex gap-2 text-sm items-start">
                <input
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  type="checkbox"
                  className="mt-1"
                />
                <span>I agree to Terms of Service and Privacy Policy</span>
              </label>

              <button
                type="submit"
                className="w-full bg-[#468432] hover:bg-[#1A5C05] text-white py-3 rounded-md font-semibold"
              >
                Create Account
              </button>
            </form>

            <div className="flex justify-center gap-2 mt-6 text-sm">
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
    </main>
  );
}