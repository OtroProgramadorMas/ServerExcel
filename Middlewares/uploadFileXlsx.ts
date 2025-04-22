import { XLSX } from "../Dependencies/dependencias.ts";
import { Context } from "../Dependencies/dependencias.ts";
import { insertarVehiculoDesdeMiddleware } from "../Controller/vhController.ts";

export const excelMiddleware = async (ctx: Context) => {
    if (!ctx.request.hasBody) {
        ctx.response.status = 400;
        ctx.response.body = { success: false, message: "No se envió un archivo" };
        return;
    }

    const body = await ctx.request.body.formData();
    const file = body.get("file") as File;

    // Validación del tipo de archivo
    if (!file || (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && !file.name.endsWith(".xlsx"))) {
        ctx.response.status = 400;
        ctx.response.body = { success: false, message: "Formato de archivo no válido. Se espera un archivo .xlsx" };
        return;
    }

    try {
        const fileContent = await file.arrayBuffer();
        const workbook = XLSX.read(fileContent, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const vehiculos = XLSX.utils.sheet_to_json(sheet) as any[];

        // Array para almacenar errores de validación
        const errores: string[] = [];

        // Procesar cada vehículo
        for (const vehiculo of vehiculos) {
            // Validar y mapear los datos del vehículo
            const datosVehiculo = {
                marca: vehiculo.Marca || vehiculo.marca || null,
                modelo: vehiculo.Modelo || vehiculo.modelo || null,
                tipo: vehiculo.Tipo || vehiculo.tipo || null,
                año: vehiculo.Año || vehiculo.año || null,
                combustible: vehiculo.Combustible || vehiculo.combustible || null,
                precio: vehiculo.Precio || vehiculo.precio || null,
                estado: vehiculo.Estado || vehiculo.estado || null,
            };

            // Enviar los datos al controlador
            try {
                await insertarVehiculoDesdeMiddleware(datosVehiculo); // Llamada al nuevo método
            } catch (error) {
                errores.push(`Error al insertar el vehículo: ${JSON.stringify(vehiculo)}. Error: ${error}`);
            }
        }

        // Respuesta final
        if (errores.length > 0) {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: "Algunos vehículos no se pudieron procesar",
                errores,
            };
        } else {
            ctx.response.status = 200;
            ctx.response.body = { success: true, message: "Archivo procesado correctamente" };
        }
    } catch (error) {
        console.error("Error procesando el archivo Excel:", error);
        ctx.response.status = 500;
        ctx.response.body = { success: false, message: "Error interno al procesar el archivo" };
    }
};