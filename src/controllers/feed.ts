import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { feedSchema } from "../schemas/feed";
import { getUserFollowing } from "../services/user";
import { findTweetFeed } from "../services/tweet";

export const getFeed = async (req: ExtendedRequest, res: Response) => {

    // validar dados recebidos. (queryString da paginação)
    const safeData = feedSchema.safeParse(req.query);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    // preparar a paginação
    let perPage = 2; // qts tweets por pagina?
    let currentPage = safeData.data.page ?? 0;  // se veio page, fica ele, caso contrário o 0
    const following = await getUserFollowing(req.userSlug as string);
    const tweets = await findTweetFeed(following, currentPage, perPage);
    res.json({ tweets, page: currentPage });
    return;
}
