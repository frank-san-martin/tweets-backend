import { Request, Response, } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { addTweetSchema } from "../schemas/add-tweet";
import { checkIfTweetIsLikedByUser, createTweet, findAnswersFromTweets, findTweet, likeTweet, unLikeTweet } from "../services/tweet";
import { number } from "zod";
import { addHashtag } from "../services/trend";

export const addTweet = async (req: ExtendedRequest, res: Response) => {
    // validar
    const safeData = addTweetSchema.safeParse(req.body);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    // verificar se é resposta
    if (safeData.data.answer) {
        const hasAnswerTweet = await findTweet(parseInt(safeData.data.answer));
        if (!hasAnswerTweet) {
            res.json({ error: "Tweet original inexistente!" });
            return;
        }
    }
    // criar tweet
    const newTweet = await createTweet(
        req.userSlug as string,
        safeData.data.body,
        safeData.data.answer ? parseInt(safeData.data.answer) : 0
    );

    // add #hastag ao trend
    const hashtags = safeData.data.body.match(/#[a-zA-Z0-9_]+/g);  // expressão regular para identificar as hashtags
    if (hashtags) { // existem
        for (let hashtag of hashtags) { // fazer um laço em cada uma
            if (hashtag.length >= 3) { // verifica se pelo menos tem 3 ou mais caracteres
                await addHashtag(hashtag);
            }
        }
    }

    res.json({ tweet: newTweet });
    return;
};


export const getTweet = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;
    const tweet = await findTweet(parseInt(id));
    if (!tweet) {
        res.json({ error: 'Twwet inexistente!' });
        return;
    }
    res.json({ tweet });
    return;
}




export const getAnswers = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;
    const answers = await findAnswersFromTweets(parseInt(id));

    res.json({ answers });
    return;
}



export const likeToggle = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;

    const liked = await checkIfTweetIsLikedByUser(req.userSlug as string, parseInt(id));
    if (liked) {
        unLikeTweet(req.userSlug as string, parseInt(id));
    } else {
        likeTweet(req.userSlug as string, parseInt(id));
    }
    res.json({});
}