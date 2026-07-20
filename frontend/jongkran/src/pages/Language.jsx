import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AdminHeader from "../components/AdminHeader";
import Footer from "../components/Footer";

export default function Language({ adminMode = false }) {

  const navigate = useNavigate();
  const [language, setLanguage] = useState("English");
  const [showModal, setShowModal] = useState(false);

  const handleSave = () => {
    if (language === "Khmer") {
      setShowModal(true);
      return;
    }

    navigate(adminMode ? "/admin/account-setting" : "/AccountSetting");
  };

  return (
    <>
      {adminMode ? <AdminHeader /> : <Header />}

      <main className="mx-[25px] md:mx-auto max-w-2xl py-12">

        <h1 className="title-font text-3xl mb-8 font-bold">
          Language
        </h1>

        <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">

          <div>
            <label className="font-semibold">
              Select Language
            </label>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mt-2"
            >
              <option>English</option>
              <option>Khmer</option>
            </select>
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

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center space-y-4">
            <h2 className="text-xl font-semibold">Coming Soon</h2>
            <p className="text-gray-600">
              Khmer language support is not available yet. Please check back later.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-[#468432] text-white rounded-xl py-3 font-semibold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
