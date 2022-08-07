import {Module} from "vuex";
import {RecordingState} from "@/store/plugins/obs/types";
import {RootState} from "@/types";

const obsRecordingModule: Module<RecordingState, RootState> = {
    state: {
    },
    actions: {
        'connection/closed'({commit}) {
            commit('connectionClosed')
        },
        'connection/ready'({commit}) {
            commit('connectionReady')
        }
    },
    getters: {
    },
    mutations: {
    }
}

export default obsRecordingModule