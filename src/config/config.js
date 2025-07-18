import { Command, Option } from "commander";
import dotenv from "dotenv";

const program = new Command();

program
  .addOption(
    new Option("-m, --mode <MODE>", "Modo de ejecución del server")
      .choices(["prod", "dev", "test"]) // Añadir 'test' como opción
      .default("dev")
  );
program.parse();

const mode = program.opts().mode;

// Cargar variables de entorno según el modo
dotenv.config({
  path: mode === "prod" ? "./.env.prod" : mode === "test" ? "./.env.test" : "./.env.dev",
});

// Configuración exportada
const config = {
  MONGO_URI: process.env.MONGO_URI,
  MODE: mode,
  PORT: process.env.PORT,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
};

export default config;