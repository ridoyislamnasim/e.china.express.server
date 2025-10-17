"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const exampleRouter = (0, express_1.Router)();
exampleRouter.get("/", (req, res, next) => {
    res.json({ message: "TypeScript route working!" });
});
exports.default = exampleRouter;
