import { Link, NavLink } from "react-router-dom";
import { Menu, UserCircle } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.png";
import useUserProfile from "../hooks/useUserProfile";

export default function AdminHeader() {
  const [open, setOpen] = useState(false);
  const { profile: userProfile, isLoggedIn } = useUserProfile();

  const links = [
    { name: "Recipes", path: "/admin" },
    { name: "Suggestions", path: "/admin/suggestions" },
    { name: "AI Approvals", path: "/admin/pending-approve" },
  ];

  const userName =
    userProfile?.username?.trim() || "User";

  const userImage =
    userProfile?.profileImage || "";

  const firstLetter =
    userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-[25px] flex h-16 items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2">
          <img
            src={logo}
            alt="JongKran Logo"
            className="h-14 w-14 object-contain"
          />

          <span className="title-font text-2xl font-bold text-[#468432]">
            JongKran
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === "/admin"}
              className={({ isActive }) =>
                isActive
                  ? "text-[#468432]"
                  : "text-black hover:text-[#468432]"
              }
            >
              {link.name}
            </NavLink>
          ))}

          <Link
            to={isLoggedIn ? "/admin/profile" : "/login"}
            className="flex items-center"
          >
            {isLoggedIn ? (
              userImage ? (
                <img
                  src={userImage}
                  alt={userName}
                  className="w-10 h-10 rounded-full object-cover border border-gray-300 hover:border-[#468432]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#468432] text-white flex items-center justify-center font-bold text-lg hover:bg-[#1A5C05]">
                  {firstLetter}
                </div>
              )
            ) : (
              <UserCircle
                size={28}
                className="hover:text-[#468432]"
              />
            )}
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="md:hidden"
          aria-label="Open navigation menu"
          aria-expanded={open}
        >
          <Menu size={28} />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 px-[25px] py-4 space-y-3">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === "/admin"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "block text-sm font-semibold text-[#468432]"
                  : "block text-sm font-semibold hover:text-[#468432]"
              }
            >
              {link.name}
            </NavLink>
          ))}

          <Link
            to={isLoggedIn ? "/admin/profile" : "/login"}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 text-sm font-semibold hover:text-[#468432]"
          >
            {isLoggedIn ? (
              userImage ? (
                <img
                  src={userImage}
                  alt={userName}
                  className="w-9 h-9 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#468432] text-white flex items-center justify-center font-bold">
                  {firstLetter}
                </div>
              )
            ) : (
              <UserCircle size={24} />
            )}

            <span>{isLoggedIn ? userName : "Log In"}</span>
          </Link>
        </div>
      )}
    </header>
  );
}
