import { link } from "fs";
import { z } from "zod";

export const updateUserSchema = z.object({
    name: z.string().min(3, 'Precisa ter 3 ou mais carateres!').optional(),
    bio: z.string().optional(),
    link: z.string().url('Precisa ser uma URL válida!').optional()
})