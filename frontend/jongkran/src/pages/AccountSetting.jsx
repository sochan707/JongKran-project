import Header from "../components/Header";
import Footer from "../components/Footer";
import { Lock, Globe, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccountSetting() {
  const navigate = useNavigate();

  const settings = [
    {
      icon: Lock,
      name: "Change Password",
      path: "/ChangePassword",
    },
    {
      icon: Globe,
      name: "Language",
      path: "/Language",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full mx-auto max-w-2xl px-[25px] py-6">
        <h1 className="title-font text-3xl font-bold mb-8">
          Account Settings
        </h1>

        <div className="space-y-4">
          {settings.map((setting) => (
            <button
              key={setting.name}
              onClick={() => navigate(setting.path)}
              className="w-full bg-gray-200 hover:bg-gray-300 rounded-xl px-5 py-4 flex items-center justify-between transition"
            >
              <span className="flex items-center gap-4">
                <span className="bg-[#468432] text-white p-2 rounded-md ">
                  <setting.icon size={18} />
                </span>

                <span className="font-medium">{setting.name}</span>
              </span>

              <ChevronRight size={20} className="text-gray-600 " />
            </button>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}