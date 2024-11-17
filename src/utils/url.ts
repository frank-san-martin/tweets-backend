export const getPublicUrl = (url: string) => {
    const baseUrl = process.env.BASE_URL?.replace(/(^"|"$)/g, ""); // Remove aspas extras
    return `${baseUrl}/${url}`;
}