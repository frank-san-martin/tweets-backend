"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicUrl = void 0;
const getPublicUrl = (url) => {
    var _a;
    const baseUrl = (_a = process.env.BASE_URL) === null || _a === void 0 ? void 0 : _a.replace(/(^"|"$)/g, ""); // Remove aspas extras
    return `${baseUrl}/${url}`;
};
exports.getPublicUrl = getPublicUrl;
