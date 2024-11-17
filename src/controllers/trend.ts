import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { getTrending } from "../services/trend";

// buscando as 04 trends mais pontuadas
export const getTrends = async (req: ExtendedRequest, res: Response) => {
    const tweets = await getTrending();
    res.json({ tweets });
    return;
}
