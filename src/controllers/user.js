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
exports.updateUser = exports.followToggle = exports.getUserTweets = exports.getUser = void 0;
const user_1 = require("../services/user");
const user_tweets_1 = require("../schemas/user-tweets");
const update_user_1 = require("../schemas/update-user");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const user = yield (0, user_1.findUserBySlug)(slug);
    if (!user) {
        res.json({ error: 'Usuário inexistente!' });
        return;
    }
    const followingCount = yield (0, user_1.getUserFollowingCount)(user.slug);
    const followersCount = yield (0, user_1.getUserFollowersCount)(user.slug);
    const tweetCount = yield (0, user_1.getUserTweetCount)(user.slug);
    res.json({ user, followingCount, followersCount, tweetCount });
    return;
});
exports.getUser = getUser;
const getUserTweets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { slug } = req.params;
    // validar dados recebidos. (queryString da paginação)
    const safeData = user_tweets_1.userTweetsSchema.safeParse(req.query);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }
    // preparar a paginação
    let perPage = 2; // qts tweets por pagina?
    let currentPage = (_a = safeData.data.page) !== null && _a !== void 0 ? _a : 0; // se veio page, fica ele, caso contrário o 0
    const tweets = yield (0, user_1.findTweetsByUser)(slug, currentPage, perPage);
    res.json({ tweets, page: currentPage }); // retorno os tweets e a página atual
    return;
});
exports.getUserTweets = getUserTweets;
const followToggle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const me = req.userSlug;
    const hasUserTobeFollowed = yield (0, user_1.findUserBySlug)(slug);
    if (!hasUserTobeFollowed) {
        res.json({ error: 'Usuário inexistente!' });
        return;
    }
    // aqui ainda é possível verificar se você não esta tentando seguir vc mesmo
    //seguir (me =  eu, slug = quem eu quero seguir)
    const follows = yield (0, user_1.checkIfFollow)(me, slug);
    if (!follows) {
        // não sigo, então add
        yield (0, user_1.follow)(me, slug);
        res.json({ following: true });
        return;
    }
    else {
        // deixar de seguir
        yield (0, user_1.unfollow)(me, slug);
        res.json({ following: false });
        return;
    }
});
exports.followToggle = followToggle;
// alterar usuário
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    // validar dados com schema
    const safeData = update_user_1.updateUserSchema.safeParse(req.body);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }
    // executar update
    yield (0, user_1.updateUserInfo)(req.userSlug, safeData.data);
    res.json({});
    return;
});
exports.updateUser = updateUser;
