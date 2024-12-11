import { Hono } from "hono";
import { ZodError } from "zod";
import { failRes } from "./res.ts";

export function handleError(app: Hono) {
  app.onError((error, c) => {
    // TODO: Log externally

    if (error instanceof ZodError) {
      console.error("Req data", error);

      return failRes(
        c,
        "Bad req data - Zod data validation failed",
        400,
        "Bad request",
        { issues: error.issues },
      );
    }

    console.error(error);
    // const errorMessage = String(error.message ?? error);
    const errorMessage = String(error.name ?? error);

    return failRes(c, errorMessage, 500, "Internal Server Error");
  });
}
