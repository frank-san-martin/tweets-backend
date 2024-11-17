import test from "node:test";
import { prisma } from "../utils/prisma";
import { getPublicUrl } from "../utils/url";
import slug from "slug";

export const findTweet = async (id: number) => {
    const tweet = await prisma.tweet.findFirst({
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                    slug: true,
                }
            },
            likes: {
                select: {
                    userSlug: true
                }
            }
        },
        where: { id }
    });

    if (tweet) {
        tweet.user.avatar = getPublicUrl(tweet.user.avatar);
        return tweet;
    }
    return null;
};


export const createTweet = async (slug: string, body: string, answer?: number) => {
    const newTweet = await prisma.tweet.create({
        data: {
            body,
            userSlug: slug,
            answerOf: answer ?? 0
        }
    });
    return newTweet;
}



export const findAnswersFromTweets = async (id: number) => {
    const tweets = await prisma.tweet.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                    slug: true,
                }
            },
            likes: {
                select: {
                    userSlug: true
                }
            }
        },
        where: {
            answerOf: id
        }
    });
    // atualizar avartar de todos
    for (let tweetIndex in tweets) {
        tweets[tweetIndex].user.avatar = getPublicUrl(tweets[tweetIndex].user.avatar);
    }
    return tweets;
}


// verifica se tweet foi curtido pelo usuário
export const checkIfTweetIsLikedByUser = async (slug: string, id: number) => {
    const isLiked = await prisma.tweetLike.findFirst({
        where: {
            userSlug: slug,
            tweetId: id
        }
    })
    return isLiked ? true : false;
}

// tira um like
export const unLikeTweet = async (slug: string, id: number) => {
    const isLiked = await prisma.tweetLike.deleteMany({
        where: {
            userSlug: slug,
            tweetId: id
        }
    })
}

// curtir
export const likeTweet = async (slug: string, id: number) => {
    const isLiked = await prisma.tweetLike.create({
        data: {
            userSlug: slug,
            tweetId: id
        }
    })
}



export const findTweetFeed = async (following: string[], currentPage: number, perPage: number) => {
    const tweets = await prisma.tweet.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                    slug: true,
                }
            },
            likes: {
                select: {
                    userSlug: true
                }
            }
        },
        where: {
            userSlug: { in: following },
            answerOf: 0
        },
        orderBy: { createdAt: 'desc' },
        skip: currentPage * perPage,
        take: perPage
    });
    // atualizar avartar de todos
    for (let tweetIndex in tweets) {
        tweets[tweetIndex].user.avatar = getPublicUrl(tweets[tweetIndex].user.avatar);
    }
    return tweets;
}


// search - acha os tweets pelo que tem no body deles
export const findTweetsByBody = async (bodyContains: string, currentPage: number, perPage: number) => {
    const tweets = await prisma.tweet.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                    slug: true,
                }
            },
            likes: {
                select: {
                    userSlug: true
                }
            }
        },
        where: {
            body: {
                contains: bodyContains,
                mode: 'insensitive'
            },
            answerOf: 0
        },
        orderBy: { createdAt: 'desc' },
        skip: currentPage * perPage,
        take: perPage
    });
    // atualizar avartar de todos
    for (let tweetIndex in tweets) {
        tweets[tweetIndex].user.avatar = getPublicUrl(tweets[tweetIndex].user.avatar);
    }
    return tweets;
}
