<template>
  <b-container>
    <b-row>
      <b-col v-if="isStudioMode">
        <b-card
            :img-src="imagePreview"
            img-top
            no-body
        >
          <template #header>
            <h4 class="mb-0">Preview {{ currentScene }}</h4>
          </template>
        </b-card>
      </b-col>
      <b-col v-if="isStudioMode">
        Control
      </b-col>
      <b-col>
        <b-card
            :img-src="imageCurrent"
            img-top
            no-body
        >
          <template #header>
            <h4 class="mb-0">Current {{ currentScene }}</h4>
          </template>
        </b-card>
      </b-col>
    </b-row>


    <b-card>
      <b-button @click="getSource">
        Test
      </b-button>
    </b-card>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class'
import {OBSResponseTypes} from "obs-websocket-js/dist/types";
import {ObsConnectInfo} from "@/store/plugins/obs/types";


const obs = namespace('obs')

@Component({
  components: {
  },
})
export default class HomeView extends Vue {
  @obs.Getter('getCurrentScene') currentScene
  @obs.Getter('getPreviewScene') previewScene
  @obs.Action('source/active') sourceActive
  @obs.Action('source/screenshot') sourceScreenshot

  @obs.Getter isStudioMode: boolean
  imageCurrent = ''
  imagePreview = ''

  @Watch('currentScene')
  onSceneChanged(val: string, oldVal: string) {
    setTimeout(()=>{
      this.sourceScreenshot({
        sourceName: val,
        imageFormat:'jpg',

      }).then((state:OBSResponseTypes['GetSourceScreenshot'])=>{
        this.imageCurrent = state.imageData
        console.log(state);
      })
    },1000)
  }

  @Watch('previewScene')
  onPreviewSceneChanged(val: string, oldVal: string) {
    if(!this.isStudioMode)
      return;
    setTimeout(()=>{
      this.sourceScreenshot({
        sourceName: val,
        imageFormat:'jpg',

      }).then((state:OBSResponseTypes['GetSourceScreenshot'])=>{
        this.imagePreview = state.imageData
      })
    },1000)
  }

  getSource(){
    this.sourceActive({
      sourceName: "Minecraft"
    }).then((state:OBSResponseTypes['GetSourceActive'])=>{
      console.log(state);
    })
  }
}
</script>
