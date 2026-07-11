import Header from "../components/Header";
import Footer from "../components/Footer";
import { Camera, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileInformation() {
  const navigate = useNavigate();

  const getSavedProfile = () => {
    try {
      const registeredUser =
        JSON.parse(localStorage.getItem("registeredUser")) || {};

      const userProfile =
        JSON.parse(localStorage.getItem("userProfile")) || {};

      return {
        // Get these values from registration
        username:
          userProfile.username ??
          registeredUser.username ??
          "",

        email:
          userProfile.email ??
          registeredUser.email ??
          "",

        // These values will be empty until the user fills them
        phone:
          userProfile.phone ??
          registeredUser.phone ??
          "",

        dob:
          userProfile.dob ??
          registeredUser.dob ??
          "",

        bio:
          userProfile.bio ??
          registeredUser.bio ??
          "",

        profileImage:
          userProfile.profileImage ??
          registeredUser.profileImage ??
          null,

        memberSince:
          userProfile.memberSince ??
          registeredUser.memberSince ??
          new Date().toISOString(),
      };
    } catch (error) {
      console.error("Could not load profile:", error);

      return {
        username: "",
        email: "",
        phone: "",
        dob: "",
        bio: "",
        profileImage: null,
        memberSince: new Date().toISOString(),
      };
    }
  };

  const [form, setForm] = useState(getSavedProfile);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const calculateAge = (dob) => {
    if (!dob) {
      return "";
    }

    const birthDate = new Date(`${dob}T00:00:00`);
    const today = new Date();

    if (
      Number.isNaN(birthDate.getTime()) ||
      birthDate > today
    ) {
      return "";
    }

    let calculatedAge =
      today.getFullYear() - birthDate.getFullYear();

    const monthDifference =
      today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      calculatedAge--;
    }

    return calculatedAge;
  };

  const age = calculateAge(form.dob);

  const firstLetter =
    form.username?.trim().charAt(0).toUpperCase() || "U";

  const formattedMemberSince = (() => {
    const date = new Date(form.memberSince);

    if (Number.isNaN(date.getTime())) {
      return "Unknown";
    }

    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  })();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    // LocalStorage is small, so prevent very large images
    if (file.size > 2 * 1024 * 1024) {
      setError("Profile image must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((previousForm) => ({
        ...previousForm,
        profileImage: reader.result,
      }));

      setError("");
      setSuccess("");
    };

    reader.onerror = () => {
      setError("Could not read the selected image.");
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setForm((previousForm) => ({
      ...previousForm,
      profileImage: null,
    }));

    setError("");
    setSuccess("");
  };

  const handleSave = () => {
    setError("");
    setSuccess("");

    const username = form.username.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    const bio = form.bio.trim();

    if (!username) {
      setError("Username cannot be empty.");
      return;
    }

    if (!email) {
      setError("Email cannot be empty.");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      setError("Please enter a valid Gmail address.");
      return;
    }

    if (form.dob && !age && age !== 0) {
      setError("Please select a valid date of birth.");
      return;
    }

    const updatedProfile = {
      username,
      email,
      phone: phone || null,
      dob: form.dob || null,
      age: age === "" ? null : age,
      bio: bio || null,
      profileImage: form.profileImage || null,
      memberSince: form.memberSince,
    };

    try {
      // Save information for the current login session
      localStorage.setItem(
        "userProfile",
        JSON.stringify(updatedProfile)
      );

      // Also update the registered account
      // This keeps the information after logout and login
      const registeredUser =
        JSON.parse(localStorage.getItem("registeredUser")) || {};

      const updatedRegisteredUser = {
        ...registeredUser,
        ...updatedProfile,

        // Keep the registered password
        password: registeredUser.password,
      };

      localStorage.setItem(
        "registeredUser",
        JSON.stringify(updatedRegisteredUser)
      );

      setForm(updatedProfile);
      setSuccess("Profile updated successfully.");

      // Go back after saving
      navigate("/profile");
    } catch (error) {
      console.error("Could not save profile:", error);
      setError("Could not save your profile. Please try again.");
    }
  };

  return (
    <>
      <Header />

      <main className="mx-[25px] md:mx-auto max-w-2xl py-6">
        <h1 className="title-font text-3xl font-bold mb-8">
          Profile Information
        </h1>

        <div className="bg-white rounded-2xl shadow-md p-8">
          {/* Profile picture */}
          <div className="flex flex-col items-center">
            {form.profileImage ? (
              <img
                src={form.profileImage}
                alt={form.username || "Profile"}
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-[#468432] text-white flex items-center justify-center text-5xl font-bold">
                {firstLetter}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              id="photoUpload"
              className="hidden"
              onChange={handlePhotoChange}
            />

            <div className="mt-4 flex items-center gap-4">
              <label
                htmlFor="photoUpload"
                className="flex items-center gap-2 text-[#468432] font-semibold hover:underline cursor-pointer"
              >
                <Camera size={18} />
                Change Photo
              </label>

              {form.profileImage && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-red-500 font-semibold hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {error && (
            <p className="mt-6 bg-red-100 text-red-600 px-4 py-3 rounded-xl">
              {error}
            </p>
          )}

          {success && (
            <p className="mt-6 bg-green-100 text-green-700 px-4 py-3 rounded-xl">
              {success}
            </p>
          )}

          <div className="mt-10 space-y-6">
            {/* Loaded from registration */}
            <div>
              <label className="block font-semibold mb-2">
                Username
              </label>

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#468432]"
              />
            </div>

            {/* Loaded from registration */}
            <div>
              <label className="block font-semibold mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#468432]"
              />
            </div>

            {/* Empty until user fills it */}
            <div>
              <label className="block font-semibold mb-2">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#468432]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Empty until user fills it */}
              <div>
                <label className="block font-semibold mb-2">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dob"
                  value={form.dob || ""}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#468432]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Age
                </label>

                <input
                  type="text"
                  value={age}
                  placeholder="Calculated automatically"
                  readOnly
                  className="w-full border rounded-xl px-4 py-3 bg-gray-100 outline-none"
                />
              </div>
            </div>

            {/* Empty until user fills it */}
            <div>
              <label className="block font-semibold mb-2">
                Bio
              </label>

              <textarea
                rows="4"
                name="bio"
                value={form.bio || ""}
                onChange={handleChange}
                maxLength={250}
                placeholder="Tell us something about yourself"
                className="w-full border rounded-xl px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-[#468432]"
              />

              <p className="text-sm text-gray-400 text-right mt-1">
                {(form.bio || "").length}/250
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Member Since
              </label>

              <input
                type="text"
                value={formattedMemberSince}
                readOnly
                className="w-full bg-gray-100 border rounded-xl px-4 py-3 outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="w-full bg-[#468432] hover:bg-[#3b6d2b] text-white rounded-xl py-3 font-semibold flex justify-center items-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}