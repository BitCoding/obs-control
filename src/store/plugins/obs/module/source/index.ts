import {Module} from "vuex";
import {SourceState} from "@/store/plugins/obs/types";
import {RootState} from "@/types";
import {OBSRequestTypes, OBSResponseTypes} from "obs-websocket-js/dist/types";

const obsSourceModule: Module<SourceState, RootState> = {
    state: {
    },
    actions: {
        async 'source/active'({getters:{client}}, request: OBSRequestTypes['GetSourceActive']) : Promise<OBSResponseTypes['GetSourceActive']>{
           return client.call('GetSourceActive', request)
        },
        async 'source/screenshot'({getters:{client}}, request: OBSRequestTypes['GetSourceScreenshot']) : Promise<OBSResponseTypes['GetSourceScreenshot']>{
           return client.call('GetSourceScreenshot', request)
        },
        async 'source/saveScreenshot'({getters:{client}}, request: OBSRequestTypes['SaveSourceScreenshot']) : Promise<OBSResponseTypes['SaveSourceScreenshot']>{
           return client.call('SaveSourceScreenshot', request)
        },
    },
    getters: {
    },
    mutations: {
    }
}

export default obsSourceModule