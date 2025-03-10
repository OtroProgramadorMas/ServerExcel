import { Application, oakCors } from "./Dependencies/dependencias.ts";

import { errorHandler } from "./Middlewares/errorHandler.ts";
import { logData } from './Middlewares/logData.ts'

const app = new Application();

app.use(errorHandler);
app.use(logData);
app.use(oakCors());
