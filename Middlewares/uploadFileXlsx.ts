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

        for(const car of vehiculos){
            console.log('Datos a enviar', car);
        };
        
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
    } catch (error) {
        console.error("Error procesando el archivo Excel:", error);
        ctx.response.status = 500;
        ctx.response.body = { success: false, message: "Error interno al procesar el archivo" };
    }
};