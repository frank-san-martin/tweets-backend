import { z } from "zod";

export const addTweetSchema = z.object({
    body: z.string({ message: "Precisa enviar mensagem/foto/voice!" }),
    answer: z.string().optional()
})