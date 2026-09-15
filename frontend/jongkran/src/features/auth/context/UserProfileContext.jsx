import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getUserProfile } from "../api/authApi";
import { isAuthenticated } from "../../../services/session";

const DEFAULT_PROFILE = {
  username: "User",
  email: "",
  bio: null,
  profileImage: null,
};

const UserProfileContext = createContext(null);

let cachedProfile = null;
let profileRequest = null;

const requestProfile = () => {
  if (cachedProfile) return Promise.resolve(cachedProfile);

  if (!profileRequest) {
    profileRequest = getUserProfile()
      .then((profile) => {
        cachedProfile = profile;
        return profile;
      })
      .finally(() => {
        profileRequest = null;
      });
  }

  return profileRequest;
};

export function UserProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => ({
    ...DEFAULT_PROFILE,
    ...cachedProfile,
  }));
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);

  useEffect(() => {
    let active = true;

    const loadProfile = async (event) => {
      const authenticated = isAuthenticated();
      if (!active) return;

      setIsLoggedIn(authenticated);

      if (!authenticated) {
        cachedProfile = null;
        setProfile(DEFAULT_PROFILE);
        return;
      }

      if (event?.type === "auth-change") {
        cachedProfile = null;
      }

      if (event?.detail) {
        cachedProfile = event.detail;
        setProfile({ ...DEFAULT_PROFILE, ...event.detail });
        return;
      }

      try {
        const serverProfile = await requestProfile();
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

  const value = useMemo(
    () => ({ profile, isLoggedIn }),
    [profile, isLoggedIn],
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export const useUserProfileContext = () => {
  const context = useContext(UserProfileContext);

  if (!context) {
    throw new Error("useUserProfile must be used inside UserProfileProvider.");
  }

  return context;
};
