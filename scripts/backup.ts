// backup.ts
import { exec } from 'child_process';
import { parse } from 'pg-connection-string';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
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
const date = new Date().toISOString().replace(/T/,"-").replace(/\..+/,"").replace(/:/g,"-");

let fileName = inputName 
    ? (inputName.endsWith(".bak") ? inputName : `${inputName}_${date}.bak`)
    : `backup_${date}.bak`;

// OUTPUT PATH
const BACKUP_DIR = path.join(__dirname, "..", "backups");
const BACKUP_FILE = path.join(BACKUP_DIR, fileName);

// Ensure directory exists
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

function backup(db: string) {
    const config = parse(db);

    const env = {
        ...process.env,
        PGPASSWORD: config.password!,
        PGSSLMODE: "require"
    };

    const command = `${pgDump} -Fc -v -h ${config.host} -U ${config.user} -d ${config.database} -f "${BACKUP_FILE}"`;

    console.log(`🚀 Backup Running → ${BACKUP_FILE}`);

    exec(command, { env }, (err, out, log) => {
        if (err) return console.error(`❌ Failed: ${err.message}`);
        console.log("⚠ Info:", log);
        console.log("✅ Backup Completed Successfully!");
    });
}

backup(DB_URL);
