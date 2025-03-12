import { Application, Router, oakCors } from "./Dependencies/dependencias.ts";
import { routerVh } from "./Routes/vhRoutes.ts";
import { errorHandler } from "./Middlewares/errorHandler.ts";
import { logData } from './Middlewares/logData.ts';
import { excelMiddleware } from "./Middlewares/uploadFileXlsx.ts";

const app = new Application();

// Middlewares globales
app.use(errorHandler);
app.use(logData);
app.use(oakCors());

// Router para la subida de archivos Excel
const uploadRouter = new Router();
uploadRouter.post("/upload", excelMiddleware); // Solo se aplica a la ruta /upload

// Agrega los routers a la aplicación
app.use(routerVh.routes());
app.use(routerVh.allowedMethods());
app.use(uploadRouter.routes());
app.use(uploadRouter.allowedMethods());

// Iniciar el servidor
const puerto = 8000;
console.log('Servidor corriendo por el puerto ' + puerto);
app.listen({ port: puerto });