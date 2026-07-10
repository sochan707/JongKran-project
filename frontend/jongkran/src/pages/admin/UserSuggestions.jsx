import { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import { Search, User } from "lucide-react";

export default function UserSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [input, setInput] = useState("");

  const suggestionsPerPage = 10;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("suggestions")) || [];
    // newest first
    const sorted = [...saved].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setSuggestions(sorted);
  }, []);

  const filteredSuggestions = suggestions.filter((s) => {
    const searchText = input.toLowerCase().trim();
    const name = (s.userName || "").toLowerCase();
    const recipeName = (s.recipeName || "").toLowerCase();
    const message = (s.message || "").toLowerCase();

    return (
      name.includes(searchText) ||
      recipeName.includes(searchText) ||
      message.includes(searchText)
    );
  });

  const total = suggestions.length;

  const totalPages = Math.ceil(filteredSuggestions.length / suggestionsPerPage);
  const startIndex = (currentPage - 1) * suggestionsPerPage;
  const currentSuggestions = filteredSuggestions.slice(
    startIndex,
    startIndex + suggestionsPerPage
  );

  const goPrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const deleteSuggestion = (id) => {
    const updated = suggestions.filter((s) => s.id !== id);
    setSuggestions(updated);
    localStorage.setItem("suggestions", JSON.stringify(updated));

    if (currentSuggestions.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <AdminHeader />

      <div className="bg-gray-100 min-h-screen pl-10 pr-10 rounded-xl pt-5 pb-10">
        <main className="mx-[25px] py-2">
          <h1 className="title-font text-3xl sm:text-4xl lg:text-5xl font-bold">
            User Suggestions
          </h1>

          <p className="mt-3 mb-5 text-gray-600">
            View feedback and suggestions submitted by users after cooking.
          </p>
        </main>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 text-lg sm:text-xl font-semibold">
              Total Suggestions
            </p>
            <h2 className="text-gray-800 text-3xl sm:text-5xl font-bold ml-3 mt-5">
              {total}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow mt-5 mb-10">
          <div className="grid lg:grid-cols-2 gap-8 mt-2">
            <div className="p-4 text-2xl border-b font-semibold pl-10 items-center">
              Suggestion List
            </div>

            <div className="flex justify-end items-center pr-10">
              <div className="relative w-[450px]">
                <Search className="absolute left-4 top-4 text-black" size={18} />
                <input
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by name, recipe, or message..."
                  className="w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 pl-10 focus:outline-none focus:ring-1 focus:ring-[#468432]"
                />
              </div>
            </div>
          </div>

          {/* Facebook-style comment list */}
          <div className="px-6 md:px-10 pb-6 space-y-4">
            {currentSuggestions.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                No suggestions found.
              </p>
            ) : (
              currentSuggestions.map((s) => (
                <div
                  key={s.id}
                  className="border border-gray-200 rounded-2xl p-4 flex gap-4"
                >
                  {/* Avatar */}
                  {s.userImage ? (
                    <img
                      src={s.userImage}
                      alt={s.userName}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#468432] text-white flex items-center justify-center flex-shrink-0">
                      <User size={22} />
                    </div>
                  )}

                  {/* Comment bubble */}
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <p className="font-semibold">
                        {s.userName || "Anonymous"}
                      </p>
                      <p className="text-gray-700 mt-1 leading-6">
                        {s.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-2 ml-2 text-xs text-gray-500">
                      <span>{formatDate(s.createdAt)}</span>
                      <span>
                        on{" "}
                        <span className="font-medium text-[#468432]">
                          {s.recipeName}
                        </span>
                      </span>
                      <button
                        onClick={() => deleteSuggestion(s.id)}
                        className="text-red-600 font-semibold hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-end gap-4 p-4">
            <button
              onClick={goPrevious}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border disabled:opacity-40"
            >
              ←
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              onClick={goNext}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 rounded border disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}