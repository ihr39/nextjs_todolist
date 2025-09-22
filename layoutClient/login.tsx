'use client'
import { signIn } from "next-auth/react"

export default function LogIn(){
    return(
        <a className="absolute right-0" onClick={() => signIn()}>로그인</a>
    )
}