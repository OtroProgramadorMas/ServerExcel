import { Router } from "../Dependencies/dependencias.ts";
import {
  postVehiculos,
  deleteVehiculo,
  getVehiculos,
  updateVehiculo,
} from "../Controller/vhController.ts";


const routerVh = new Router();

routerVh.get("/vehiculos",getVehiculos);
routerVh.post("/vehiculos", postVehiculos);
routerVh.put("/vehiculos/:id",updateVehiculo);
routerVh.delete("/vehiculos/:id", deleteVehiculo);

export { routerVh };

