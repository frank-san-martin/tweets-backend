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
exports.getUserSuggestions = exports.getUserFollowing = exports.updateUserInfo = exports.unfollow = exports.follow = exports.checkIfFollow = exports.findTweetsByUser = exports.getUserTweetCount = exports.getUserFollowersCount = exports.getUserFollowingCount = exports.createUser = exports.findUserBySlug = exports.findUserByEmail = void 0;
const prisma_1 = require("../utils/prisma");
const url_1 = require("../utils/url");
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findFirst({
        where: { email }
    });
    if (user) {
        return Object.assign(Object.assign({}, user), { avatar: (0, url_1.getPublicUrl)(user.avatar), cover: (0, url_1.getPublicUrl)(user.cover) });
    }
    return null;
});
exports.findUserByEmail = findUserByEmail;
const findUserBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findFirst({
        select: {
            avatar: true,
            cover: true,
            slug: true,
            name: true,
            bio: true,
            link: true
        },
        where: { slug }
    });
    if (user) {
        return Object.assign(Object.assign({}, user), { avatar: (0, url_1.getPublicUrl)(user.avatar), cover: (0, url_1.getPublicUrl)(user.cover) });
    }
    return null;
});
exports.findUserBySlug = findUserBySlug;
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield prisma_1.prisma.user.create({ data });
    if (newUser) {
        return Object.assign(Object.assign({}, newUser), { avatar: (0, url_1.getPublicUrl)(newUser.avatar), cover: (0, url_1.getPublicUrl)(newUser.cover) });
    }
    return null;
});
exports.createUser = createUser;
// qtos usuários estão sendo seguidos por este user?
const getUserFollowingCount = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield prisma_1.prisma.follow.count({
        where: { user1Slug: slug }
    });
    return count;
});
exports.getUserFollowingCount = getUserFollowingCount;
// qtos usuários seguem este user?
const getUserFollowersCount = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield prisma_1.prisma.follow.count({
        where: { user2slug: slug }
    });
    return count;
});
exports.getUserFollowersCount = getUserFollowersCount;
// qtos tweets este usuário fez?
const getUserTweetCount = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield prisma_1.prisma.tweet.count({
        where: { userSlug: slug }
    });
    return count;
});
exports.getUserTweetCount = getUserTweetCount;
// qtos tweets este usuário fez?
const findTweetsByUser = (slug, currentPage, perPage) => __awaiter(void 0, void 0, void 0, function* () {
    const tweets = yield prisma_1.prisma.tweet.findMany({
        include: {
            likes: {
                select: {
                    userSlug: true
                }
            }
        },
        where: { userSlug: slug, answerOf: 0 },
        orderBy: { createdAt: 'desc' },
        skip: currentPage * perPage, // qts itens vai pular
        take: perPage // pega qts
    });
    return tweets;
});
exports.findTweetsByUser = findTweetsByUser;
// user1 segue user2?
const checkIfFollow = (user1Slug, user2slug) => __awaiter(void 0, void 0, void 0, function* () {
    const follows = yield prisma_1.prisma.follow.findFirst({
        where: { user1Slug, user2slug }
    });
    return follows ? true : false;
});
exports.checkIfFollow = checkIfFollow;
// seguir
const follow = (user1Slug, user2slug) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.follow.create({
        data: { user1Slug, user2slug }
    });
});
exports.follow = follow;
// deixar de seguir
const unfollow = (user1Slug, user2slug) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.follow.deleteMany({
        where: { user1Slug, user2slug }
    });
});
exports.unfollow = unfollow;
// alterar usuário
const updateUserInfo = (slug, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.user.update({ where: { slug }, data });
});
exports.updateUserInfo = updateUserInfo;
// lista de usuários que eu sigo
const getUserFollowing = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const following = [];
    const reqFollow = yield prisma_1.prisma.follow.findMany({
        select: { user2slug: true },
        where: { user1Slug: slug }
    });
    // jogar todos os slug encontrados no array
    for (let reqItem of reqFollow) {
        following.push(reqItem.user2slug);
    }
    return following;
});
exports.getUserFollowing = getUserFollowing;
// Sugestões para seguir
const getUserSuggestions = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const following = yield (0, exports.getUserFollowing)(slug);
    const followingPlusMe = [...following, slug];
    const suggestions = yield prisma_1.prisma.$queryRaw `
        SELECT
            name, avatar, slug
        FROM "User"
        WHERE
            slug NOT IN (${followingPlusMe.join(',')})
        ORDER BY RANDOM()
        LIMIT 2;
    `;
    for (let sugIndex in suggestions) {
        suggestions[sugIndex].avatar = (0, url_1.getPublicUrl)(suggestions[sugIndex].avatar);
    }
    return suggestions;
});
exports.getUserSuggestions = getUserSuggestions;
