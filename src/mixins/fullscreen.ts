import Vue from 'vue'
import Component from 'vue-class-component'

const docElm = document.documentElement

// @ts-expect-error Browser Compaility
const goFullScreen = docElm.requestFullscreen || docElm.mozRequestFullScreen || docElm.webkitRequestFullScreen || docElm.msRequestFullscreen
// @ts-expect-error Browser Compaility
const leaveFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitCancelFullScreen || document.msExitFullscreen

// You can declare mixins as the same style as components.
@Component
export default class Fullscreen extends Vue {
    isFullScreen() {
        // TODO computed
        // @ts-expect-error Browser Compaility
        return document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement
    }
    toggleFullscreen() {
        if (this.isFullScreen()) {
            leaveFullScreen.apply(document)
        } else {
            goFullScreen.apply(docElm)
        }
    }
}