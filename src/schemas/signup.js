"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    name: zod_1.z.string({ message: "Nome é obrigatório!" }).min(2, 'Precisa ter no mínimo 2 caracteres!'),
    email: zod_1.z.string({ message: "E-mail é obrigatório!" }).email('E-mail inválido!'),
    password: zod_1.z.string({ message: "Senha é obrigatória!" }).min(4, 'Precisa ter no mínimo 4 caracteres!')
});
