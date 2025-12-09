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
// backup.ts
const child_process_1 = require("child_process");
const pg_connection_string_1 = require("pg-connection-string");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
    console.error("❌ DATABASE_URL missing");
    process.exit(1);
}
const pgDump = `"C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump"`;
// ───────── SHORT NAME SUPPORT ─────────
// input:  node backup.js custom  → output: custom.bak
//         node backup.js         → output: backup_2025-12-04_20-20-20.bak
const inputName = process.argv[2];
const date = new Date().toISOString().replace(/T/, "-").replace(/\..+/, "").replace(/:/g, "-");
let fileName = inputName
    ? (inputName.endsWith(".bak") ? inputName : `${inputName}_${date}.bak`)
    : `backup_${date}.bak`;
// OUTPUT PATH
const BACKUP_DIR = path.join(__dirname, "..", "backups");
const BACKUP_FILE = path.join(BACKUP_DIR, fileName);
// Ensure directory exists
if (!fs.existsSync(BACKUP_DIR))
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
function backup(db) {
    const config = (0, pg_connection_string_1.parse)(db);
    const env = {
        ...process.env,
        PGPASSWORD: config.password,
        PGSSLMODE: "require"
    };
    const command = `${pgDump} -Fc -v -h ${config.host} -U ${config.user} -d ${config.database} -f "${BACKUP_FILE}"`;
    console.log(`🚀 Backup Running → ${BACKUP_FILE}`);
    (0, child_process_1.exec)(command, { env }, (err, out, log) => {
        if (err)
            return console.error(`❌ Failed: ${err.message}`);
        console.log("⚠ Info:", log);
        console.log("✅ Backup Completed Successfully!");
    });
}
backup(DB_URL);
