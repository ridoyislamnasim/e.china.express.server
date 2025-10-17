"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isField = isField;
function isField(field, fieldName) {
    return field ? { [fieldName]: field } : undefined;
}
