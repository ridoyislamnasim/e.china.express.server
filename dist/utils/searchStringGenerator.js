"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchStringGenerator = searchStringGenerator;
// Utility to generate a search string (slug) from a given string
function searchStringGenerator(input) {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, '') // Trim hyphens from start/end
        .replace(/--+/g, '-'); // Replace multiple hyphens with one
}
