export interface CodigoPostal {
    error: boolean;
    message: string;
    codigo_postal: {
        estado: string;
        estado_abreviatura: string;
        municipio: string;
        centro_reparto: string;
        codigo_postal: string;
        colonias: string[];
    };
}
export interface Colonia {
    COLONIA_ID: string;
    ESTADO_ID: string;
    MUNICIPIO_ID: string;
    COLONIA: string;
    CP: string;
    CR: string;
    FECHA_ACT: string;
}

export interface ColoniasResponse {
    error: boolean;
    message: string;
    colonias: Colonia[];
}


export interface Estado {
    ESTADO_ID: string;
    ESTADO: string;
    EDO1: string;
    RANGO1: string;
    RANGO2: string;
}

export interface Estados {
    error: boolean;
    message: string;
    estados: Estado[];
}

export interface Municipio {
    ESTADO_ID: string;
    MUNICIPIO_ID: string;
    MUNICIPIO: string;
    RANGO1: string;
    RANGO2: string;
}

export interface MunicipiosResponse {
    error: boolean;
    message: string;
    municipios: Municipio[];
}