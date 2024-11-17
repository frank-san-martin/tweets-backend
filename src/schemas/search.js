"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSchema = void 0;
const zod_1 = require("zod");
exports.searchSchema = zod_1.z.object({
    q: zod_1.z.string({ message: 'Preencha a busca!' }).min(3, 'Mínimo de 03 caracteres!'),
    page: zod_1.z.coerce.number().min(0).optional()
});
