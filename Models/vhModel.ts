import { Conexion }from "../Models/conexion.ts";

export interface Vehiculo {
    id: number;
    marca: string;
    modelo: string;
    tipo: string;
    año?: number; // Opcional porque puede ser NULL
    combustible?: string; // Opcional porque puede ser NULL
    precio?: number; // Opcional porque puede ser NULL
    estado?: string; // Opcional porque puede ser NULL
}

export const insertarVehiculo = async (vehiculo: Omit<Vehiculo, "id">) => {
    try {
        const result = await Conexion.execute(`
            INSERT INTO vehiculos (marca, modelo, tipo, año, combustible, precio, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            vehiculo.marca, 
            vehiculo.modelo, 
            vehiculo.tipo, 
            vehiculo.año ?? null, 
            vehiculo.combustible ?? null, 
            vehiculo.precio ?? null, 
            vehiculo.estado ?? null
        ]);
        return { success: true, id: result.lastInsertId };
    } catch (error) {
        console.error("Error al insertar vehículo:", error);
        return { success: false, error };
    }
};

export const listarVehiculos = async (): Promise<Vehiculo[]> => {
    try {
        const result = await Conexion.query("SELECT * FROM vehiculos");
        return result as Vehiculo[];
    } catch (error) {
        console.error("Error al listar vehículos:", error);
        return [];
    }
};


export const actualizarVehiculo = async (id: number, vehiculo: Omit<Vehiculo, "id">) => {
    try {
        const result = await Conexion.execute(`
            UPDATE vehiculos SET Marca = ?, modelo = ?, tipo = ?, año = ?, 
                combustible = ?, precio = ?, estado = ? 
            WHERE id = ?
        `, [
            vehiculo.marca, 
            vehiculo.modelo, 
            vehiculo.tipo, 
            vehiculo.año ?? null, 
            vehiculo.combustible ?? null, 
            vehiculo.precio ?? null, 
            vehiculo.estado ?? null, 
            id
        ]);
        return { success: result && result.affectedRows && result.affectedRows > 0};
    } catch (error) {
        console.error("Error al actualizar vehículo:", error);
        return { success: false, error };
    }
};

export const eliminarVehiculo = async (id: number) => {
    try {
        const result = await Conexion.execute("DELETE FROM vehiculos WHERE id = ?", [id]);
        return { success: result && result.affectedRows && result.affectedRows > 0};
    } catch (error) {
        console.error("Error al eliminar vehículo:", error);
        return { success: false, error };
    }
};