export const decodeToken = (token) => {
  if (!token) {
    console.error("Token is null or undefined");
    return null;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT structure");
    }
    const payload = JSON.parse(atob(parts[1])); // Decode the payload
    return payload;
  } catch (error) {
    console.error("Invalid token:", error.message);
    return null;
  }
};
