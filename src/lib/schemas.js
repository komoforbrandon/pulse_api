import { z } from "zod";

const idSchema = z.coerce.number().int().positive();
const emailSchema = z.string().email().max(255);

export const listIdSchema = z.object({
    id: idSchema
})

export const operatorSchema = z.object({
    email: emailSchema,
    password: z.string().max(120),
})

export const monitorSchema = z.object({
    name: z.string().min(1).max(120),
    url: z.string().url(),
    interval_seconds: z.coerce.number().int().min(10).max(3600).default(60),
    expected_status: z.coerce.number().int().min(100).max(599).default(200),
    is_active: z.boolean().default(true),
})

export const listMonitorSchema = z.object({
    after: z.coerce.number().positive().optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const patchMonitorSchema = z.object({
    is_active: z.boolean().optional(),
    interval_seconds: z.coerce.number().int().min(10).max(3600).optional(),
})