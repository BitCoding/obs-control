import {Store, Module} from 'vuex'
import {RootState, ObsState, ObsConnectInfo} from "@/types";
import OBSWebSocket, {EventSubscription} from "obs-websocket-js";

import modules from './module'
import {OBSEventTypes, OBSResponseTypes} from "obs-websocket-js/dist/types";

const client = new OBSWebSocket()

const emptyStateVersion: OBSResponseTypes['GetVersion'] = {
    obsVersion: '',
    obsWebSocketVersion: '',
    rpcVersion: 0,
    availableRequests: [],
    supportedImageFormats: [],
    platform: '',
    platformDescription: ''
}

const obsModule: Module<ObsState, RootState> = {
    namespaced: true,
    state: {
        connection: false,
        version: emptyStateVersion,
        studio: false
    },
    actions: {
        'init'({getters:{client}, commit}) {
            client.on('StudioModeStateChanged', (state:OBSEventTypes['StudioModeStateChanged']) => commit('set/studio',state.studioModeEnabled));
        },
        async connect({getters: {client}, commit}, connectInfo :ObsConnectInfo) {
            commit('connectionStarting')
            const result = await client.connect(`ws://${connectInfo.host}:${connectInfo.port}`, connectInfo.password,
                {
                    eventSubscriptions: EventSubscription.All | EventSubscription.Ui | EventSubscription.InputShowStateChanged| EventSubscription.InputActiveStateChanged // | EventSubscription.InputVolumeMeters
                })
            return result
        },
        disconnect({getters: {client}}) {
            client.disconnect()
        },
        'connection/closed'({commit}) {
            commit('connectionClosed')
        },
        async 'connection/ready'({commit, dispatch}) {
            commit('connectionReady')
            return dispatch('base/reload')
        },
        async 'base/reload'({commit}){
            const version: OBSResponseTypes['GetVersion'] = await client.call('GetVersion')
            commit('set/version',version)

            const studio: OBSResponseTypes['GetStudioModeEnabled'] = await client.call('GetStudioModeEnabled')
            commit('set/studio',studio.studioModeEnabled)
        },
        async 'studio/set'({getters:{client},commit}, studio:boolean){
            await client.call('SetStudioModeEnabled',{
                studioModeEnabled: studio
            })
        },
    },
    getters: {
        isStudioMode(state): boolean {
            return state.studio
        },
        connectionReady(state): boolean {
            return state.connection === 'ok'
        },
        client(): OBSWebSocket {
            return client
        }
    },
    mutations: {
        connectionStarting(state) {
            state.connection = 'connecting'
        },
        connectionStarted(state) {
            state.connection = 'connected'
        },
        connectionReady(state) {
            state.connection = 'ok'
        },
        connectionClosed(state) {
            state.connection = false
        },
        'set/version'(state, version: OBSResponseTypes['GetVersion']) {
            state.version = version
        },
        'set/studio'(state, status: boolean){
            state.studio = status
        },
    },
    modules
}

const ObsPlugin =  (store: Store<RootState>) => {
    store.registerModule('obs', obsModule)

    store.dispatch('obs/init');

    client.on('Identified', () => store.dispatch('obs/connection/ready'))
    client.on('ConnectionClosed', () => store.dispatch('obs/connection/closed'))

    client.on('VendorEvent', message => {
        console.log(message)
        // S store.dispatch(`obs/event/${VendorEvent}`, message)
    })
    client.on('CurrentSceneCollectionChanging', message => {
        console.log(message)
        // S store.dispatch(`obs/event/${VendorEvent}`, message)
    })
}

export default ObsPlugin