"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureNullIfUndefined = ensureNullIfUndefined;
function ensureNullIfUndefined(value) {
    return value === "undefined" || value === undefined || value === "" || value === "null" ? null : value;
}
