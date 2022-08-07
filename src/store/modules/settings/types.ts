import {ObsConnectInfo} from "@/store/plugins/obs/types";

export interface SettingsState {
    connectInfo: ObsConnectInfo
    autoconnect: boolean
    version: number
}