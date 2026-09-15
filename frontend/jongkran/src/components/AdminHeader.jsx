import AppHeader from "./navigation/AppHeader";
import { adminNavigation } from "../config/navigation";

export default function AdminHeader() {
  return <AppHeader homePath="/admin" links={adminNavigation} />;
}
