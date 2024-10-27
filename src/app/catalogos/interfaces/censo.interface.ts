export interface ClienteRegistradoData {
    equipo: {
        sistemOperativoV: string;
        officeV: string;
        antivirus: string;
        numeroSerie: string;
        modelo: string;
        marca: string;
        areaDepartamento: string;
        responsableCorreo: string;
        qr: string;
        fechaCaducidadAnti: {
            seconds: number;
            nanoseconds: number;
        };
        reponsableEquipo: string;
        tipo: string;
    };
    imagenes: string[];
    cliente: {
        whatsApp: string;
        correo: string;
        claveASPEL: string;
        cliente: string;
        fechaRegistro: string;
        telefono: string;
    };
    id: string;
    editMod: boolean;
}