"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privatePing = exports.ping = void 0;
const ping = (req, res) => {
    res.json({ pong: true });
};
exports.ping = ping;
const privatePing = (req, res) => {
    res.json({ pong: true, slug: req.userSlug });
};
exports.privatePing = privatePing;
