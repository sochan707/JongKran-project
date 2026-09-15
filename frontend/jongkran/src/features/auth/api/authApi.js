import { apiRequest } from "../../../services/api/client";
import { getSession } from "../../../services/session";

let profileCache = null;
let profileRequest = null;

const getProfileKey = () => {
  const session = getSession();
  return session?.user?.user_id ?? session?.user?.id ?? session?.user?.email ?? null;
};

export const getUserProfile = async () => {
  const profileKey = getProfileKey();

  if (profileCache?.key === profileKey) {
    return profileCache.data;
  }

  if (profileRequest?.key !== profileKey) {
    const request = apiRequest("/auth/profile")
      .then((response) => {
        profileCache = { key: profileKey, data: response.data };
        return response.data;
      })
      .finally(() => {
        if (profileRequest?.request === request) profileRequest = null;
      });

    profileRequest = { key: profileKey, request };
  }

  return profileRequest.request;
};

export const updateUserProfile = async (profile, imageFile, removeImage = false) => {
  const body = new FormData();
  body.append("username", profile.username);
  body.append("email", profile.email);
  body.append("gender", profile.gender || "");
  body.append("dob", profile.dob || "");
  body.append("bio", profile.bio || "");
  body.append("removeImage", String(removeImage));

  if (imageFile) {
    body.append("image", imageFile);
  }

  const response = await apiRequest("/auth/profile", { method: "PATCH", body });
  profileCache = { key: getProfileKey(), data: response.data };
  return response.data;
};
