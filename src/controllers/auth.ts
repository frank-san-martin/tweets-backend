import { Request, Response } from "express";
import slug from "slug";
import { compare, hash } from "bcrypt-ts";

import { createUser, findUserByEmail, findUserBySlug } from "../services/user";
import { createJWT } from "../utils/jwt";
import { signinSchema } from "../schemas/signin";
import { signupSchema } from "../schemas/signup";
import { date } from "zod";

export const signup = async (req: Request, res: Response) => {
    // validar dados recebidos
    const safeData = signupSchema.safeParse(req.body);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    // verificar email
    const hasEmail = await findUserByEmail(safeData.data.email);
    if (hasEmail) {
        res.json({ error: "E-mail já esta sendo usado!" });
        return;
    }

    // verificar slug
    let genSlug = true;
    let userSlug = slug(safeData.data.name);
    while (genSlug) {
        const hasslug = await findUserBySlug(userSlug);
        if (hasslug) {
            let slugSuffix = Math.floor(Math.random() * 9999).toString();
            userSlug = slug(safeData.data.name + slugSuffix);
        } else {
            genSlug = false;
        }
    }

    // gerar um hash de senha
    const hashPassword = await hash(safeData.data.password, 10);

    // criar usuário
    const newUser = await createUser({
        slug: userSlug,
        name: safeData.data.name,
        email: safeData.data.email,
        password: hashPassword
    });

    // criar token
    const token = createJWT(userSlug);
    console.log('---- token : ' + token);
    // retornar resultado (token, user)
    res.status(201).json({
        token,
        user: {
            name: newUser?.name,
            slug: newUser?.slug,
            avatar: newUser?.avatar
        }
    });
};


export const signin = async (req: Request, res: Response) => {
    // validar dados recebidos
    const safeData = signinSchema.safeParse(req.body);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    // verificar email
    const user = await findUserByEmail(safeData.data.email);
    if (!user) {
        res.status(401).json({ error: "Acesso negado!" });
        return;
    }

    // verificar email
    const verifyPass = await compare(safeData.data.password, user.password);
    if (!verifyPass) {
        res.status(401).json({ error: "Acesso negado!" });
        return;
    }

    //tudo certo, criar token
    const token = createJWT(user.slug);

    // retornar user
    res.json({
        token,
        user: {
            name: user.name,
            slug: user.slug,
            avatar: user.avatar
        }
    });
}