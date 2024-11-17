"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const zod_1 = require("zod");
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Precisa ter 3 ou mais carateres!').optional(),
    bio: zod_1.z.string().optional(),
    link: zod_1.z.string().url('Precisa ser uma URL válida!').optional()
});
