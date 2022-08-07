import {Module} from "vuex";
import {ExampleState} from "@/store/plugins/obs/types";
import {RootState} from "@/types";

const obsStreamModule: Module<ExampleState, RootState> = {
    state: {
    },
    actions: {
        'connection/closed'({commit}) {
            commit('connectionClosed')
        },
        async 'connection/ready'({commit}) {
            commit('connectionReady')
        }
    },
    getters: {
    },
    mutations: {
    }
}

export default obsStreamModule