import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import supabase from "../../../lib/initSupabase";

interface IData {
    id: string
    task: string
    created_at: string
}

export async function GET(req: NextRequest) {
    try {
        const {data, error} = await supabase.from("todos").select();
        console.log('GET-data', data)
        return NextResponse.json({data}, {status: 200})
    } catch (e) {
        return NextResponse.json({error: 'fetch failed'}, {status: 500})
    }
}

function randomBigInt() {
    return Math.floor(Math.random() * 10000) + 1;
}

export async function POST(req: NextRequest) {
    const id = randomBigInt()
    console.log('POST-id', id)
    try {
        const {error} = await supabase.from("todos").insert({
            id,
            task: `task_${id}`
        });
        console.log('POST-error', error)
        return NextResponse.json({message: 'success'}, {status: 200})
    } catch (e) {
        console.log('POST-catch',)
        return NextResponse.json({error: 'fetch failed'}, {status: 500})
    }
}