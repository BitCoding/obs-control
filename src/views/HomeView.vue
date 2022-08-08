<template>
  <b-container>
    <b-card>
      <b-img :src="imagePreview"/>
      <b-img :src="imageCurrent"/>
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

  imageCurrent = ''
  imagePreview = ''

  @Watch('currentScene')
  onSceneChanged(val: string, oldVal: string) {
    setTimeout(()=>{
      this.sourceScreenshot({
        sourceName: val,
        imageFormat:'jpg',
        imageWidth: 960,
        imageHeight: 540,

      }).then((state:OBSResponseTypes['GetSourceScreenshot'])=>{
        this.imageCurrent = state.imageData
        console.log(state);
      })
    },1000)
  }

  @Watch('previewScene')
  onPreviewSceneChanged(val: string, oldVal: string) {
    setTimeout(()=>{
      this.sourceScreenshot({
        sourceName: val,
        imageFormat:'jpg',
        imageWidth: 960,
        imageHeight: 540,

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
