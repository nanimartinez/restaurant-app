import winston from "winston";
import path from "path";
import fs from "fs"; // Importar fs para crear el directorio de logs si no existe
import __dirname from "../utils/index.js";
import config from "./config.js";
const { MODE } = config;


const customLevels = {
  levels: {
    grave: 0, // Errores críticos (se escriben en archivo)
    warn: 1, // Advertencias
    info: 2, // Información general
    leve: 3, // Logs detallados (debug, seguimiento fino)
  },
  colors: {
    grave: "red",
    warn: "yellow",
    info: "blue",
    leve: "green",
  },
};

winston.addColors(customLevels.colors);


const logDir = path.join(__dirname, "..", "logs");
// Crear el directorio de logs si no existe
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Transporte para archivo (solo errores graves)
const transportFile = new winston.transports.File({
  level: "grave",
  filename: path.join(logDir, "grave.log"),
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

// Transporte para consola (todos los niveles en desarrollo)
const transportConsole = new winston.transports.Console({
  level: "leve",
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message, ...rest }) => {
      // 2. Comprobar si el objeto 'rest' tiene claves para evitar imprimir '{}' vacíos.
      const meta = Object.keys(rest).length ? JSON.stringify(rest, null, 2) : "";
      // 1. Usar backticks (`) para la interpolación de variables.
      return `[${timestamp}] ${level}: ${message} ${meta}`;
    })
  ),
});

// Instancia del logger
const logger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    // Por defecto, siempre loguear en la consola, pero con nivel 'info' en producción.
    // Y siempre loguear los errores graves en el archivo.
    transportFile
  ],
});

// Agrega el transporte de consola con nivel 'leve' solo en modo desarrollo.
if (MODE === "dev") {
  logger.add(transportConsole);
} else {
  // En producción, también queremos ver logs en la consola, pero solo desde 'info' hacia arriba.
  logger.add(new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      )
  }));
}


// Middleware para Express
const middLogg = (req, res, next) => {
  req.logger = logger;
  // Añadimos un log de ejemplo para cada petición entrante
  req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
  next();
};

export default middLogg;