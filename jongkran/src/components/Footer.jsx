import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#3C842E] text-white px-[25px] py-10">
      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        <div>
          <h3 className="title-font text-xl font-bold">JongKran</h3>
          <p className="text-sm mt-2">
            Smart Recipe Recommendations Based on Available Ingredients
          </p>
        </div>

        <div>
          <h3 className="title-font text-xl font-bold">Contact Us</h3>
          <p className="text-sm mt-2">jongkran.team@gmail.com</p>
        </div>

        <div>
          <h3 className="title-font text-xl font-bold">Quick Links</h3>
          <div className="mt-2 flex flex-col gap-1 text-sm">
            <Link to="/">Home</Link>
            <Link to="/recipes">Menu</Link>
            <Link to="/favorite">Favorite</Link>
            <Link to="/about">About</Link>
            <Link to="/profile">Account</Link>
          </div>
        </div>
      </div>

      <p className="text-center text-xs mt-10">
        © 2026 JongKran Team. All Rights Reserved
      </p>
    </footer>
  );
}