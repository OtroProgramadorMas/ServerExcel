import { XLSX } from "../Dependencies/dependencias.ts";
import { Context } from "../Dependencies/dependencias.ts";
import { postVehiculos } from "../Controller/vhController.ts";

export const excelMiddleware = async (ctx: Context) => {
    if (!ctx.request.hasBody) {
        ctx.response.status = 400;
        ctx.response.body = { success: false, message: "No se envió un archivo" };
        return;
    }

    const body = await ctx.request.body.formData();
    const file = body.get("file") as File;

    if (!file || file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        ctx.response.status = 400;
        ctx.response.body = { success: false, message: "Formato de archivo no válido" };
        return;
    }

    // Leer el archivo Excel
    const data = await Deno.readFile(file.name);
    const workbook = XLSX.read(data, { type: "buffer" });

    // Obtener la primera hoja
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convertir a JSON
    const vehiculos = XLSX.utils.sheet_to_json(sheet) as any[];

    // Insertar los datos en la base de datos
    for (const vehiculo of vehiculos) {
        await postVehiculos({
            marca: vehiculo.Marca,
            modelo: vehiculo.Modelo,
            tipo: vehiculo.Tipo,
            año: vehiculo.Año,
            combustible: vehiculo.Combustible,
            precio: vehiculo.Precio,
            estado: vehiculo.Estado
        });
    }

    ctx.response.status = 200;
    ctx.response.body = { success: true, message: "Archivo procesado correctamente" };
};
