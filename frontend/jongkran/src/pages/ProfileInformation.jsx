import Header from "../components/Header";
import Footer from "../components/Footer";
import { Camera, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_PROFILE = {
  username: "User",
  email: "",
  gender: "",
  dob: "",
  age: null,
  bio: "",
  profileImage: null,
  memberSince: new Date().toISOString(),
};

export default function ProfileInformation() {
  const navigate = useNavigate();

  const getSavedProfile = () => {
    try {
      const savedProfile =
        JSON.parse(localStorage.getItem("userProfile")) || {};

      const registeredUser =
        JSON.parse(localStorage.getItem("registeredUser")) || {};

      /*
       * userProfile is the main source.
       * registeredUser is used only when profile data has not been saved yet.
       */
      return {
        ...DEFAULT_PROFILE,

        username:
          savedProfile.username ??
          registeredUser.username ??
          DEFAULT_PROFILE.username,

        email:
          savedProfile.email ??
          registeredUser.email ??
          "",

        gender:
          savedProfile.gender ??
          registeredUser.gender ??
          "",

        dob:
          savedProfile.dob ??
          registeredUser.dob ??
          "",

        age:
          savedProfile.age ??
          registeredUser.age ??
          null,

        bio:
          savedProfile.bio ??
          registeredUser.bio ??
          "",

        profileImage:
          savedProfile.profileImage ??
          registeredUser.profileImage ??
          null,

        memberSince:
          savedProfile.memberSince ??
          registeredUser.memberSince ??
          DEFAULT_PROFILE.memberSince,
      };
    } catch (error) {
      console.error("Could not load profile:", error);
      return DEFAULT_PROFILE;
    }
  };

  const [form, setForm] = useState(getSavedProfile);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  /*
   * Keep this page synchronized if userProfile changes
   * in another tab or from another mounted component.
   */
  useEffect(() => {
    const reloadProfile = (event) => {
      if (event?.detail) {
        setForm((current) => ({
          ...current,
          ...event.detail,
        }));
        return;
      }

      setForm(getSavedProfile());
    };

    window.addEventListener("storage", reloadProfile);
    window.addEventListener("profile-updated", reloadProfile);

    return () => {
      window.removeEventListener("storage", reloadProfile);
      window.removeEventListener(
        "profile-updated",
        reloadProfile
      );
    };
  }, []);

  const calculateAge = (dob) => {
    if (!dob) return "";

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

  const username =
    form.username?.trim() || "User";

  const firstLetter =
    username.charAt(0).toUpperCase();

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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

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

    const cleanUsername = form.username.trim();
    const cleanEmail = form.email.trim().toLowerCase();
    const cleanBio = form.bio?.trim() || "";

    if (!cleanUsername) {
      setError("Username cannot be empty.");
      return;
    }

    if (!cleanEmail) {
      setError("Email cannot be empty.");
      return;
    }

    if (!cleanEmail.endsWith("@gmail.com")) {
      setError("Please enter a valid Gmail address.");
      return;
    }

    if (form.dob && age === "") {
      setError("Please select a valid date of birth.");
      return;
    }

    const updatedProfile = {
      username: cleanUsername,
      email: cleanEmail,
      gender: form.gender || null,
      dob: form.dob || null,
      age: age === "" ? null : age,
      bio: cleanBio || null,
      profileImage: form.profileImage || null,
      memberSince:
        form.memberSince || new Date().toISOString(),
    };

    try {
      /*
       * Save the shared profile object used by:
       * - Header
       * - AdminHeader
       * - UserProfile
       * - ProfileInformation
       */
      localStorage.setItem(
        "userProfile",
        JSON.stringify(updatedProfile)
      );

      /*
       * Keep registeredUser synchronized so the edited
       * information remains after logout and login.
       */
      const registeredUser =
        JSON.parse(localStorage.getItem("registeredUser")) || {};

      localStorage.setItem(
        "registeredUser",
        JSON.stringify({
          ...registeredUser,
          ...updatedProfile,
          password: registeredUser.password,
        })
      );

      setForm(updatedProfile);
      setSuccess("Profile updated successfully.");

      /*
       * Immediately update every profile location
       * in the same browser tab.
       */
      window.dispatchEvent(
        new CustomEvent("profile-updated", {
          detail: updatedProfile,
        })
      );

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
          {/* Same profile data shown in Header and UserProfile */}
          <div className="flex flex-col items-center text-center">
            {form.profileImage ? (
              <img
                src={form.profileImage}
                alt={username}
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-[#468432] text-white flex items-center justify-center text-5xl font-bold">
                {firstLetter}
              </div>
            )}

            <h2 className="title-font text-2xl font-bold mt-4">
              {username}
            </h2>

            {form.bio ? (
              <p className="text-gray-500 mt-2">
                {form.bio}
              </p>
            ) : (
              <p className="text-gray-400 mt-2">
                No bio yet
              </p>
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

            {/* Gender replaces Phone Number */}
            <div>
              <label className="block font-semibold mb-2">
                Gender
              </label>

              <select
                name="gender"
                value={form.gender || ""}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-[#468432]"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">
                  Prefer not to say
                </option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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