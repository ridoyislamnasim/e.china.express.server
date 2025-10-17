"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageSlugGenerate = pageSlugGenerate;
function pageSlugGenerate(name) {
    return name.toLowerCase().replace(/ /g, '-');
}
