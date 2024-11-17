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
exports.searchTweet = void 0;
const search_1 = require("../schemas/search");
const tweet_1 = require("../services/tweet");
const searchTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // validar dados recebidos. (queryString da paginação)
    const safeData = search_1.searchSchema.safeParse(req.query);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }
    // preparar a paginação
    let perPage = 2; // qts tweets por pagina?
    let currentPage = (_a = safeData.data.page) !== null && _a !== void 0 ? _a : 0; // se veio page, fica ele, caso contrário o 0
    const tweets = yield (0, tweet_1.findTweetsByBody)(safeData.data.q, currentPage, perPage);
    res.json({ tweets, page: currentPage });
    return;
});
exports.searchTweet = searchTweet;
