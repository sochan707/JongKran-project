import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, Trash2, } from "lucide-react";
import AdminHeader from "../../components/AdminHeader";
import recipeData from "../../data/recipes";
import { RECIPE_PLACEHOLDER, handleRecipeImageError, } from "../../lib/recipeImage";


// Get a stable value that identifies a user
const getUserKey = (user) => {
  return String(
    user?.id ||
      user?.userId ||
      user?.email ||
      ""
  );
};

// Get the latest username
const getUserName = (user) => {
  return (
    user?.username ||
    user?.fullname ||
    user?.fullName ||
    user?.name ||
    "Anonymous User"
  );
};

// Get the latest profile picture
const getUserImage = (user) => {
  return (
    user?.profileImage ||
    user?.profilePicture ||
    user?.picture ||
    user?.image ||
    user?.avatar ||
    ""
  );
};

export default function RecipeSuggestionDetail() {
  const navigate = useNavigate();
  const { recipeId } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get recipes created by admin
    const localRecipes =
      JSON.parse(localStorage.getItem("recipes")) || [];

    // Get all user suggestions
    const savedSuggestions =
      JSON.parse(localStorage.getItem("suggestions")) || [];

    // Get all registered users, when available
    const savedUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    // Get original registration information
    const registeredUser =
      JSON.parse(
        localStorage.getItem("registeredUser")
      ) || {};

    // Get the latest profile information
    const userProfile =
      JSON.parse(
        localStorage.getItem("userProfile")
      ) || {};

    // Combine registered information with updated profile
    const currentUser = {
      ...registeredUser,
      ...userProfile,
    };

    // Include the current user in the user list
    const allUsers = [...savedUsers];

    if (getUserKey(currentUser)) {
      const currentUserExists = allUsers.some(
        (user) =>
          getUserKey(user) ===
          getUserKey(currentUser)
      );

      if (currentUserExists) {
        // Replace old account information with latest information
        const currentUserIndex = allUsers.findIndex(
          (user) =>
            getUserKey(user) ===
            getUserKey(currentUser)
        );

        allUsers[currentUserIndex] = {
          ...allUsers[currentUserIndex],
          ...currentUser,
        };
      } else {
        allUsers.push(currentUser);
      }
    }

    // Prepare normal recipes
    const normalRecipes = recipeData.map((item) => ({
      ...item,
      title:
        item.title ||
        item.name ||
        "Untitled Recipe",
    }));

    // Prepare recipes created from recipe management
    const createdRecipes = localRecipes.map((item) => ({
      ...item,
      title:
        item.title ||
        item.name ||
        "Untitled Recipe",
    }));

    const allRecipes = [
      ...normalRecipes,
      ...createdRecipes,
    ];

    // Find the selected recipe
    const selectedRecipe = allRecipes.find(
      (item) =>
        String(item.id) === String(recipeId)
    );

    // Find suggestions belonging to this recipe
    const recipeSuggestions = savedSuggestions
      .filter(
        (suggestion) =>
          String(suggestion.recipeId) ===
          String(recipeId)
      )
      .map((suggestion) => {
        const suggestionUserKey = String(
          suggestion.userId ||
            suggestion.userEmail ||
            ""
        );

        // Find the latest account information
        const matchedUser = allUsers.find((user) => {
          const userId = String(
            user.id || user.userId || ""
          );

          const userEmail = String(
            user.email || ""
          );

          return (
            userId === suggestionUserKey ||
            userEmail === suggestionUserKey ||
            userEmail ===
              String(suggestion.userEmail || "")
          );
        });

        return {
          ...suggestion,

          displayName: matchedUser
            ? getUserName(matchedUser)
            : suggestion.userName ||
              "Anonymous User",

          displayImage: matchedUser
            ? getUserImage(matchedUser)
            : suggestion.userImage || "",
        };
      })
      .sort(
        (first, second) =>
          new Date(second.createdAt) -
          new Date(first.createdAt)
      );

    setRecipe(selectedRecipe || null);
    setSuggestions(recipeSuggestions);
    setLoading(false);
  }, [recipeId]);

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Unknown date";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const deleteSuggestion = (suggestionId) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this suggestion?"
    );

    if (!shouldDelete) {
      return;
    }

    const allSuggestions =
      JSON.parse(
        localStorage.getItem("suggestions")
      ) || [];

    const updatedSuggestions =
      allSuggestions.filter(
        (suggestion) =>
          String(suggestion.id) !==
          String(suggestionId)
      );

    localStorage.setItem(
      "suggestions",
      JSON.stringify(updatedSuggestions)
    );

    setSuggestions((currentSuggestions) =>
      currentSuggestions.filter(
        (suggestion) =>
          String(suggestion.id) !==
          String(suggestionId)
      )
    );
  };

  if (loading) {
    return (
      <>
        <AdminHeader />

        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">
            Loading suggestions...
          </p>
        </div>
      </>
    );
  }

  if (!recipe) {
    return (
      <>
        <AdminHeader />

        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-5 text-center">
          <h1 className="text-3xl font-bold">
            Recipe not found
          </h1>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/suggestions")
            }
            className="mt-5 bg-[#468432] hover:bg-[#1A5C05] text-white px-6 py-3 rounded-lg transition"
          >
            Back to Suggestions
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader />

      <main className="min-h-screen bg-gray-100 px-4 sm:px-10 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Back button */}
          <button
            type="button"
            onClick={() =>
              navigate("/admin/suggestions")
            }
            className="flex items-center gap-2 text-[#468432] font-semibold hover:underline mb-6"
          >
            <ArrowLeft size={20} />
            Back to Recipe List
          </button>

          {/* Recipe information */}
          <section className="bg-white rounded-xl shadow p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <img
                src={recipe.image || RECIPE_PLACEHOLDER}
                alt={recipe.title || "Recipe"}
                onError={handleRecipeImageError}
                className="w-full sm:w-28 h-44 sm:h-28 rounded-xl object-cover"
              />

              <div className="flex-1">
                <h1 className="title-font text-3xl sm:text-4xl font-bold">
                  {recipe.title}
                </h1>

                <div className="flex items-center gap-2 mt-3 text-gray-600">
                  <MessageCircle
                    size={20}
                    className="text-[#468432]"
                  />

                  <span>
                    {suggestions.length}{" "}
                    {suggestions.length === 1
                      ? "suggestion"
                      : "suggestions"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* User suggestions */}
          <section className="mt-6">
            <h2 className="text-2xl font-bold mb-4">
              User Suggestions
            </h2>

            {suggestions.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <MessageCircle
                  size={55}
                  className="mx-auto text-gray-300"
                />

                <h3 className="text-xl font-semibold mt-4">
                  No suggestions yet
                </h3>

                <p className="text-gray-500 mt-2">
                  Users have not submitted suggestions
                  for this recipe.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {suggestions.map((suggestion) => (
                  <article
                    key={suggestion.id}
                    className="flex items-start gap-3 sm:gap-4"
                  >
                    {/* User profile */}
                    {suggestion.displayImage ? (
                      <img
                        src={suggestion.displayImage}
                        alt={suggestion.displayName}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#468432] text-white flex items-center justify-center flex-shrink-0 font-bold text-xl uppercase">
                        {suggestion.displayName
                          ?.trim()
                          .charAt(0) || "U"}
                      </div>
                    )}

                    {/* Suggestion content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 break-words">
                              {suggestion.displayName}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(
                                suggestion.createdAt
                              )}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              deleteSuggestion(
                                suggestion.id
                              )
                            }
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition flex-shrink-0"
                            title="Delete suggestion"
                            aria-label="Delete suggestion"
                          >
                            <Trash2 size={19} />
                          </button>
                        </div>

                        <p className="text-gray-700 leading-7 mt-4 break-words whitespace-pre-wrap">
                          {suggestion.message}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}