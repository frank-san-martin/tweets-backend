"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const express_1 = require("express");
const pingController = __importStar(require("../controllers/ping"));
const authController = __importStar(require("../controllers/auth"));
const tweetController = __importStar(require("../controllers/tweet"));
const userController = __importStar(require("../controllers/user"));
const feedController = __importStar(require("../controllers/feed"));
const searchController = __importStar(require("../controllers/search"));
const trendController = __importStar(require("../controllers/trend"));
const suggestionController = __importStar(require("../controllers/suggestion"));
const jwt_1 = require("../utils/jwt");
exports.mainRouter = (0, express_1.Router)();
exports.mainRouter.get('/ping', pingController.ping);
exports.mainRouter.get('/privatePing', jwt_1.verifyJWT, pingController.privatePing);
exports.mainRouter.post('/auth/signup', authController.signup);
exports.mainRouter.post('/auth/signin', authController.signin);
exports.mainRouter.post('/tweet', jwt_1.verifyJWT, tweetController.addTweet);
exports.mainRouter.get('/tweet/:id', jwt_1.verifyJWT, tweetController.getTweet);
exports.mainRouter.get('/tweet/:id/answers', jwt_1.verifyJWT, tweetController.getAnswers); // resposta de um determinado tweet
exports.mainRouter.post('/tweet/:id/like', jwt_1.verifyJWT, tweetController.likeToggle); // TOGO: se tem like, tira. Se não tem coloca
exports.mainRouter.get('/user/:slug', jwt_1.verifyJWT, userController.getUser);
exports.mainRouter.get('/user/:slug/tweets', jwt_1.verifyJWT, userController.getUserTweets);
exports.mainRouter.post('/user/:slug/follow', jwt_1.verifyJWT, userController.followToggle);
exports.mainRouter.put('/user', jwt_1.verifyJWT, userController.updateUser);
// mainRouter.put('/user/avatar', verifyJWT,);
// mainRouter.put('/user/cover', verifyJWT,);
exports.mainRouter.get('/feed', jwt_1.verifyJWT, feedController.getFeed);
exports.mainRouter.get('/search', jwt_1.verifyJWT, searchController.searchTweet);
exports.mainRouter.get('/trending', jwt_1.verifyJWT, trendController.getTrends);
exports.mainRouter.get('/suggestions', jwt_1.verifyJWT, suggestionController.getSuggestions);
