import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { checkIfFollow, findTweetsByUser, findUserBySlug, follow, getUserFollowersCount, getUserFollowingCount, getUserTweetCount, unfollow, updateUserInfo } from "../services/user";
import { userTweetsSchema } from "../schemas/user-tweets";
import { updateUserSchema } from "../schemas/update-user";

export const getUser = async (req: ExtendedRequest, res: Response) => {
    const { slug } = req.params;
    const user = await findUserBySlug(slug);

    if (!user) {
        res.json({ error: 'Usuário inexistente!' });
        return;
    }

    const followingCount = await getUserFollowingCount(user.slug);
    const followersCount = await getUserFollowersCount(user.slug);
    const tweetCount = await getUserTweetCount(user.slug);

    res.json({ user, followingCount, followersCount, tweetCount });
    return;
}


export const getUserTweets = async (req: ExtendedRequest, res: Response) => {
    const { slug } = req.params;
    // validar dados recebidos. (queryString da paginação)
    const safeData = userTweetsSchema.safeParse(req.query);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    // preparar a paginação
    let perPage = 2; // qts tweets por pagina?
    let currentPage = safeData.data.page ?? 0;  // se veio page, fica ele, caso contrário o 0
    const tweets = await findTweetsByUser(slug, currentPage, perPage);
    res.json({ tweets, page: currentPage }); // retorno os tweets e a página atual
    return;
}


export const followToggle = async (req: ExtendedRequest, res: Response) => {
    const { slug } = req.params;
    const me = req.userSlug as string;

    const hasUserTobeFollowed = await findUserBySlug(slug);
    if (!hasUserTobeFollowed) {
        res.json({ error: 'Usuário inexistente!' });
        return;
    }

    // aqui ainda é possível verificar se você não esta tentando seguir vc mesmo

    //seguir (me =  eu, slug = quem eu quero seguir)
    const follows = await checkIfFollow(me, slug);
    if (!follows) {
        // não sigo, então add
        await follow(me, slug);
        res.json({ following: true });
        return;
    } else {
        // deixar de seguir
        await unfollow(me, slug);
        res.json({ following: false });
        return;

    }
}



// alterar usuário
export const updateUser = async (req: ExtendedRequest, res: Response) => {
    const { slug } = req.params;

    // validar dados com schema
    const safeData = updateUserSchema.safeParse(req.body);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    // executar update
    await updateUserInfo(req.userSlug as string, safeData.data);
    res.json({});
    return;

}
