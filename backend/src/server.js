import app from "./app.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});