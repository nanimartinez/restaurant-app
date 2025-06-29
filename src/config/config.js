import { Command, Option } from "commander";
import dotenv from "dotenv";

const program = new Command();

program
  .addOption(new Option("--test <archivo>", "Archivo de test a ejecutar"))
  .addOption(
    new Option("-m, --mode <MODE>", "Modo de ejecución del server")
      .choices(["prod", "dev"])
      .default("dev")
  );
program.parse();

const mode = program.opts().mode;

// FIX: Usar dotenv para cargar las variables de entorno
dotenv.config({
  path: mode === "prod" ? "./.env.prod" : "./.env.dev",
});

// Configuración exportada
const config = {
  MONGO_URI: process.env.MONGO_URI,
  MODE: mode,
  PORT: process.env.PORT,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY, // FIX: Añadir la clave secreta a la configuración
};

export default config;