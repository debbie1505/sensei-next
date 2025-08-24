//This file is used for runtime validation of the environment variables 
//--> Types stop compiler errors; they dont prevent missing envs at runtime
import {z} from "zod";
const schema = z.object({
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    OPENAI_API_KEY: z.string().optional(),
    NEXT_PUBLIC_OPENAI_API_KEY: z.string().optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const _env = schema.safeParse(process.env);

if(!_env.success) {
    console.error("X Invalid environment variables", _env.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
}
export const env = schema.parse(process.env);

//Type script helps type the environment varibale not store them