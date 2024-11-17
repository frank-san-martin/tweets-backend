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
exports.getFeed = void 0;
const feed_1 = require("../schemas/feed");
const user_1 = require("../services/user");
const tweet_1 = require("../services/tweet");
const getFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // validar dados recebidos. (queryString da paginação)
    const safeData = feed_1.feedSchema.safeParse(req.query);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }
    // preparar a paginação
    let perPage = 2; // qts tweets por pagina?
    let currentPage = (_a = safeData.data.page) !== null && _a !== void 0 ? _a : 0; // se veio page, fica ele, caso contrário o 0
    const following = yield (0, user_1.getUserFollowing)(req.userSlug);
    const tweets = yield (0, tweet_1.findTweetFeed)(following, currentPage, perPage);
    res.json({ tweets, page: currentPage });
    return;
});
exports.getFeed = getFeed;
