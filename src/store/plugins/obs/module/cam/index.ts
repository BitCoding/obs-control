import {Module} from "vuex";
import {CamState} from "@/store/plugins/obs/types";
import {RootState} from "@/types";
import {OBSEventTypes, OBSResponseTypes} from "obs-websocket-js/dist/types";

const obsCamModule: Module<CamState, RootState> = {
    state: {
        active: false
    },
    actions: {
        'init'({getters:{client}, commit}) {
            client.on('VirtualcamStateChanged', (state:OBSEventTypes['VirtualcamStateChanged']) => commit('cam/set/active',state.outputActive));
        },
        'connection/closed'({commit}) {
            commit('connectionClosed')
        },
        async 'connection/ready'({dispatch}) {
            return dispatch('cam/reload')
        },
        async 'cam/reload'({getters:{client},commit}){
            const status: OBSResponseTypes['GetVirtualCamStatus'] = await client.call('GetVirtualCamStatus')
            commit('cam/set/active',status.outputActive)
        },
        async 'cam/start'({getters:{client}}){
            await client.call('StartVirtualCam')
        },
        async 'cam/stop'({getters:{client}}){
            await client.call('StopVirtualCam')
        },
        async 'cam/toogle'({getters:{client},commit}){
            const status: OBSResponseTypes['ToggleVirtualCam'] = await client.call('ToggleVirtualCam')
            commit('cam/set/active',status.outputActive)
        }
    },
    getters: {
        isCamActive(state): boolean {
            return state.active
        },
    },
    mutations: {
        'cam/reset'(state) {
            state.active = false
        },
        'cam/set/active'(state, active: boolean){
            state.active = active
        }
    }
}

export default obsCamModule