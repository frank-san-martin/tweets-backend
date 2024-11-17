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
exports.getTrending = exports.addHashtag = void 0;
const prisma_1 = require("../utils/prisma");
const addHashtag = (hashtag) => __awaiter(void 0, void 0, void 0, function* () {
    const hs = yield prisma_1.prisma.trend.findFirst({
        where: { hashtag }
    });
    if (hs) {
        yield prisma_1.prisma.trend.update({
            where: { id: hs.id },
            data: { counter: hs.counter + 1, updatedAt: new Date() }
        });
    }
    else {
        yield prisma_1.prisma.trend.create({ data: { hashtag } });
    }
});
exports.addHashtag = addHashtag;
const getTrending = () => __awaiter(void 0, void 0, void 0, function* () {
    const trends = yield prisma_1.prisma.trend.findMany({
        select: {
            hashtag: true,
            counter: true
        }, // aqui: se quizer pode adicionar where para filtar por data por exemplo. Só as ultimas 48h
        orderBy: { counter: 'desc' },
        take: 4
    });
    return trends;
});
exports.getTrending = getTrending;
