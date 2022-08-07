import {OBSResponseTypes} from "obs-websocket-js/dist/types";
import {JsonObject} from "type-fest";

export interface CamState {
    active: boolean
}
export interface ObsState {
    connection: boolean|string
    version: OBSResponseTypes['GetVersion']
    studio: boolean
    //todos: TodoState
    // login: LoginState
}
export interface StreamState {
    active: boolean
    status: OBSResponseTypes['GetStreamStatus']
}
export interface RecordingState {
}
export interface HotkeyState {
    hotkeys: string[]
}
export interface ExampleState {
}
export interface SceneState {
    current: string;
    preview: string;
    scenes: JsonObject[];
}
export interface ObsConnectInfo {
    host: string
    port: number
    password?: string
}