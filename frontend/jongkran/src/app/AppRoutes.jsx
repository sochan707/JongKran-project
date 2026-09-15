import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AdminRoute from "../components/AdminRoute";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const InputIngredients = lazy(() => import("../pages/InputIngredients"));
const ViewMatchRecipe = lazy(() => import("../pages/ViewMatchRecipe"));
const ViewEachMenu = lazy(() => import("../pages/ViewEachMenu"));
const Instruction = lazy(() => import("../pages/Instruction"));
const AllRecipes = lazy(() => import("../pages/AllRecipes"));
const Favorite = lazy(() => import("../pages/Favorite"));
const History = lazy(() => import("../pages/History"));
const About = lazy(() => import("../pages/About"));
const UserProfile = lazy(() => import("../pages/UserProfile"));
const ProfileInformation = lazy(() => import("../pages/ProfileInformation"));
const AccountSetting = lazy(() => import("../pages/AccountSetting"));
const ChangePassword = lazy(() => import("../pages/ChangePassword"));
const Language = lazy(() => import("../pages/Language"));
const RecipeOverview = lazy(() => import("../pages/RecipeOverview"));
const RecipeManagement = lazy(() => import("../pages/admin/RecipeManagement"));
const CreateRecipe = lazy(() => import("../pages/admin/CreateRecipe"));
const EditRecipe = lazy(() => import("../pages/admin/EditRecipe"));
const UserSuggestions = lazy(() => import("../pages/admin/UserSuggestions"));
const RecipeSuggestionDetail = lazy(
  () => import("../pages/admin/RecipeSuggestionDetail"),
);
const AdminApprove = lazy(() => import("../pages/admin/AdminApprove"));
const NotFound = lazy(() => import("../pages/NotFound"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/input-ingredients" element={<InputIngredients />} />
      <Route path="/recipe/:id" element={<RecipeOverview />} />
      <Route path="/recipe/:id/ingredients" element={<ViewEachMenu />} />
      <Route path="/recipes" element={<AllRecipes />} />
      <Route path="/instruction/:id" element={<Instruction />} />
      <Route path="/menu-instruction/:id" element={<Instruction />} />
      <Route path="/favorite" element={<Favorite />} />
      <Route path="/history" element={<History />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/matched-recipes" element={<ViewMatchRecipe />} />
      <Route path="/recipe-match" element={<ViewMatchRecipe />} />

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<RecipeManagement />} />
        <Route path="/admin/create" element={<CreateRecipe />} />
        <Route path="/admin/edit/:id" element={<EditRecipe />} />
        <Route path="/admin/suggestions" element={<UserSuggestions />} />
        <Route
          path="/admin/suggestions/:recipeId"
          element={<RecipeSuggestionDetail />}
        />
        <Route path="/admin/pending-approve" element={<AdminApprove />} />
      </Route>

      <Route path="/ProfileInformation" element={<ProfileInformation />} />
      <Route path="/AccountSetting" element={<AccountSetting />} />
      <Route path="/ChangePassword" element={<ChangePassword />} />
      <Route path="/Language" element={<Language />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
