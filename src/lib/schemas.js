import { z } from "zod";

const idSchema = z.coerce.number().int().positive();
const emailSchema = z.string().email().max(255);

export const operatorSchema = z.object({
    email: emailSchema,
    password: z.string().max(120),
})