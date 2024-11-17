import { prisma } from "../utils/prisma";
import { getPublicUrl } from "../utils/url";
import { Prisma } from "@prisma/client";


export const findUserByEmail = async (email: string) => {
    const user = await prisma.user.findFirst({
        where: { email }
    });

    if (user) {
        return {
            ...user,
            avatar: getPublicUrl(user.avatar),
            cover: getPublicUrl(user.cover),
        }
    }
    return null;

};



export const findUserBySlug = async (slug: string) => {
    const user = await prisma.user.findFirst({
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
        return {
            ...user,
            avatar: getPublicUrl(user.avatar),
            cover: getPublicUrl(user.cover),
        }
    }
    return null;

};


export const createUser = async (data: Prisma.UserCreateInput) => {
    const newUser = await prisma.user.create({ data });
    if (newUser) {
        return {
            ...newUser,
            avatar: getPublicUrl(newUser.avatar),
            cover: getPublicUrl(newUser.cover)
        }
    }
    return null;

};

// qtos usuários estão sendo seguidos por este user?
export const getUserFollowingCount = async (slug: string) => {
    const count = await prisma.follow.count({
        where: { user1Slug: slug }
    })
    return count;
}

// qtos usuários seguem este user?
export const getUserFollowersCount = async (slug: string) => {
    const count = await prisma.follow.count({
        where: { user2slug: slug }
    })
    return count;
}

// qtos tweets este usuário fez?
export const getUserTweetCount = async (slug: string) => {
    const count = await prisma.tweet.count({
        where: { userSlug: slug }
    })
    return count;
}



// qtos tweets este usuário fez?
export const findTweetsByUser = async (slug: string, currentPage: number, perPage: number) => {
    const tweets = await prisma.tweet.findMany({
        include: {
            likes: {
                select: {
                    userSlug: true
                }
            }
        },
        where:
            { userSlug: slug, answerOf: 0 },
        orderBy: { createdAt: 'desc' },
        skip: currentPage * perPage,  // qts itens vai pular
        take: perPage  // pega qts
    })
    return tweets;
}



// user1 segue user2?
export const checkIfFollow = async (user1Slug: string, user2slug: string) => {
    const follows = await prisma.follow.findFirst({
        where:
            { user1Slug, user2slug }
    })
    return follows ? true : false;
}


// seguir
export const follow = async (user1Slug: string, user2slug: string) => {
    await prisma.follow.create({
        data:
            { user1Slug, user2slug }
    })
}

// deixar de seguir
export const unfollow = async (user1Slug: string, user2slug: string) => {
    await prisma.follow.deleteMany({
        where:
            { user1Slug, user2slug }
    })
}

// alterar usuário
export const updateUserInfo = async (slug: string, data: Prisma.UserUpdateInput) => {
    await prisma.user.update({ where: { slug }, data });
};


// lista de usuários que eu sigo
export const getUserFollowing = async (slug: string) => {
    const following = [];
    const reqFollow = await prisma.follow.findMany({
        select: { user2slug: true },
        where: { user1Slug: slug }
    });

    // jogar todos os slug encontrados no array
    for (let reqItem of reqFollow) {
        following.push(reqItem.user2slug);
    }
    return following;
};


// Sugestões para seguir
export const getUserSuggestions = async (slug: string) => {
    const following = await getUserFollowing(slug);

    const followingPlusMe = [...following, slug];

    type Suggestion = Pick<
        Prisma.UserGetPayload<Prisma.UserDefaultArgs>,
        "name" | "avatar" | "slug"
    >;

    const suggestions: Suggestion[] = await prisma.$queryRaw`
        SELECT
            name, avatar, slug
        FROM "User"
        WHERE
            slug NOT IN (${followingPlusMe.join(',')})
        ORDER BY RANDOM()
        LIMIT 2;
    `;

    for (let sugIndex in suggestions) {
        suggestions[sugIndex].avatar = getPublicUrl(suggestions[sugIndex].avatar);
    }

    return suggestions;
}

