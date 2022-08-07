import {Module} from 'vuex'
import {RootState} from "@/types";
import {SettingsState} from "@/store/modules/settings/types";


const settingsModule: Module<SettingsState, RootState> = {
    namespaced: true,
    state: {
        connectInfo: {
            host: 'localhost',
            port: 4455,
            password: undefined
        },
        autoconnect: false,
        version: 1
    }
}

export default settingsModule