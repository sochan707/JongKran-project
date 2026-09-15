export const readJson = (key, fallbackValue) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallbackValue;
  } catch {
    return fallbackValue;
  }
};
