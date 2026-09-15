import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, UserCircle } from "lucide-react";
import logo from "../../assets/logo.png";
import useUserProfile from "../../hooks/useUserProfile";

function ProfileLink({
  isLoggedIn,
  userImage,
  userName,
  firstLetter,
  mobile = false,
  onNavigate,
}) {
  return (
    <Link
      to={isLoggedIn ? "/profile" : "/login"}
      onClick={onNavigate}
      className={
        mobile
          ? "flex items-center gap-3 text-sm font-semibold hover:text-[#468432]"
          : "flex items-center"
      }
    >
      {isLoggedIn ? (
        userImage ? (
          <img
            src={userImage}
            alt={userName}
            className={
              mobile
                ? "w-9 h-9 rounded-full object-cover border border-gray-300"
                : "w-10 h-10 rounded-full object-cover border border-gray-300 hover:border-[#468432]"
            }
          />
        ) : (
          <span
            className={
              mobile
                ? "w-9 h-9 rounded-full bg-[#468432] text-white flex items-center justify-center font-bold"
                : "w-10 h-10 rounded-full bg-[#468432] text-white flex items-center justify-center font-bold text-lg hover:bg-[#1A5C05]"
            }
          >
            {firstLetter}
          </span>
        )
      ) : (
        <UserCircle size={mobile ? 24 : 28} className="hover:text-[#468432]" />
      )}

      {mobile && <span>{isLoggedIn ? userName : "Log In"}</span>}
    </Link>
  );
}

export default function AppHeader({ homePath, links }) {
  const [open, setOpen] = useState(false);
  const { profile: userProfile, isLoggedIn } = useUserProfile();
  const userName = userProfile?.username?.trim() || "User";
  const userImage = userProfile?.profileImage || "";
  const firstLetter = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-[25px] flex h-16 items-center justify-between">
        <Link to={homePath} className="flex items-center gap-2">
          <img
            src={logo}
            alt="JongKran Logo"
            className="h-14 w-14 object-contain"
            width="56"
            height="56"
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
              end={link.end}
              className={({ isActive }) =>
                isActive
                  ? "text-[#468432]"
                  : "text-black hover:text-[#468432]"
              }
            >
              {link.name}
            </NavLink>
          ))}

          <ProfileLink
            isLoggedIn={isLoggedIn}
            userImage={userImage}
            userName={userName}
            firstLetter={firstLetter}
          />
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
              end={link.end}
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

          <ProfileLink
            isLoggedIn={isLoggedIn}
            userImage={userImage}
            userName={userName}
            firstLetter={firstLetter}
            onNavigate={() => setOpen(false)}
            mobile
          />
        </div>
      )}
    </header>
  );
}
