import {Module} from "vuex";
import {RecordingState} from "@/store/plugins/obs/types";
import {RootState} from "@/types";
import {OBSEventTypes, OBSResponseTypes} from "obs-websocket-js/dist/types";

const obsRecordingModule: Module<RecordingState, RootState> = {
    state: {
        active: false,
        paused: false,
        path: null,
        last_path: null,
        bytes: 0,
        duration: 0,
        timecode: "00:00:00.000"
    },
    actions: {
        'init'({getters:{client}, commit}) {
            client.on('RecordStateChanged', (state:OBSEventTypes['RecordStateChanged']) => {
                if(state.outputState === "OBS_WEBSOCKET_OUTPUT_PAUSED" || state.outputState === "OBS_WEBSOCKET_OUTPUT_RESUMED"){
                    commit('recording/set/paused',!state.outputActive)
                }else {
                    commit('recording/set/active',state.outputActive)
                    // @ts-expect-error TODO Waiting Update obs-websocket-js
                    const path = state.outputPath
                    if(!state.outputActive && path){
                        commit('recording/set/lastPath',path)
                    }else{
                        commit('recording/set/path',path)
                    }
                }

            });
        },
        'connection/closed'({commit}) {
            commit('recording/reset')
        },
        'connection/ready'({dispatch}) {
            return dispatch('recording/reload')
        },
        async 'recording/reload'({getters:{client},commit}){
            const status: OBSResponseTypes['GetRecordStatus'] = await client.call('GetRecordStatus')

            commit('recording/set/active',status.outputActive)
            // @ts-expect-error TODO Waiting Update obs-websocket-js
            commit('recording/set/paused',status.outputPaused)
            commit('recording/set/bytes',status.outputBytes)
            commit('recording/set/duration',status.outputDuration)
            commit('recording/set/timecode',status.outputTimecode)
        },
        async 'recording/start'({getters:{client}}){
            await client.call('StartRecord')
        },
        async 'recording/stop'({getters:{client}}){
            await client.call('StopRecord')
        },
        async 'recording/toogle'({getters:{client},commit}){
            await client.call('ToggleRecord')
        },
        async 'recording/resume'({getters:{client}}){
            await client.call('ResumeRecord')
        },
        async 'recording/pause'({getters:{client}}){
            await client.call('PauseRecord')
        },
        async 'recording/togglePause'({getters:{client},commit}){
            await client.call('ToggleRecordPause')
        }
    },
    getters: {
        isRecordingActive(state): boolean {
            return state.active
        },
        isRecordingPaused(state): boolean {
            return state.paused
        }
    },
    mutations: {
        'recording/reset'(state) {
            state.active = false
            state.paused = false
            state.path = null
            state.last_path = null
            state.bytes = 0
            state.duration = 0
            state.timecode = "00:00:00.000"
        },
        'recording/set/active'(state, status: boolean){
            state.active = status
        },
        'recording/set/paused'(state, paused: boolean){
            state.paused = paused
        },
        'recording/set/path'(state, path: string|null){
            state.path = path
        },
        'recording/set/lastPath'(state, path: string|null){
            state.last_path = path
        },
        'recording/set/bytes'(state, bytes: number){
            state.bytes = bytes
        },
        'recording/set/duration'(state, duration: number){
            state.duration = duration
        },
        'recording/set/timecode'(state, timecode: string){
            state.timecode = timecode
        }
    }
}

export default obsRecordingModule