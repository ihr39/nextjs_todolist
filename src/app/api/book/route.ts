import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    let json = await req.json()
    console.log(json)
    return NextResponse.json({returnMsg:'성공'},{status:200})
}