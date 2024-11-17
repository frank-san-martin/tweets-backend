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
exports.likeToggle = exports.getAnswers = exports.getTweet = exports.addTweet = void 0;
const add_tweet_1 = require("../schemas/add-tweet");
const tweet_1 = require("../services/tweet");
const trend_1 = require("../services/trend");
const addTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // validar
    const safeData = add_tweet_1.addTweetSchema.safeParse(req.body);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }
    // verificar se é resposta
    if (safeData.data.answer) {
        const hasAnswerTweet = yield (0, tweet_1.findTweet)(parseInt(safeData.data.answer));
        if (!hasAnswerTweet) {
            res.json({ error: "Tweet original inexistente!" });
            return;
        }
    }
    // criar tweet
    const newTweet = yield (0, tweet_1.createTweet)(req.userSlug, safeData.data.body, safeData.data.answer ? parseInt(safeData.data.answer) : 0);
    // add #hastag ao trend
    const hashtags = safeData.data.body.match(/#[a-zA-Z0-9_]+/g); // expressão regular para identificar as hashtags
    if (hashtags) { // existem
        for (let hashtag of hashtags) { // fazer um laço em cada uma
            if (hashtag.length >= 3) { // verifica se pelo menos tem 3 ou mais caracteres
                yield (0, trend_1.addHashtag)(hashtag);
            }
        }
    }
    res.json({ tweet: newTweet });
    return;
});
exports.addTweet = addTweet;
const getTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const tweet = yield (0, tweet_1.findTweet)(parseInt(id));
    if (!tweet) {
        res.json({ error: 'Twwet inexistente!' });
        return;
    }
    res.json({ tweet });
    return;
});
exports.getTweet = getTweet;
const getAnswers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const answers = yield (0, tweet_1.findAnswersFromTweets)(parseInt(id));
    res.json({ answers });
    return;
});
exports.getAnswers = getAnswers;
const likeToggle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const liked = yield (0, tweet_1.checkIfTweetIsLikedByUser)(req.userSlug, parseInt(id));
    if (liked) {
        (0, tweet_1.unLikeTweet)(req.userSlug, parseInt(id));
    }
    else {
        (0, tweet_1.likeTweet)(req.userSlug, parseInt(id));
    }
    res.json({});
});
exports.likeToggle = likeToggle;
