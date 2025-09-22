'use client'
import { Session } from "inspector/promises"
import { signOut } from "next-auth/react"

export default function Logout(){
    return(
        <a className="absolute right-0" onClick={() => signOut()}>로그아웃</a>
    )
}