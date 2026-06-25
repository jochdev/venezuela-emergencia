export interface Parroquia {
  id: number;
  nombre: string;
}

export interface Municipio {
  id: number;
  nombre: string;
  parroquias: Parroquia[];
}

export interface Estado {
  id: number;
  nombre: string;
  municipios: Municipio[];
}

export const VENEZUELA_UBICACIONES: Estado[] = [
  {
    id: 1,
    nombre: "Distrito Capital",
    municipios: [
      {
        id: 101,
        nombre: "Libertador",
        parroquias: [
          { id: 10101, nombre: "Sucre (Catia)" },
          { id: 10102, nombre: "El Recreo" },
          { id: 10103, nombre: "Altagracia" },
          { id: 10104, nombre: "Caricuao" },
          { id: 10105, nombre: "La Vega" },
          { id: 10106, nombre: "Antímano" },
          { id: 10107, nombre: "El Valle" },
          { id: 10108, nombre: "Coche" },
          { id: 10109, nombre: "San Juan" },
          { id: 10110, nombre: "23 de Enero" },
          { id: 10111, nombre: "Macarao" },
          { id: 10112, nombre: "La Pastora" }
        ]
      }
    ]
  },
  {
    id: 2,
    nombre: "Miranda",
    municipios: [
      {
        id: 201,
        nombre: "Chacao",
        parroquias: [{ id: 20101, nombre: "Chacao" }]
      },
      {
        id: 202,
        nombre: "Baruta",
        parroquias: [
          { id: 20201, nombre: "El Cafetal" },
          { id: 20202, nombre: "Las Minas de Baruta" },
          { id: 20203, nombre: "Nuestra Señora del Rosario de Baruta" }
        ]
      },
      {
        id: 203,
        nombre: "Sucre (Caracas)",
        parroquias: [
          { id: 20301, nombre: "Petare" },
          { id: 20302, nombre: "Leoncio Martínez (La Urbina)" },
          { id: 20303, nombre: "Caucagüita" },
          { id: 20304, nombre: "Filas de Mariche" }
        ]
      },
      {
        id: 204,
        nombre: "El Hatillo",
        parroquias: [{ id: 20401, nombre: "Santa Rosalía de Palermo" }]
      },
      {
        id: 205,
        nombre: "Plaza (Guarenas)",
        parroquias: [{ id: 20501, nombre: "Guarenas" }]
      },
      {
        id: 206,
        nombre: "Zamora (Guatire)",
        parroquias: [
          { id: 20601, font: "Zamora", nombre: "Guatire" },
          { id: 20602, nombre: "Bolívar" }
        ]
      },
      {
        id: 207,
        nombre: "Guaicaipuro (Los Teques)",
        parroquias: [
          { id: 20701, nombre: "Los Teques" },
          { id: 20702, nombre: "San Pedro" },
          { id: 20703, nombre: "El Jarillo" }
        ]
      }
    ]
  },
  {
    id: 3,
    nombre: "Aragua",
    municipios: [
      {
        id: 301,
        nombre: "Girardot (Maracay)",
        parroquias: [
          { id: 30101, nombre: "Maracay" },
          { id: 30102, nombre: "Choroní" },
          { id: 30103, nombre: "Las Delicias" }
        ]
      },
      {
        id: 302,
        nombre: "Santiago Mariño (Turmero)",
        parroquias: [{ id: 30201, nombre: "Turmero" }]
      },
      {
        id: 303,
        nombre: "Mario Briceño Iragorry (El Limón)",
        parroquias: [{ id: 30301, nombre: "El Limón" }]
      },
      {
        id: 304,
        nombre: "Tovar (Colonia Tovar)",
        parroquias: [{ id: 30401, nombre: "Colonia Tovar" }]
      },
      {
        id: 305,
        nombre: "José Félix Ribas (La Victoria)",
        parroquias: [{ id: 30501, nombre: "La Victoria" }]
      }
    ]
  },
  {
    id: 4,
    nombre: "La Guaira (Vargas)",
    municipios: [
      {
        id: 401,
        nombre: "Vargas",
        parroquias: [
          { id: 40101, nombre: "La Guaira" },
          { id: 40102, nombre: "Maiquetía" },
          { id: 40103, nombre: "Catia La Mar" },
          { id: 40104, nombre: "Caraballeda" },
          { id: 40105, nombre: "Macuto" },
          { id: 40106, nombre: "Naiguatá" },
          { id: 40107, nombre: "Carayaca" }
        ]
      }
    ]
  },
  {
    id: 5,
    nombre: "Carabobo",
    municipios: [
      {
        id: 501,
        nombre: "Valencia",
        parroquias: [
          { id: 50101, nombre: "Valencia" },
          { id: 50102, nombre: "Miguel Peña" },
          { id: 50103, nombre: "Santa Rosa" }
        ]
      },
      {
        id: 502,
        nombre: "Puerto Cabello",
        parroquias: [
          { id: 50201, nombre: "Puerto Cabello" },
          { id: 50202, nombre: "Bartolomé Salom" },
          { id: 50203, nombre: "Democracia" }
        ]
      },
      {
        id: 503,
        nombre: "Naguanagua",
        parroquias: [{ id: 50301, nombre: "Naguanagua" }]
      },
      {
        id: 504,
        nombre: "San Diego",
        parroquias: [{ id: 50401, nombre: "San Diego" }]
      }
    ]
  },
  {
    id: 99,
    nombre: "Otro / No Listado",
    municipios: [
      {
        id: 9901,
        nombre: "Otro Municipio",
        parroquias: [{ id: 990101, nombre: "Otra Parroquia" }]
      }
    ]
  }
];
