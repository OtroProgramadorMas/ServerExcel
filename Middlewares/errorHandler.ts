import { Context, isHttpError } from "../Dependencies/dependencias.ts";

export const errorHandler = async (ctx: Context, next: () => Promise<unknown>) => {
    try {
      await next();
    } catch (err: unknown) {
      // Log del error para depuración
      console.error("Error capturado:", err);
  
      // Comprueba si es un error HTTP (como 404, 401, etc.)
      if (isHttpError(err)) {
        ctx.response.status = err.status;
        ctx.response.body = {
          success: false,
          message: err.message,
          status: err.status
        };
        return;
      }
  
      // Verificar si es un Error estándar
      if (err instanceof Error) {
        ctx.response.status = 500;
        ctx.response.body = {
          success: false,
          message: "Error interno del servidor",
          status: 500,
          // Solo muestra detalles del error en desarrollo
          ...(Deno.env.get("ENV") === "development" && { 
            error: err.message, 
            stack: err.stack 
          })
        };
        return;
      }
  
      // Para cualquier otro tipo de error
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: "Error interno del servidor desconocido",
        status: 500,
        ...(Deno.env.get("ENV") === "development" && { 
          error: String(err)
        })
      };
    }
  };