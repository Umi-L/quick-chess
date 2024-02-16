import type { FunctionInvokeOptions } from '@supabase/functions-js';
import { createClient, type RealtimePostgresInsertPayload, type RealtimePostgresUpdatePayload } from '@supabase/supabase-js'
import type { GameInfo } from '../shared/GameInfo';
import type { JoinRequest } from '../shared/JoinRequest';
import { currentGame, gameBoard, ghostMoves, isHost, myColor, possibleMoves, selectedPiece } from './globals';
import { Game } from './games/Game';
import { getOppositeColor } from './Color';
import { BaseGame } from './games/BaseGame';
import { Queen } from './pieces/Queen';
import { Rook } from './pieces/Rook';
import { King } from './pieces/King';
import { Pawn } from './pieces/Pawn';
import { Bishop } from './pieces/Bishop';
import { Knight } from './pieces/Knight';
import { Board } from './Board';


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

export async function createGame(gameData: Game) {

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
        game_state: serializeGame(gameData),
        other_id: null,
        id: gid,

    } as GameInfo);

    if (error) {
        console.error(error);
        gameID = undefined;
    }

    isHost.set(true);
    myColor.set(gameData.hostColor);

    supabase
        .channel('games')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'games' }, handlePayload)
        .subscribe()

    supabase
        .channel('games')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'games' }, handlePayload)
        .subscribe()

    gameID = gid;


}

export function copyGameIDUrl() {
    navigator.clipboard.writeText(`${window.location.origin}?id=${gameID}`);
}

export async function joinGame(id: string) {
    const session = await supabase.auth.getSession();
    // if no session, return empty headers
    if (session.data.session === null) {
        console.error('No session found');
        return {};
    }

    // find postgres row with matching id
    let { data, error } = await supabase.from('games').select('*').eq('id', id);

    if (error) {
        console.error(error);
        return;
    }

    if (data === null) {
        console.error('No game found with that id');
        return;
    }

    let game = data[0] as GameInfo;
    let gameState = game.game_state as string;

    let newGame = handleGameState(gameState);


    isHost.set(false);

    myColor.set(getOppositeColor(newGame.hostColor));
    gameID = id;


    // set row other_id to current user id
    let { error: updateError } = await supabase.from('games').update({ other_id: session.data.session.user.id }).eq('id', id);

    if (updateError) {
        console.error(updateError);
        return;
    }

    supabase
        .channel('games')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'games' }, handlePayload)
        .subscribe()

    supabase
        .channel('games')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'games' }, handlePayload)
        .subscribe()
}

function serializeGame(gameInstance: Game) {
    return JSON.stringify(gameInstance, (key, value) => {
        if (value && typeof (value) === "object") {
            value.__type = value.constructor.name;
        }
        return value;
    });
}

function deserializeGame(jsonString: string): Game {
    const classes: { [key: string]: { new(...args: any): any } } = {
        BaseGame,
        Rook,
        Queen,
        King,
        Pawn,
        Bishop,
        Knight,
        Board
    };
    return JSON.parse(jsonString, (key, value): Game => {
        if (value && typeof (value) === "object" && value.__type) {
            const DynamicClass = classes[value.__type];

            if (!DynamicClass) {
                throw new Error(`Unknown class: ${value.__type}`);
            }

            value = Object.assign(new DynamicClass(), value);
            // delete value.__type;
        }

        return value;
    });
}

export async function updateGame(game: Game) {

    console.log("updating game", game);

    let { error } = await supabase.from('games').update({ game_state: game }).eq('id', gameID);

    if (error) {
        console.error(error);
    }
}

function handlePayload(payload: RealtimePostgresUpdatePayload<{
    [key: string]: any;
}> | RealtimePostgresInsertPayload<{
    [key: string]: any;
}>) {
    // if payload new id is same as current game id, update game
    if (payload.new.id === gameID) {
        let gameState = payload.new.game_state as string;

        handleGameState(gameState);
    }
}

function handleGameState(gameState: string): Game {
    let newGame = deserializeGame(gameState);

    console.log("gameStateString", gameState);

    // console.log("new game", newGame);

    if (!newGame.onLoad) {
        console.error("Game does not have onLoad method has:" + newGame.onLoad);
        console.error(newGame);
        return newGame;
    }

    newGame.onLoad();

    newGame.board.printBoard();


    currentGame.set(newGame);
    gameBoard.set(newGame.board);
    possibleMoves.set([]);
    ghostMoves.set([]);
    selectedPiece.set(undefined);


    return newGame;
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
