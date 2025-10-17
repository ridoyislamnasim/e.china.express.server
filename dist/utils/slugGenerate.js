"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugGenerate = slugGenerate;
function slugGenerate(name) {
    return name.trim().replace(/\s+/g, "-").toLowerCase();
}
