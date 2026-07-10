import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InputIngredients from "./pages/InputIngredients";
import ViewMatchRecipe from "./pages/ViewMatchRecipe";
import ViewEachMenu from "./pages/ViewEachMenu";
import Instruction from "./pages/Instruction";
import InstructionOfMenu from "./pages/InstructionOfMenu";
import AllRecipes from "./pages/AllRecipes";
import Favorite from "./pages/Favorite";
import History from "./pages/History";
import About from "./pages/About";
import UserProfile from "./pages/UserProfile";
import RecipeMatch from "./pages/RecipeMatch";
import RecipeManagement from "./pages/admin/RecipeManagement";
import CreateRecipe from "./pages/admin/CreateRecipe";
import EditRecipe from "./pages/admin/EditRecipe";
import NotFound from "./pages/NotFound";
import ProfileInformation from "./pages/ProfileInformation";
import AccountSetting from "./pages/AccountSetting";
import ChangePassword from "./pages/ChangePassword";
import Language from "./pages/Language";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/input-ingredients" element={<InputIngredients />} />
        <Route path="/matched-recipes" element={<ViewMatchRecipe />} />

        <Route path="/recipes" element={<AllRecipes />} />
        <Route path="/recipe/:id" element={<ViewEachMenu />} />

        <Route path="/instruction/:id" element={<Instruction />} />
        <Route path="/menu-instruction/:id" element={<InstructionOfMenu />} />

        <Route path="/favorite" element={<Favorite />} />
        <Route path="/history" element={<History />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<UserProfile />} />

        <Route path="/recipe-match" element={<RecipeMatch />} />
        <Route path="*" element={<NotFound />} />

        <Route path="/admin" element={<RecipeManagement />} />
        <Route path="/admin/create" element={<CreateRecipe />} />
        <Route path="/admin/edit/:id" element={<EditRecipe />} />
        <Route path="/ProfileInformation" element={<ProfileInformation />} />
        <Route path="/AccountSetting" element={<AccountSetting />} />
        <Route path="/ChangePassword" element={<ChangePassword />} />
        <Route path="/Language" element={<Language />} />
            </Routes>

    </BrowserRouter>

  );
}