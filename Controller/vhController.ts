// deno-lint-ignore-file no-explicit-any
import { insertarVehiculo, listarVehiculos, actualizarVehiculo, eliminarVehiculo } from "../Models/vhModel.ts";

// Obtener todos los vehículos
export const getVehiculos = async (ctx: any) => {
    const result = await listarVehiculos();
    ctx.response.status = 200;
    ctx.response.body = {
        success: true,
        data: result,
    };
};

// Insertar un nuevo vehículo
export const postVehiculos = async (ctx: any) => {
    const { request, response } = ctx;
    const body = await request.body.json();

    const nuevoVehiculo = await insertarVehiculo(body);
    response.status = 201;
    response.body = {
        success: true,
        data: nuevoVehiculo,
    };
};

// Actualizar un vehículo
export const updateVehiculo = async (ctx: any) => {
    const { request, response, params } = ctx;
    const id = Number(params.id);
    console.log("error en los datos")
    const body = await request.body.json();

    const resultado = await actualizarVehiculo(id, body);
    response.status = resultado.success ? 200 : 400;
    response.body = {
        success: resultado.success,
        message: resultado.success ? "Vehículo actualizado" : "No se pudo actualizar el vehículo",
    };
};

// Eliminar un vehículo
export const deleteVehiculo = async (ctx: any) => {
    const { response, params } = ctx;
    const id = Number(params.id);

    const resultado = await eliminarVehiculo(id);
    response.status = resultado.success ? 200 : 400;
    response.body = {
        success: resultado.success,
        message: resultado.success ? "Vehículo eliminado" : "No se pudo eliminar el vehículo",
    };
};
