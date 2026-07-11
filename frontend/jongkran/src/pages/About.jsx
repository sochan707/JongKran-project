import Header from "../components/Header";
import Footer from "../components/Footer";
import logo from '../assets/logo.png';



export default function About() {
  return (
    <>
      <Header />

      <main>
        <section className="mx-[25px] py-6">
          <h1 className="title-font text-4xl md:text-4xl font-bold">
            About JongKran
          </h1>

          <div className="grid md:grid-cols-2 gap-10 items-center mt-10 ">
            <div className="text-center">
              <img 
                src={logo} 
                alt="JongKran Logo" 
                className="mx-auto h-64 object-contain w-[400px] md:w-[500px] lg:w-[600px]"

              />
            </div>

            <div>
              <h2 className="title-font text-3xl font-bold">
                What is JongKran?
              </h2>

              <p className="mt-5 leading-8">
                JongKran is a smart cooking recommendation system created to help users discover what they can cook using the ingredients they already have at home. By entering available ingredients, users can quickly find suitable recipes, check which ingredients are missing, follow clear cooking instructions, and save their favorite meals for later. JongKran makes meal planning easier and more convenient, especially for students, busy workers, beginner cooks, and families, while also helping reduce food waste and unnecessary spending.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-black text-white px-[25px] py-12">
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <div className="bg-[#242424] rounded-xl p-8">
              <h2 className="title-font text-3xl font-bold">Why JongKran?</h2>
              <p className="mt-4 leading-8">
                Many people struggle to decide what to cook or forget important ingredients. JongKran simplifies meal planning by recommending suitable recipes and identifying missing ingredients, helping users save time and reduce food waste.
              </p>
            </div>

            <div className="bg-[#242424] rounded-xl p-8">
              <h2 className="title-font text-3xl font-bold">Our Mission</h2>
              <p className="mt-4 leading-8">
                To make home cooking easier, smarter, and more sustainable by helping people turn the ingredients they already have into delicious, low-waste meals, saving time, money, and reducing food waste along the way.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}