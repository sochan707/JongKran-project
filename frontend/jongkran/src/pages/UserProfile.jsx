import Header from "../components/Header";
import Footer from "../components/Footer";
import { Bell, BookOpen, HelpCircle, Lock, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import profile from '../assets/profile.png';


export default function UserProfile() {
  const navigate = useNavigate();

  const items = [
    { icon: User, name: "Personal Information", path: "/profileinformation" },
    { icon: BookOpen, name: "Recipes History", path: "/history" },
    { icon: Bell, name: "Account Setting", path: "/accountSetting" },
    { icon: Lock, name: "Favorite Recipes", path: "/favorite" },
    { icon: HelpCircle, name: "Help & Support" },
  ];

  return (
    <>
      <Header />

      <main className="mx-[25px] py-12 max-w-2xl md:mx-auto">
        <div className="border-2 border-[#468432] rounded-xl p-6 ">

          <div className="text-center">
            <img
                src={profile}
                alt="Phea Sreynith"
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />


            <h1 className="title-font text-3xl font-bold mt-5">
              Phea Sreynith
            </h1>

            <p className="text-gray-500 mt-2">I love being single</p>
          </div>

          <h2 className="title-font text-2xl font-bold mt-10">
            Account Settings
          </h2>

          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <button
                key={item.name}
                onClick={() => item.path && navigate(item.path)}
                className="w-full  bg-gray-200 hover:bg-gray-300 rounded-xl px-5 py-4 flex items-center justify-between"
              >
                <span className="flex items-center gap-4">
                  <span className="bg-[#468432] text-white p-2 rounded-md">
                    <item.icon size={18} />
                  </span>
                  {item.name}
                </span>

                <span>{">"}</span>
              </button>
            ))}
          </div>

        </div>

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-10 bg-red-100 text-red-500 py-4 rounded-xl font-bold flex justify-center gap-3"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </main>

      <Footer />
    </>
  );
}