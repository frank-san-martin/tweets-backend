"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.createJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../services/user");
const createJWT = (slug) => {
    const token = jsonwebtoken_1.default.sign({ slug }, process.env.JWT_SECRET);
    return token;
};
exports.createJWT = createJWT;
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.status(401).json({ error: "Acesso Negado!" });
        return;
    }
    const token = authHeader.split(' ')[1];
    //console.log('---token:' + token);
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (error, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            res.status(401).json({ error: "Acesso Negado!  1" });
            return;
        }
        const user = yield (0, user_1.findUserBySlug)(decoded.slug);
        if (!user) {
            res.status(401).json({ error: "Acesso Negado!  2" });
            return;
        }
        req.userSlug = user.slug;
        next();
    }));
};
exports.verifyJWT = verifyJWT;
