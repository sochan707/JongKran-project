import { Link } from "react-router-dom";
import hero from "../../../assets/hero.png";

const Hero = () => {
  return (
    <section
      className="min-h-[480px] bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url(${hero})` }}
    >
      <div className="min-h-[480px] w-full bg-white/70 flex items-center">
        <div className="w-full px-8">
          <div className="max-w-2xl">
            <h1 className="page-title text-2xl md:text-4xl font-bold">
              What recipe is waiting in your <br />
              kitchen today?
            </h1>

            <p className="mt-5 text-base md:text-xl">
              JongKran helps users discover recipes based on ingredients they
              already have, making cooking easier, faster, and smarter.
            </p>

            <Link
              to="/input-ingredients"
              className="inline-block mt-8 bg-[#468432] hover:bg-[#1A5C05] text-white px-16 py-3 rounded-md font-semibold transition"
            >
              Start Cooking
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
