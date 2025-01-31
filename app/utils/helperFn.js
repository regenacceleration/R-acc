import env from "../constants/env"

export const urlGeneration=(path)=>`${env.supabaseUrl}/storage/v1/object/public/${path}`