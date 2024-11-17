import { z } from "zod";

export const searchSchema = z.object({
    q: z.string({ message: 'Preencha a busca!' }).min(3, 'Mínimo de 03 caracteres!'),
    page: z.coerce.number().min(0).optional()
})