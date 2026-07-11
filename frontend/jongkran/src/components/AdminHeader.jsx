import { Link, NavLink } from "react-router-dom";
import { Menu, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import logo from '../assets/logo.png';


export default function AdminHeader() {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Recipe", path: "/admin" },
    { name: "Suggestions", path: "/admin/suggestions" },
    { name: "AI Gnerate", path: "/admin/pending-approve" },
  ];

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
                isActive ? "text-[#468432]" : "text-black hover:text-[#468432]"
              }
            >
              {link.name}
            </NavLink>
          ))}

          <Link to="/profile">
            <LayoutDashboard size={22} className="hover:text-[#468432]" />
          </Link>
        </nav>

        <button onClick={() => setOpen(!open)} className="md:hidden">
          <Menu size={28} />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 px-[25px] py-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setOpen(false)}
              className="block text-sm font-semibold hover:text-[#468432]"
            >
              {link.name}
            </Link>
          ))}
          
          
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="block text-sm font-semibold hover:text-[#468432]"
          >
            Back to Site
          </Link>
        </div>
      )}
    </header>
  );
}