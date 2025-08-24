//The environment variables types are defined in the file 
//--> I had to create a folder called types and this file to make the environment variables work
//--> The previous next-env.d.ts file was not working because it is managed by Next.js and shouldnt be edited
//--> This file gives TypeScript the ability to understand the environment variables
//--> This file is used to type the environment variables
//--> Without this file, TS assumes all env vars are string | undefined. That was why there was an error from the client.ts file
//--> Types + runtime validation together = real safety
declare namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_ROLE_KEY: string;
      NEXT_PUBLIC_SUPABASE_JWT_SECRET: string;
      NEXT_PUBLIC_SUPABASE_JWT_AUDIENCE: string;
      NEXT_PUBLIC_SUPABASE_JWT_ISSUER: string;
      NEXT_PUBLIC_SUPABASE_JWT_SUBJECT: string;
      NEXT_PUBLIC_SUPABASE_JWT_EXPIRES_IN: string;
      NEXT_PUBLIC_SUPABASE_JWT_ALGORITHM: string;
      NEXT_PUBLIC_SUPABASE_JWT_ENCRYPTION_KEY: string;
      NODE_ENV: "development" | "test" | "production";
    }
  }
  