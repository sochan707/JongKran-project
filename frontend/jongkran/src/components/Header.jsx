import AppHeader from "./navigation/AppHeader";
import { publicNavigation } from "../config/navigation";

export default function Header() {
  return <AppHeader homePath="/" links={publicNavigation} />;
}
