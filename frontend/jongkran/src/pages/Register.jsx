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

    if (!form.email.includes("@gmail.com")) {
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
      setError("Please agree to the terms first.");
      return;
    }

    const userProfile = {
      fullname: form.username,
      email: form.email,
    };

    localStorage.setItem(
      "userProfile",
      JSON.stringify(userProfile)
    );

    navigate("/login");
  };

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
                Create Account
              </h1>

              <p className="text-center text-gray-500 mt-2">
                Create your account to start cooking with us.
              </p>

              {/* Form */}
              {error && (
              <p className="mt-5 bg-red-100 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </p>
              )}

              <form onSubmit={handleCreateAccount} className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Username
                  </label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full bg-gray-100 rounded-md px-4 py-3 outline-none"
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
                    className="w-full bg-gray-100 rounded-md px-4 py-3 outline-none"
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
                    type="password"
                    placeholder="Enter your password"
                    className="w-full bg-gray-100 rounded-md px-4 py-3 outline-none"
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
                    className="w-full bg-gray-100 rounded-md px-4 py-3 outline-none"
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
                  onClick={() => navigate("/login")}
                  className="w-full bg-[#468432] hover:bg-[#1A5C05] text-white py-3 rounded-md font-semibold"
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