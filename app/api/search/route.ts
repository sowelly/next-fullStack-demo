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