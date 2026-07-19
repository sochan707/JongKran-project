import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import UserRoute from "./components/UserRoute";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const InputIngredients = lazy(() => import("./pages/InputIngredients"));
const ViewMatchRecipe = lazy(() => import("./pages/ViewMatchRecipe"));
const ViewEachMenu = lazy(() => import("./pages/ViewEachMenu"));
const Instruction = lazy(() => import("./pages/Instruction"));
const AllRecipes = lazy(() => import("./pages/AllRecipes"));
const Favorite = lazy(() => import("./pages/Favorite"));
const History = lazy(() => import("./pages/History"));
const About = lazy(() => import("./pages/About"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const RecipeManagement = lazy(() => import("./pages/admin/RecipeManagement"));
const CreateRecipe = lazy(() => import("./pages/admin/CreateRecipe"));
const EditRecipe = lazy(() => import("./pages/admin/EditRecipe"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProfileInformation = lazy(() => import("./pages/ProfileInformation"));
const AccountSetting = lazy(() => import("./pages/AccountSetting"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const Language = lazy(() => import("./pages/Language"));
const UserSuggestions = lazy(() => import("./pages/admin/UserSuggestions"));
const RecipeSuggestionDetail = lazy(() => import("./pages/admin/RecipeSuggestionDetail"));
const AdminApprove = lazy(() => import("./pages/admin/AdminApprove"));
const RecipeOverview = lazy(() => import("./pages/RecipeOverview"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<main className="min-h-screen" aria-busy="true" />}>
        <Routes>
        <Route element={<UserRoute />}>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/input-ingredients" element={<InputIngredients />} />
          <Route path="/recipe/:id" element={<RecipeOverview />} />
          <Route path="/recipe/:id/ingredients" element={<ProtectedRoute><ViewEachMenu /></ProtectedRoute>} />

          <Route path="/recipes" element={<AllRecipes />} />

          <Route path="/instruction/:id" element={<ProtectedRoute><Instruction /></ProtectedRoute>} />
          <Route path="/menu-instruction/:id" element={<ProtectedRoute><Instruction /></ProtectedRoute>} />

          <Route path="/favorite" element={<ProtectedRoute><Favorite /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

          <Route path="/matched-recipes" element={<ViewMatchRecipe />} />
          <Route path="/recipe-match" element={<ViewMatchRecipe />} />

          <Route path="/ProfileInformation" element={<ProtectedRoute><ProfileInformation /></ProtectedRoute>} />
          <Route path="/AccountSetting" element={<ProtectedRoute><AccountSetting /></ProtectedRoute>} />
          <Route path="/ChangePassword" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/Language" element={<ProtectedRoute><Language /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<RecipeManagement />} />
          <Route path="create" element={<CreateRecipe />} />
          <Route path="edit/:id" element={<EditRecipe />} />
          <Route path="suggestions" element={<UserSuggestions />} />
          <Route path="suggestions/:recipeId" element={<RecipeSuggestionDetail />} />
          <Route path="pending-approve" element={<AdminApprove />} />
        </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>

  );
}
