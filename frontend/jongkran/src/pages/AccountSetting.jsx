import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Bell,
  ChevronRight,
  Globe,
  Lock,
  Shield,
  Trash2,
} from "lucide-react";

export default function AccountSetting() {
  return (
    <>
      <Header />

      <main className="mx-[25px] md:mx-auto max-w-2xl py-12">

        <h1 className="title-font text-3xl font-bold mb-8">
          Account Settings
        </h1>

        <div className="space-y-4">

          <button className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl px-5 py-4 flex justify-between items-center">
            <span className="flex items-center gap-4">
              <span className="bg-[#468432] text-white p-2 rounded-md">
                <Lock size={18} />
              </span>

              Change Password
            </span>

            <ChevronRight size={20} />
          </button>

          <button className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl px-5 py-4 flex justify-between items-center">
            <span className="flex items-center gap-4">
              <span className="bg-[#468432] text-white p-2 rounded-md">
                <Bell size={18} />
              </span>

              Notification Settings
            </span>

            <ChevronRight size={20} />
          </button>

          <button className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl px-5 py-4 flex justify-between items-center">
            <span className="flex items-center gap-4">
              <span className="bg-[#468432] text-white p-2 rounded-md">
                <Globe size={18} />
              </span>

              Language
            </span>

            <ChevronRight size={20} />
          </button>

          <button className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl px-5 py-4 flex justify-between items-center">
            <span className="flex items-center gap-4">
              <span className="bg-[#468432] text-white p-2 rounded-md">
                <Shield size={18} />
              </span>

              Privacy Policy
            </span>

            <ChevronRight size={20} />
          </button>

          <button className="w-full bg-red-100 hover:bg-red-200 text-red-600 rounded-xl px-5 py-4 flex items-center justify-center gap-3 font-semibold">
            <Trash2 size={20} />
            Delete Account
          </button>

        </div>

      </main>

      <Footer />
    </>
  );
}