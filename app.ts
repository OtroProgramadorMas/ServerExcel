import { Application, oakCors } from "./Dependencies/dependencias.ts";
import { routerVh } from "./Routes/vhRoutes.ts";

import { errorHandler } from "./Middlewares/errorHandler.ts";
import { logData } from './Middlewares/logData.ts'

const app = new Application();

app.use(errorHandler);
app.use(logData);
app.use(oakCors());

app.use(routerVh.routes());
app.use(routerVh.allowedMethods());

const puerto = 8000;
console.log('Servidor corriendo por el puerto ' + puerto);
app.listen({port: puerto});
