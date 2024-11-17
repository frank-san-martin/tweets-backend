import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { findUserBySlug } from '../services/user';
import { ExtendedRequest } from '../types/extended-request';

export const createJWT = (slug: string) => {
    const token = jwt.sign({ slug }, process.env.JWT_SECRET as string);
    return token;
}

export const verifyJWT = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.status(401).json({ error: "Acesso Negado!" });
        return;
    }

    const token = authHeader.split(' ')[1];
    //console.log('---token:' + token);
    jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        async (error, decoded: any) => {
            if (error) {
                res.status(401).json({ error: "Acesso Negado!  1" });
                return;
            }
            const user = await findUserBySlug(decoded.slug);
            if (!user) {
                res.status(401).json({ error: "Acesso Negado!  2" });
                return;
            }
            req.userSlug = user.slug;
            next();
        }
    );

}