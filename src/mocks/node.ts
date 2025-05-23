import cors from "cors";
import express from "express";

import { createMiddleware } from "@mswjs/http-middleware";
import { handlers } from "./handlers";

const app = express();
app.use(cors());
app.use(express.json());
app.use(createMiddleware(...handlers));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
});
