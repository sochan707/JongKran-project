import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AdminHeader from "../components/AdminHeader";
import Footer from "../components/Footer";

export default function ChangePassword({ adminMode = false }) {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null); // { type: "error", text: string }

  const handleSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    navigate(adminMode ? "/admin/account-setting" : "/AccountSetting");
  };

  return (
    <>
      {adminMode ? <AdminHeader /> : <Header />}

      <main className="mx-[25px] md:mx-auto max-w-2xl py-12">
        <h1 className="title-font text-3xl mb-8 font-bold">
          Change Password
        </h1>

        <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">

          {message && (
            <div className="rounded-xl px-4 py-3 text-sm font-medium bg-red-50 text-red-700 border border-red-200">
              {message.text}
            </div>
          )}

          <div>
            <label className="font-semibold">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mt-2"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-[#468432] text-white rounded-xl py-3 font-semibold"
          >
            Save Changes
          </button>

        </div>
      </main>

      {!adminMode && <Footer />}
    </>
  );
}
