import { z } from "zod";

const idSchema = z.coerce.number().int().positive();
const emailSchema = z.string().email().max(255);

export const operatorSchema = z.object({
    email: emailSchema,
    password: z.string().max(120),
})

export const monitorSchema = z.object({
    name: z.string().min(1).max(120),
    url: z.string().url(),
    interval_seconds: z.coerce.number().int().min(10).max(3600).default(60),
    expected_status: z.coerce.number().int().min(100).max(599).default(200),
    is_active: z.coerce.boolean().default(true),
})