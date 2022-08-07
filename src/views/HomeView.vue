<template>
  <b-container>
    <b-card>

    </b-card>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class'
import {ObsConnectInfo, ObsState} from "@/store/plugins/obs/types";


const ObsGetter = namespace('obs', Getter)
const ObsAction = namespace('obs', Action)
const ObsMutation = namespace('obs', Mutation)

@Component({
  components: {
  },
})
export default class HomeView extends Vue {

  @State obs: ObsState
  @ObsGetter connectionReady: boolean
  @ObsGetter isStudioMode: boolean
  @ObsAction('studio/set') setBo
  @ObsAction('stream/caption') sendCaption
  @ObsAction('scenes/set/previewScene') setPreview
}
</script>
