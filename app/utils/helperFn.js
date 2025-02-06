import env from "../constants/env"

export const urlGeneration = (path) => `${env.supabaseUrl}/storage/v1/object/public/${path}`

export const getAddress = () => localStorage.getItem("address");

export const formatAddress=(address)=>`${address.slice(0,6)}....${address.slice(address.length-6, address.length)}`