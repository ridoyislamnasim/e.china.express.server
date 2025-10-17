"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArrayElementExist = isArrayElementExist;
function isArrayElementExist(array) {
    return Array.isArray(array) && array.length > 0;
}
