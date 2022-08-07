<template>
  <b-container>
    <b-card
        title="Login"
        img-src="https://picsum.photos/600/150/?image=1"
        img-alt="Image"
        img-top
        tag="article"
        class="mb-2"
    >
      <b-alert v-if="error" variant="danger" show>
        {{error}}
      </b-alert>
      <b-form @submit="connect">
        <b-form-group id="input-group-1" label="Host:" label-for="input-1">
          <b-form-input
              id="input-1"
              v-model="connectInfo.host"
              placeholder="Enter Host"
              required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-3" label="Port:" label-for="input-3">
          <b-form-input
              id="input-2"
              v-model="connectInfo.port"
              type="number"
              placeholder="Enter Port"
              required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-3" label="Password:" label-for="input-3">
          <b-form-input
              id="input-3"
              v-model="connectInfo.password"
              type="password"
              placeholder="Enter Passwort"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>

    </b-card>

  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class'
import {ObsConnectInfo, ObsState} from "@/store/plugins/obs/types";
import {SettingsState} from "@/store/modules/settings/types";


const obs = namespace('obs')

const settings = namespace('settings')


@Component({
  components: {
  },
})
export default class ConnectView extends Vue {
  @settings.State connectInfo: ObsConnectInfo
  @obs.Action('connect') obsConnect

  error: string|null = null

  async connect(event){
      event.preventDefault()

      this.obsConnect(this.connectInfo).then(
          ()=>{
            this.$router.push({'name':'home'})
          }
      ).catch( (error) => {
      this.error = error
    })

  }
}
</script>
