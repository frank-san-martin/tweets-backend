"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTweetSchema = void 0;
const zod_1 = require("zod");
exports.addTweetSchema = zod_1.z.object({
    body: zod_1.z.string({ message: "Precisa enviar mensagem/foto/voice!" }),
    answer: zod_1.z.string().optional()
});
