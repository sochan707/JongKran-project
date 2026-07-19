import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Bell,
  BookOpen,
  HelpCircle,
  Lock,
  LogOut,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession } from "../lib/api";

const DEFAULT_PROFILE = {
  username: "User",
  email: "",
  bio: null,
  profileImage: null,
};

export default function UserProfile() {
  const navigate = useNavigate();

  const [userProfile, setUserProfile] =
    useState(DEFAULT_PROFILE);

  useEffect(() => {
    const loadProfile = (event) => {
      try {
        // Use event data immediately when ProfileInformation saves.
        if (event?.detail) {
          setUserProfile({
            ...DEFAULT_PROFILE,
            ...event.detail,
          });
          return;
        }

        const savedProfile =
          localStorage.getItem("userProfile");

        if (!savedProfile) {
          setUserProfile(DEFAULT_PROFILE);
          return;
        }

        setUserProfile({
          ...DEFAULT_PROFILE,
          ...JSON.parse(savedProfile),
        });
      } catch (error) {
        console.error("Could not load user profile:", error);
        setUserProfile(DEFAULT_PROFILE);
      }
    };

    const loggedIn =
      localStorage.getItem("isLoggedIn") === "true";

    if (!loggedIn) {
      navigate("/login", { replace: true });
      return;
    }

    loadProfile();

    window.addEventListener("storage", loadProfile);
    window.addEventListener(
      "profile-updated",
      loadProfile
    );

    return () => {
      window.removeEventListener("storage", loadProfile);
      window.removeEventListener(
        "profile-updated",
        loadProfile
      );
    };
  }, [navigate]);

  const username =
    userProfile?.username?.trim() || "User";

  const firstLetter =
    username.charAt(0).toUpperCase();

  const items = [
    {
      icon: User,
      name: "Personal Information",
      path: "/ProfileInformation",
    },
    {
      icon: BookOpen,
      name: "Recipes History",
      path: "/history",
    },
    {
      icon: Bell,
      name: "Account Setting",
      path: "/AccountSetting",
    },
    {
      icon: Lock,
      name: "Favorite Recipes",
      path: "/favorite",
    },
    {
      icon: HelpCircle,
      name: "Help & Support",
    },
  ];

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Header />

      <main className="mx-[25px] py-6 max-w-2xl md:mx-auto">
        <div className="border-2 border-[#468432] rounded-xl p-6">
          <div className="text-center">
            {userProfile?.profileImage ? (
              <img
                src={userProfile.profileImage}
                alt={username}
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto bg-[#468432] text-white flex items-center justify-center text-5xl font-bold">
                {firstLetter}
              </div>
            )}

            <h1 className="title-font text-3xl font-bold mt-5">
              {username}
            </h1>

            {userProfile?.bio ? (
              <p className="text-gray-500 mt-2">
                {userProfile.bio}
              </p>
            ) : (
              <p className="text-gray-400 mt-2">
                No bio yet
              </p>
            )}
          </div>

          <h2 className="title-font text-2xl font-bold mt-5">
            Account Settings
          </h2>

          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                  }
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 rounded-xl px-5 py-4 flex items-center justify-between"
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
          type="button"
          onClick={handleLogout}
          className="w-full mt-10 bg-red-100 hover:bg-red-200 text-red-500 py-4 rounded-xl font-bold flex justify-center items-center gap-3"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </main>

      <Footer />
    </>
  );
}