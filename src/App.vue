<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="primary">
      <b-container>
      <b-navbar-brand :to="{name:'home'}">OBS-Control</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="connectionReady" >
          <b-nav-item href="#">Dashboard</b-nav-item>
          <b-nav-item href="#" disabled>Disabled</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-navbar-nav v-if="connectionReady" right>
            <b-nav-item id="popover-studio" @click="setStudiomode(!isStudioMode)">
              <b-icon v-if="isStudioMode" icon="layout-split" variant="success" />
              <b-icon v-else icon="layout-split" variant="danger"/>
              <b-popover target="popover-studio" triggers="hover" placement="bottom">
                <template v-if="isCamActive" #title>Studiomode On</template>
                <template v-else #title>Studiomode Off</template>
                <span v-if="isCamActive">Studiomode deaktivieren?</span>
                <span v-else>Studiomode aktivieren?</span>
              </b-popover>
            </b-nav-item>
            <b-nav-item id="popover-cam" @click="toogleCam">
              <b-icon v-if="isCamActive" icon="camera-video" variant="success" />
              <b-icon v-else  icon="camera-video-off" variant="danger"/>
              <b-popover target="popover-cam" triggers="hover" placement="bottom">
                <template v-if="isCamActive" #title>Cam On</template>
                <template v-else #title>Cam Off</template>
                <span v-if="isCamActive">Cam deaktivieren?</span>
                <span v-else>Cam aktivieren?</span>
              </b-popover>
            </b-nav-item>
            <b-nav-item id="popover-stream"  @click="toogleStream">
              <b-icon v-if="isStreamActive" icon="camera-reels-fill" variant="success" />
              <b-icon v-else icon="camera-reels" variant="danger"/>

              <b-popover target="popover-stream" triggers="hover" placement="bottom">
                <template v-if="isStreamActive" #title>Stream Online</template>
                <template v-else #title>Stream Offline</template>
                <span v-if="isCamActive">Stream deaktivieren?</span>
                <span v-else>Stream aktivieren?</span>
              </b-popover>
            </b-nav-item>
            <b-nav-item @click="toggleFullscreen">
              <b-icon icon="arrows-fullscreen"/>
            </b-nav-item>
            <b-nav-item @click="disconnect">
              <b-icon icon="power"/>
            </b-nav-item>
          </b-navbar-nav>
        </b-navbar-nav>
      </b-collapse>
      </b-container>
    </b-navbar>
    <router-view/>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component';
import { Component, Vue } from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class'
import Fullscreen from "@/mixins/fullscreen";

const obs = namespace('obs')
@Component({})
export default class App extends mixins(Fullscreen) {

  @obs.Getter connectionReady: boolean
  @obs.Getter isCamActive: boolean
  @obs.Getter isStreamActive: boolean
  @obs.Getter isStudioMode: boolean

  @obs.Action('studio/set') setStudiomode
  @obs.Action('cam/toogle') toogleCam
  @obs.Action('stream/toogle') toogleStream

  @obs.Action('disconnect') obsDisconnect
  async disconnect(event){
    event.preventDefault()

    this.obsDisconnect().then(
        ()=>{
          this.$router.push({'name':'login'})
        }
    )
  }
}
</script>
<style lang="scss">
@import "~@/assets/scss/vendors/bootstrap-vue/index";
</style>
