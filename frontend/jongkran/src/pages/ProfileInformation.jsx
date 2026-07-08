import Header from "../components/Header";
import Footer from "../components/Footer";
import defaultProfile from "../assets/profile.png";
import { Camera, Save } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileInformation() {
  const navigate = useNavigate();

  // Controlled state
  const [fullName, setFullName] = useState("Phea Sreynith");
  const [email, setEmail] = useState("sreynith@gmail.com");
  const [phone, setPhone] = useState("+855 12 345 678");
  const [bio, setBio] = useState("I love being single.");
  const [photo, setPhoto] = useState(defaultProfile);

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); // base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedProfile = { fullName, email, phone, bio, photo };
    localStorage.setItem("profile", JSON.stringify(updatedProfile));
    navigate("/profile");
  };

  return (
    <>
      <Header />
      <main className="mx-[25px] md:mx-auto max-w-2xl py-12">
        <h1 className="title-font text-3xl font-bold mb-8">Profile Information</h1>

        <div className="bg-white rounded-2xl shadow-md p-8">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <img src={photo} alt="Profile" className="w-32 h-32 rounded-full object-cover" />

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              id="photoUpload"
              className="hidden"
              onChange={handlePhotoChange}
            />

            <label
              htmlFor="photoUpload"
              className="mt-4 flex items-center gap-2 text-[#468432] font-semibold hover:underline cursor-pointer"
            >
              <Camera size={18} /> Change Photo
            </label>
          </div>

          {/* Form */}
          <div className="mt-10 space-y-6">
            <div>
              <label className="block font-semibold mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#468432]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#468432]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#468432]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Bio</label>
              <textarea
                rows="4"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 resize-none focus:ring-2 focus:ring-[#468432]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Member Since</label>
              <input
                type="text"
                value="July 2026"
                readOnly
                className="w-full bg-gray-100 border rounded-xl px-4 py-3"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-[#468432] hover:bg-[#3b6d2b] text-white rounded-xl py-3 font-semibold flex justify-center items-center gap-2"
            >
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
