import {SettingsState} from "@/store/modules/settings/types";

export * from './store/plugins/obs/types'

export interface RootState {
    settings: SettingsState
    //todos: TodoState
   // login: LoginState
}