import {Module} from "vuex";
import {StreamState} from "@/store/plugins/obs/types";
import {RootState} from "@/types";
import {OBSEventTypes, OBSResponseTypes} from "obs-websocket-js/dist/types";

const emptyStateStatus:OBSResponseTypes['GetStreamStatus'] = {
    outputActive: false,
    outputReconnecting: false,
    outputTimecode: "00:00:00.000",
    outputDuration: 0,
    outputBytes: 0,
    outputSkippedFrames: 0,
    outputTotalFrames: 0
}

const obsStreamModule: Module<StreamState, RootState> = {
    state: {
        active: false,
        status: emptyStateStatus
    },
    actions: {
        'init'({getters:{client}, commit}) {
            client.on('StreamStateChanged', (state:OBSEventTypes['StreamStateChanged']) => commit('stream/set/active',state.outputActive));
        },
        'connection/closed'({commit}) {
            commit('stream/reset')
        },
        async 'connection/ready'({dispatch}) {
            return dispatch('stream/reload')
        },
        async 'stream/reload'({getters:{client},commit}){
            const status: OBSResponseTypes['GetStreamStatus'] = await client.call('GetStreamStatus')
            commit('stream/status',status)
        },
        // TODO Only on Stream
        async 'stream/caption'({getters:{client}}, text: string){
            await client.call('SendStreamCaption',{
                captionText: text
            })
        },
        async 'stream/start'({getters:{client}}){
            await client.call('StartStream')
        },
        async 'stream/stop'({getters:{client}}){
            await client.call('StopStream')
        },
        async 'stream/toogle'({getters:{client},commit}){
            const status: OBSResponseTypes['ToggleStream'] = await client.call('ToggleStream')
            commit('stream/set/active',status.outputActive)
        }
    },
    getters: {
        isStreamActive(state): boolean {
            return state.active
        },
    },
    mutations: {
        'stream/reset'(state) {
            state.active = false
            state.status = emptyStateStatus
        },
        'stream/status'(state, status: OBSResponseTypes['GetStreamStatus']){
            state.active = status.outputActive
            state.status = status
        },
        'stream/set/active'(state, status: boolean){
            state.active = status
        }
    }
}

export default obsStreamModule