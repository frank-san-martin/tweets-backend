import { date } from "zod";
import { prisma } from "../utils/prisma"

export const addHashtag = async (hashtag: string) => {
    const hs = await prisma.trend.findFirst({
        where: { hashtag }
    });
    if (hs) {
        await prisma.trend.update({
            where: { id: hs.id },
            data: { counter: hs.counter + 1, updatedAt: new Date() }
        });
    } else {
        await prisma.trend.create({ data: { hashtag } });
    }
}


export const getTrending = async () => {
    const trends = await prisma.trend.findMany({
        select: {
            hashtag: true,
            counter: true
        }, // aqui: se quizer pode adicionar where para filtar por data por exemplo. Só as ultimas 48h
        orderBy: { counter: 'desc' },
        take: 4
    });
    return trends;
}