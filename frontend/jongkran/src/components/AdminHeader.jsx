import { Link, NavLink } from "react-router-dom";
import { Menu, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

export default function AdminHeader() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  const links = [
    { name: "Recipes", path: "/admin" },
    { name: "Suggestions", path: "/admin/suggestions" },
    { name: "AI Approvals", path: "/admin/pending-approve" },
  ];

  useEffect(() => {
    const loadUser = () => {
      try {
        const registeredUser =
          JSON.parse(localStorage.getItem("registeredUser")) || {};

        const userProfile =
          JSON.parse(localStorage.getItem("userProfile")) || {};

        const loggedInUser =
          JSON.parse(localStorage.getItem("currentUser")) || {};

        const currentUser = {
          ...registeredUser,
          ...loggedInUser,
          ...userProfile,
        };

        if (
          currentUser.email ||
          currentUser.username ||
          currentUser.id
        ) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to load admin user:", error);
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener("storage", loadUser);
    window.addEventListener("auth-change", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("auth-change", loadUser);
    };
  }, []);

  const userName =
    user?.username ||
    user?.fullname ||
    user?.fullName ||
    user?.name ||
    "Admin";

  const userImage =
    user?.profileImage ||
    user?.image ||
    user?.avatar ||
    "";

  const firstLetter = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-[25px] flex h-16 items-center justify-between">
        {/* LOGO */}
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

        {/* DESKTOP NAVIGATION */}
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

          {/* ADMIN PROFILE */}
          <Link to="/profile" className="flex items-center">
            {user ? (
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

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="md:hidden"
          aria-label="Open admin navigation menu"
          aria-expanded={open}
        >
          <Menu size={28} />
        </button>
      </div>

      {/* MOBILE NAVIGATION */}
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

          {/* MOBILE ADMIN PROFILE */}
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 text-sm font-semibold hover:text-[#468432]"
          >
            {user ? (
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

            <span>{user ? userName : "Profile"}</span>
          </Link>
        </div>
      )}
    </header>
  );
}