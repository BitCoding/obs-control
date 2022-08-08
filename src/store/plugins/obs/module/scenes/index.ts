import {Module} from "vuex";
import {SceneState} from "@/store/plugins/obs/types";
import {RootState} from "@/types";
import {OBSEventTypes, OBSResponseTypes} from "obs-websocket-js/dist/types";
import {JsonObject} from "type-fest";

const obsScenesModule: Module<SceneState, RootState> = {
    state: {
        current: '',
        preview: '',
        scenes: [],
    },
    actions: {
        'init'({getters:{client}, commit,dispatch}) {
            client.on('CurrentProgramSceneChanged', (state:OBSEventTypes['CurrentProgramSceneChanged']) => commit('scenes/set/current',state.sceneName));
            client.on('CurrentPreviewSceneChanged', (state:OBSEventTypes['CurrentPreviewSceneChanged']) => commit('scenes/set/preview',state.sceneName));

            // TODO
            client.on('SceneCreated', () => dispatch('scenes/reload'));
            client.on('SceneRemoved', () => dispatch('scenes/reload'));
            client.on('SceneNameChanged', () => dispatch('scenes/reload'));
            client.on('SceneListChanged', () => dispatch('scenes/reload'));
        },
        'connection/closed'({commit}) {
            commit('scenes/reset')
        },
        async 'connection/ready'({dispatch}) {
            return dispatch('scenes/reload')
        },
        async 'scenes/reload'({getters:{client},commit}){
            const status: OBSResponseTypes['GetSceneList'] = await client.call('GetSceneList')
            commit('scenes/set/current',status.currentProgramSceneName)
            commit('scenes/set/preview',status.currentPreviewSceneName)
            commit('scenes/set/list',status.scenes)
        },
        async 'scenes/set/currentScene'({getters:{client}},scene){
            await client.call('SetCurrentProgramScene',{
                sceneName: scene
            })
        },
        async 'scenes/set/previewScene'({getters:{client,isStudioMode}},scene){
            if(isStudioMode){
                await client.call('SetCurrentPreviewScene',{
                    sceneName: scene
                })
            }
        },
    },
    getters: {
        getCurrentScene(state): string {
            return state.current
        },
        getPreviewScene(state): string {
            return state.preview
        },
    },
    mutations: {

        'scenes/reset'(state) {
            state.current = ''
            state.preview = ''
            state.scenes = []
        },
        'scenes/set/current'(state, current:string) {
            state.current = current
        },
        'scenes/set/preview'(state, preview:string) {
            state.preview = preview
        },
        'scenes/set/list'(state, scenes:any) {
            state.scenes = scenes
        },
    }
}

export default obsScenesModule