// restore.ts
import { exec, ExecException } from "child_process";
import { parse } from "pg-connection-string";
import * as path from "path";
import * as fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

const NEON_DATABASE_URL = process.env.DATABASE_URL;

if (!NEON_DATABASE_URL) {
  console.error("❌ Error: DATABASE_URL not found in .env");
  process.exit(1);
}

const FILE_TO_RESTORE = process.argv[2]; // file name from CLI

//Detect the OS and set the os based on the OS(windows or mac or linux)
const isWindows = process.platform === "win32";
const pgRestorePath = isWindows
  ? `"C:\\Program Files\\PostgreSQL\\18\\bin\\pg_restore"`
  : `"/opt/homebrew/opt/postgresql@18/bin/pg_restore"`;
// const pgRestorePath = `"C:\\Program Files\\PostgreSQL\\18\\bin\\pg_restore"`; // change if needed

if (!FILE_TO_RESTORE) {
  console.error(
    "❌ Please provide a backup filename.\nUsage: npm run db:restore <filename>",
  );
  process.exit(1);
}

const BACKUP_DIR = path.join(__dirname, "..", "backups");
const BACKUP_PATH = path.join(BACKUP_DIR, FILE_TO_RESTORE);
const QUOTED_BACKUP_PATH = `"${BACKUP_PATH}"`;

if (!fs.existsSync(BACKUP_PATH)) {
  console.error(`❌ Backup file not found: ${BACKUP_PATH}`);
  process.exit(1);
}

function restoreDB(connectionUrl: string) {
  const config = parse(connectionUrl);

  if (!config.host || !config.user || !config.database || !config.password) {
    console.error("❌ Invalid database URL in .env");
    return;
  }

  const envVars = {
    ...process.env,
    PGPASSWORD: config.password,
    PGSSLMODE: "require",
  };

  const command = `${pgRestorePath} -h ${config.host} -U ${config.user} -d ${config.database} -v -c ${QUOTED_BACKUP_PATH}`;

  console.log("🔄 Restoring Database...");
  exec(
    command,
    { env: envVars },
    (error: ExecException | null, stdout: string, stderr: string) => {
      if (error) {
        console.error(`❌ Restore Failed: ${error.message}`);
        return;
      }
      console.log("📌 Output:", stdout || stderr);
      console.log("✅ Restore Completed Successfully!");
    },
  );
}

restoreDB(NEON_DATABASE_URL);
