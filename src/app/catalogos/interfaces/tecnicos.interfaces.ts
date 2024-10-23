export interface TecnicosData {
  nombre: string;
  direccion: string;
  clave: string;
  clasificacion: any[];
  calleNumero: string;
  ciudad: string;
  cliente: string;
  colonia: string;
  correo: string;
  cp: string;
  estado: string;
  id: string;
  rfc: string;
  telefono: string;
  whatsApp: string;
  isSaveDisabled: boolean;
  type: string;
 }

 export interface clasificacionesData {
    editMod: boolean | undefined;
    item: any;
    id: number;
    nombre: string;
  }
