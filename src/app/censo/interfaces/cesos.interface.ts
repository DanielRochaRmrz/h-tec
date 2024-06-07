export interface CensosData {
  equipo:   Equipo;
  imagenes: string[];
  cliente:  Cliente;
  id:       string;
}

export interface Cliente {
  whatsApp:      string;
  telefono:      string;
  claveASPEL:    string;
  cliente:       string;
  correo:        string;
  fechaRegistro: Date;
}

export interface Equipo {
  numeroSerie:        string;
  reponsableEquipo:   string;
  officeV:            string;
  responsableCorreo:  string;
  modelo:             string;
  qr:                 string;
  marca:              string;
  fechaCaducidadAnti: null;
  antivirus:          string;
  areaDepartamento:   string;
  sistemOperativoV:   string;
  tipo:               string;
}
