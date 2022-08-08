import {Module} from "vuex";
import {InputState} from "@/store/plugins/obs/types";
import {RootState} from "@/types";
import {OBSEventTypes, OBSResponseTypes} from "obs-websocket-js/dist/types";

const obsInputModule: Module<InputState, RootState> = {
    state: {
    },
    actions: {
        'init'({getters:{client}, dispatch}) {
            client.on('InputCreated', () => dispatch('input/reload'));
            client.on('InputRemoved', () => dispatch('input/reload'));
            client.on('InputNameChanged', () => dispatch('input/reload'));
        },
        'connection/closed'({commit}) {
            commit('input/reset')
        },
        async 'connection/ready'({dispatch}) {
            return dispatch('input/reload')
        },
        async 'input/reload'({getters:{client},commit}){
            const status: OBSResponseTypes['GetInputList'] = await client.call('GetInputList')
            console.log(status)
        },
    },
    getters: {
    },
    mutations: {
        'input/reset'(state) {
            console.log(state)
        },
    }
}

export default obsInputModule