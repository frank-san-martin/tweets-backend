"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinSchema = void 0;
const zod_1 = require("zod");
exports.signinSchema = zod_1.z.object({
    email: zod_1.z.string({ message: "E-mail é obrigatório!" }).email('E-mail inválido!'),
    password: zod_1.z.string({ message: "Senha é obrigatória!" }).min(4, 'Precisa ter no mínimo 4 caracteres!')
});
