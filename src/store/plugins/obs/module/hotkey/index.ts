import {Module} from "vuex";
import {HotkeyState} from "@/store/plugins/obs/types";
import {RootState} from "@/types";
import {OBSResponseTypes} from "obs-websocket-js/dist/types";

const obsHotKeyModule: Module<HotkeyState, RootState> = {
    state: {
        hotkeys: []
    },
    actions: {
        'connection/closed'({commit}) {
            commit('connectionClosed')
        },
        async 'connection/ready'({dispatch}) {
            return dispatch('hotkeys/reload')
        },
        async 'hotkeys/reload'({getters:{client},commit}){
            const status: OBSResponseTypes['GetHotkeyList'] = await client.call('GetHotkeyList')
            commit('hotkeys/set/keys',status.hotkeys)
        },
    },
    getters: {
    },
    mutations: {
        'hotkeys/set/keys'(state, keys: string[]){
            state.hotkeys = keys
        }
    }
}

export default obsHotKeyModule