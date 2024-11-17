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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTweetsByBody = exports.findTweetFeed = exports.likeTweet = exports.unLikeTweet = exports.checkIfTweetIsLikedByUser = exports.findAnswersFromTweets = exports.createTweet = exports.findTweet = void 0;
const prisma_1 = require("../utils/prisma");
const url_1 = require("../utils/url");
const findTweet = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tweet = yield prisma_1.prisma.tweet.findFirst({
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
        tweet.user.avatar = (0, url_1.getPublicUrl)(tweet.user.avatar);
        return tweet;
    }
    return null;
});
exports.findTweet = findTweet;
const createTweet = (slug, body, answer) => __awaiter(void 0, void 0, void 0, function* () {
    const newTweet = yield prisma_1.prisma.tweet.create({
        data: {
            body,
            userSlug: slug,
            answerOf: answer !== null && answer !== void 0 ? answer : 0
        }
    });
    return newTweet;
});
exports.createTweet = createTweet;
const findAnswersFromTweets = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tweets = yield prisma_1.prisma.tweet.findMany({
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
        tweets[tweetIndex].user.avatar = (0, url_1.getPublicUrl)(tweets[tweetIndex].user.avatar);
    }
    return tweets;
});
exports.findAnswersFromTweets = findAnswersFromTweets;
// verifica se tweet foi curtido pelo usuário
const checkIfTweetIsLikedByUser = (slug, id) => __awaiter(void 0, void 0, void 0, function* () {
    const isLiked = yield prisma_1.prisma.tweetLike.findFirst({
        where: {
            userSlug: slug,
            tweetId: id
        }
    });
    return isLiked ? true : false;
});
exports.checkIfTweetIsLikedByUser = checkIfTweetIsLikedByUser;
// tira um like
const unLikeTweet = (slug, id) => __awaiter(void 0, void 0, void 0, function* () {
    const isLiked = yield prisma_1.prisma.tweetLike.deleteMany({
        where: {
            userSlug: slug,
            tweetId: id
        }
    });
});
exports.unLikeTweet = unLikeTweet;
// curtir
const likeTweet = (slug, id) => __awaiter(void 0, void 0, void 0, function* () {
    const isLiked = yield prisma_1.prisma.tweetLike.create({
        data: {
            userSlug: slug,
            tweetId: id
        }
    });
});
exports.likeTweet = likeTweet;
const findTweetFeed = (following, currentPage, perPage) => __awaiter(void 0, void 0, void 0, function* () {
    const tweets = yield prisma_1.prisma.tweet.findMany({
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
        tweets[tweetIndex].user.avatar = (0, url_1.getPublicUrl)(tweets[tweetIndex].user.avatar);
    }
    return tweets;
});
exports.findTweetFeed = findTweetFeed;
// search - acha os tweets pelo que tem no body deles
const findTweetsByBody = (bodyContains, currentPage, perPage) => __awaiter(void 0, void 0, void 0, function* () {
    const tweets = yield prisma_1.prisma.tweet.findMany({
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
        tweets[tweetIndex].user.avatar = (0, url_1.getPublicUrl)(tweets[tweetIndex].user.avatar);
    }
    return tweets;
});
exports.findTweetsByBody = findTweetsByBody;
