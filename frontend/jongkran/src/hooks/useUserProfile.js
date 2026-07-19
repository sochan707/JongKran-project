import { useEffect, useState } from "react";
import { getUserProfile, isAuthenticated } from "../lib/api";

const DEFAULT_PROFILE = {
  username: "User",
  email: "",
  bio: null,
  profileImage: null,
};

export default function useUserProfile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  useEffect(() => {
    let active = true;

    const loadProfile = async (event) => {
      const authenticated = isAuthenticated();
      if (active) setIsLoggedIn(authenticated);

      if (!authenticated) {
        if (active) setProfile(DEFAULT_PROFILE);
        return;
      }

      if (event?.detail) {
        if (active) setProfile({ ...DEFAULT_PROFILE, ...event.detail });
        return;
      }

      try {
        const serverProfile = await getUserProfile();
        if (active) setProfile({ ...DEFAULT_PROFILE, ...serverProfile });
      } catch (error) {
        console.error("Could not load user profile:", error);
      }
    };

    loadProfile();
    window.addEventListener("auth-change", loadProfile);
    window.addEventListener("profile-updated", loadProfile);

    return () => {
      active = false;
      window.removeEventListener("auth-change", loadProfile);
      window.removeEventListener("profile-updated", loadProfile);
    };
  }, []);

  return { profile, isLoggedIn };
}
