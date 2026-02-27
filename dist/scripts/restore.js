"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// restore.ts
const child_process_1 = require("child_process");
const pg_connection_string_1 = require("pg-connection-string");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const dotenv = __importStar(require("dotenv"));
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
    console.error("❌ Please provide a backup filename.\nUsage: npm run db:restore <filename>");
    process.exit(1);
}
const BACKUP_DIR = path.join(__dirname, "..", "backups");
const BACKUP_PATH = path.join(BACKUP_DIR, FILE_TO_RESTORE);
const QUOTED_BACKUP_PATH = `"${BACKUP_PATH}"`;
if (!fs.existsSync(BACKUP_PATH)) {
    console.error(`❌ Backup file not found: ${BACKUP_PATH}`);
    process.exit(1);
}
function restoreDB(connectionUrl) {
    const config = (0, pg_connection_string_1.parse)(connectionUrl);
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
    (0, child_process_1.exec)(command, { env: envVars }, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Restore Failed: ${error.message}`);
            return;
        }
        console.log("📌 Output:", stdout || stderr);
        console.log("✅ Restore Completed Successfully!");
    });
}
restoreDB(NEON_DATABASE_URL);
