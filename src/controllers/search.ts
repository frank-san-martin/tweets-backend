import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { searchSchema } from "../schemas/search";
import { findTweetsByBody } from "../services/tweet";

export const searchTweet = async (req: ExtendedRequest, res: Response) => {
    // validar dados recebidos. (queryString da paginação)
    const safeData = searchSchema.safeParse(req.query);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    // preparar a paginação
    let perPage = 2; // qts tweets por pagina?
    let currentPage = safeData.data.page ?? 0;  // se veio page, fica ele, caso contrário o 0

    const tweets = await findTweetsByBody(safeData.data.q, currentPage, perPage);
    res.json({ tweets, page: currentPage });
    return;
}
