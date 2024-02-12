import type { FunctionInvokeOptions } from '@supabase/functions-js';
import { createClient } from '@supabase/supabase-js'

import type { JoinRequest } from '../shared/JoinRequest.ts';


const debug = true;
const supabaseUrl = debug ? 'http://127.0.0.1:54321' : 'https://asnfdrmtqnjwbwwuhvdw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbmZkcm10cW5qd2J3d3VodmR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc3MDY1NDgsImV4cCI6MjAyMzI4MjU0OH0.szzdtS_MpB3dcvMZ9B2mApmZtJoeT_ZSmklV5wQHI4c'

export const supabase = createClient(supabaseUrl, supabaseKey)

export function createGame(gameData: object) {
    supabase.functions.invoke('create-game', { body: gameData } as FunctionInvokeOptions).then((response) => {

        if (response.error) {
            console.error(response.error);
            return;
        }

        console.log(response.data);
    });
}

export function joinGame(request: JoinRequest) {
    supabase.functions.invoke('join-game', { body: request } as FunctionInvokeOptions).then((response) => {
        if (response.error) {
            console.error(response.error);
            return;
        }

        console.log(response.data);
    });
}
