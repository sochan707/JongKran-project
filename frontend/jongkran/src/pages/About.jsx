import Header from "../components/Header";
import Footer from "../components/Footer";
import logo from '../assets/logo.png';



export default function About() {
  return (
    <>
      <Header />

      <main>
        <section className="mx-[25px] py-12">
          <h1 className="title-font text-4xl md:text-6xl font-bold">
            About JongKran
          </h1>

          <div className="grid md:grid-cols-2 gap-10 items-center mt-10">
            <div className="text-center">
              <img 
                src={logo} 
                alt="JongKran Logo" 
                className="mx-auto h-64 object-contain"

              />
            </div>
          </div>


            <div>
              <h2 className="title-font text-3xl font-bold">
                What is JongKran?
              </h2>

              <p className="mt-5 leading-8">
                JongKran is a smart cooking platform that recommends recipes
                based on the ingredients you already have. Simply enter your
                ingredients and discover meals you can prepare instantly.
              </p>
            </div>
    
        </section>

        <section className="bg-black text-white px-[25px] py-12">
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <div className="bg-[#242424] rounded-xl p-8">
              <h2 className="title-font text-3xl font-bold">Why JongKran?</h2>
              <p className="mt-4 leading-8">
                Many people struggle to decide what to cook or forget important
                ingredients. JongKran simplifies meal planning by recommending
                suitable recipes and helping users save time and reduce food
                waste.
              </p>
            </div>

            <div className="bg-[#242424] rounded-xl p-8">
              <h2 className="title-font text-3xl font-bold">Our Mission</h2>
              <p className="mt-4 leading-8">
                To make home cooking easier, smarter, and more sustainable by
                helping users turn available ingredients into delicious meals.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}