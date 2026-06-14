import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeCart from "../components/RecipeCart";
import Hero from "../components/ui/homescreen/hero";
import aboutImage from '../assets/about.png';


const recipes = [
  {
    id: 1,
    name: "Hoisin Garlic Noodles",
    image: "https://images.unsplash.com/photo-1552611052-33e04de081de",
    time: 20,
    servings: 2,
  },
  {
    id: 2,
    name: "Nom Banh Jok",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624",
    time: 25,
    servings: 2,
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <section className="min-h-[520px] ">
          <Hero />
        </section>

        <section className="mx-[25px] py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="title-font text-3xl font-bold">Explore by meal</h2>
              <p className="text-gray-600">Find exactly what you are craving.</p>
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
              <img
                key={index}
                src={img}
                className="rounded-xl h-48 md:h-72 w-full object-cover"
              />
            ))}
          </div>
        </section>

        <section className="mx-[25px] py-12">
          <h2 className="title-font text-3xl  font-bold mb-6">
            Popular This Week
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            {recipes.map((recipe) => (
              <RecipeCart key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>

        <section className="mx-[25px] py-12">
          <h2 className="title-font text-3xl font-bold mb-6">About JongKran</h2>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <img
                src={aboutImage}
                alt="About JongKran"
                className="rounded-xl w-full h-[420px] object-cover"
              />
              <p className="text-base leading-8">
                JongKran was created from a simple idea: everyone should feel
                confident cooking at home. Our system recommends recipes based on
                available ingredients and helps reduce food waste.
              </p>
            </div>

        </section>
      </main>

      <Footer />
    </>
  );
}