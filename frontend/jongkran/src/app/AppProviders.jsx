import { UserProfileProvider } from "../features/auth/context/UserProfileContext";
import { FavoritesProvider } from "../features/recipes/context/FavoritesContext";

export default function AppProviders({ children }) {
  return (
    <UserProfileProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </UserProfileProvider>
  );
}
