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
exports.signin = exports.signup = void 0;
const slug_1 = __importDefault(require("slug"));
const bcrypt_ts_1 = require("bcrypt-ts");
const user_1 = require("../services/user");
const jwt_1 = require("../utils/jwt");
const signin_1 = require("../schemas/signin");
const signup_1 = require("../schemas/signup");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // validar dados recebidos
    const safeData = signup_1.signupSchema.safeParse(req.body);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }
    // verificar email
    const hasEmail = yield (0, user_1.findUserByEmail)(safeData.data.email);
    if (hasEmail) {
        res.json({ error: "E-mail já esta sendo usado!" });
        return;
    }
    // verificar slug
    let genSlug = true;
    let userSlug = (0, slug_1.default)(safeData.data.name);
    while (genSlug) {
        const hasslug = yield (0, user_1.findUserBySlug)(userSlug);
        if (hasslug) {
            let slugSuffix = Math.floor(Math.random() * 9999).toString();
            userSlug = (0, slug_1.default)(safeData.data.name + slugSuffix);
        }
        else {
            genSlug = false;
        }
    }
    // gerar um hash de senha
    const hashPassword = yield (0, bcrypt_ts_1.hash)(safeData.data.password, 10);
    // criar usuário
    const newUser = yield (0, user_1.createUser)({
        slug: userSlug,
        name: safeData.data.name,
        email: safeData.data.email,
        password: hashPassword
    });
    // criar token
    const token = (0, jwt_1.createJWT)(userSlug);
    console.log('---- token : ' + token);
    // retornar resultado (token, user)
    res.status(201).json({
        token,
        user: {
            name: newUser === null || newUser === void 0 ? void 0 : newUser.name,
            slug: newUser === null || newUser === void 0 ? void 0 : newUser.slug,
            avatar: newUser === null || newUser === void 0 ? void 0 : newUser.avatar
        }
    });
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // validar dados recebidos
    const safeData = signin_1.signinSchema.safeParse(req.body);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }
    // verificar email
    const user = yield (0, user_1.findUserByEmail)(safeData.data.email);
    if (!user) {
        res.status(401).json({ error: "Acesso negado!" });
        return;
    }
    // verificar email
    const verifyPass = yield (0, bcrypt_ts_1.compare)(safeData.data.password, user.password);
    if (!verifyPass) {
        res.status(401).json({ error: "Acesso negado!" });
        return;
    }
    //tudo certo, criar token
    const token = (0, jwt_1.createJWT)(user.slug);
    // retornar user
    res.json({
        token,
        user: {
            name: user.name,
            slug: user.slug,
            avatar: user.avatar
        }
    });
});
exports.signin = signin;
