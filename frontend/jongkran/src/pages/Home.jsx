import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeGrid from "../components/recipes/RecipeGrid";
import Hero from "../components/ui/homescreen/hero";
import aboutImage from '../assets/about1.png';
import useRecipes from "../hooks/useRecipes";



export default function Home() {
  const { recipes } = useRecipes();
  return (
    <>
      <Header />

      <main>
        <section className="min-h-[520px] ">
          <Hero />
        </section>

        <section className="mx-[25px] py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="title-font text-3xl font-bold mb-2">Explore by meal</h2>
              <p className="text-gray-600">Find exactly what you're craving right now</p>
            </div>

            <Link to="/recipes" className="text-[#468432] font-bold ">
              View all recipes →
            </Link>
          </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
        ].map((img, index) => (
          <div key={index} className="rounded-xl overflow-hidden">
            <img
              src={img}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-32 md:h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>

        </section>

        <section className="mx-[25px] py-12">
          <h2 className="title-font text-3xl  font-bold mb-6">
            Popular This Week
          </h2>

          <RecipeGrid recipes={recipes} className="grid gap-5 md:grid-cols-3" />
        </section>

        <section className="mx-[25px] py-12">
          <h2 className="title-font text-4xl font-bold mb-6">About JongKran</h2>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <img
              src={aboutImage}
              alt="About JongKran"
              loading="lazy"
              decoding="async"
              className="rounded-xl w-full h-[500px] object-cover shadow-md"
            />

            <div className="space-y-5">
              <p className="text-base md:text-xl leading-8 font-normal text-gray-700">
                JongKran was created from a simple idea: everyone should feel confident
                cooking at home. Our name is inspired by the warmth of the kitchen, the
                place where families gather, stories are shared, and meals bring people
                together.
              </p>

              <p className="text-base md:text-xl leading-8 font-normal text-gray-700">
                We make cooking easier for busy home cooks by turning complicated recipes
                into simple, step-by-step experiences. With clear instructions, helpful
                visual guides, and a supportive community, JongKran helps beginners enjoy
                cooking and share food with others.
              </p>
            </div>
          </div>

        </section>
      </main>

      <Footer />
    </>
  );
}
