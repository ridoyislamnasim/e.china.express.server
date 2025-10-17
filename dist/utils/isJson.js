"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJson = isJson;
function isJson(value) {
    try {
        JSON.parse(value);
    }
    catch (e) {
        return false;
    }
    return true;
}
