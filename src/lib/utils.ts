import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getConnectedUser() {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('token')
    if (token) {
      const user = atob(token)
      return JSON.parse(user)
    }
    return null
  }
}