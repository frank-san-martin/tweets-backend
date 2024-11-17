"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedSchema = void 0;
const zod_1 = require("zod");
exports.feedSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(0).optional()
});
