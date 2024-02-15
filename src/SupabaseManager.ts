import type { FunctionInvokeOptions } from '@supabase/functions-js';
import { createClient } from '@supabase/supabase-js'
import type { GameInfo } from '../shared/GameInfo';
import type { JoinRequest } from '../shared/JoinRequest';


const debug = true;
const supabaseUrl = debug ? 'http://127.0.0.1:54321' : 'https://asnfdrmtqnjwbwwuhvdw.supabase.co'
const supabaseKey = debug ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbmZkcm10cW5qd2J3d3VodmR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc3MDY1NDgsImV4cCI6MjAyMzI4MjU0OH0.szzdtS_MpB3dcvMZ9B2mApmZtJoeT_ZSmklV5wQHI4c'

export const supabase = createClient(supabaseUrl, supabaseKey)

let gameID: string | undefined = undefined;

async function getAuthHeaders() {

    // get current user session
    const session = await supabase.auth.getSession();

    // if no session, return empty headers
    if (session.data.session === null) {
        console.error('No session found');
        return {};
    }

    return {
        Authorization: `Bearer ${session.data.session?.access_token}`,
    };
}

export async function createGame(gameData: object) {

    const session = await supabase.auth.getSession();
    // if no session, return empty headers
    if (session.data.session === null) {
        console.error('No session found');
        return {};
    }

    let gid = crypto.randomUUID();

    // postgres add row to games table
    let { error } = await supabase.from('games').insert({
        host_id: session.data.session.user.id,
        game_state: gameData,
        other_id: null,
        id: gid,

    } as GameInfo);

    if (error) {
        console.error(error);
        gameID = undefined;
    }

    gameID = gid;


}

export async function joinGame(request: JoinRequest) {
    supabase.functions.invoke('join-game', { body: request, headers: { ...await getAuthHeaders() } } as FunctionInvokeOptions).then((response) => {
        if (response.error) {
            console.error(response.error);
            return;
        }

        console.log(response.data);
    });
}

export async function handleGoogleAuth() {

    // if there are url params, it means the user has been redirected from google
    // and we can get the auth code from the url
    const session = await supabase.auth.getSession();

    // if no url params, redirect to google auth
    if (session.data.session === null) {
        supabase.auth.signInWithOAuth({
            provider: 'google',
        });
    } else {
        // log the url params
        console.log(session);
    }
}
