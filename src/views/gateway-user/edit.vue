<template>
  <div>
    <v-dialog :value="isShowPopup" :persistent="true" max-width="1600px" max-height="1000px">
      <v-card>
				<v-card-title>
					<span class="headline">{{$t('message.editUser')}}</span>
				</v-card-title>
				<v-card-text>
					<v-container class="grid-list-md pa-0">
            <v-form
              ref="editUser"
              v-model="isEditUserValid"
              lazy-validation
            >
              <v-row>                
                <v-col cols="6">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field :label="$t('message.userId')" v-model="editUser.userId" :rules="editUserRules.id" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <div>
                        <v-text-field :label="$t('message.name')" v-model="editUser.name" :rules="editUserRules.name" required></v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field :label="$t('message.phone')" v-model="editUser.phone"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <div>
                        <v-select
                          v-model="editUser.userType"
                          :items="userTypes"
                          item-text="text"
                          item-value="value"
                          :label="$t('message.userType')"
                        ></v-select>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field type="number" :label="$t('message.confidenceLevel')" v-model="editUser.confidenceLevel" :rules="editUserRules.confidenceLevel"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <div>
                        <v-text-field :label="$t('message.ic')" v-model="editUser.ic" :rules="editUserRules.ic" required></v-text-field>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="6">
                  <v-row>
                    <v-col cols="12">
                      <v-row>
                        <v-col cols="12" align="center">
                          <v-img :src="editUser.facePhoto" width="100" height="124"></v-img>
                        </v-col>
                        <v-col cols="12">
                          <v-file-input 
                            :label="$t('message.facePhoto')"
                            filled
                            v-model="facePhoto"
                            prepend-icon="mdi-camera"
                            @change="uploadFile()"
                          ></v-file-input>
                        </v-col>
                      </v-row>
                    </v-col>
                
                    <v-col cols="6">
                      <v-menu
                        v-model="isShowEffectFromPanel"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field 
                            v-model="editUser.effectFrom" 
                            :label="$t('message.effectFrom')" 
                            prepend-icon="event" 
                            readonly 
                            v-bind="attrs" 
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="editUser.effectFrom"
                          @input="isShowEffectFromPanel=false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="6">
                      <v-menu ref="effectFromMenu"
                        v-model="isShowEffectFromMinutePanel"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="effectFromStringMinute"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="effectFromStringMinute"
                            label="Time"
                            prepend-icon="access_time"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          >
                          </v-text-field>
                        </template>
                        <v-time-picker
                          v-if="isShowEffectFromMinutePanel"
                          v-model="effectFromStringMinute"
                          full-width
                          @click:minute="$refs.effectFromMenu.save(effectFromStringMinute)"
                        ></v-time-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="6">
                      <v-menu
                        v-model="isShowExpiredAtPanel"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editUser.expiredAt"
                            :label="$t('message.expiredAt')"
                            prepend-icon="event"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="editUser.expiredAt"
                          @input="isShowExpiredAtPanel=false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="6">
                      <v-menu ref="expiredAtMenu"
                        v-model="isShowExpiredAtMinutePanel"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="expiredAtStringMinute"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="expiredAtStringMinute"
                            label="Time"
                            prepend-icon="access_time"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          >
                          </v-text-field>
                        </template>
                        <v-time-picker
                          v-if="isShowExpiredAtMinutePanel"
                          v-model="expiredAtStringMinute"
                          full-width
                          @click:minute="$refs.expiredAtMenu.save(expiredAtStringMinute)"
                        ></v-time-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="5">
                      <v-select
                        v-model="editUser.allowPeriods"
                        :items="editUser.allowPeriods"
                        :label="$t('message.allowPeriods')"
                        :item-text="period => period.startTime + '-' + period.endTime"
                        attach
                        chips                                              
                        multiple
                        :cache-items="true"
                      >
                        <template slot="item" slot-scope="props">
                          {{ props.item.startTime + ' - ' + props.item.endTime }}
                        </template>
                        <template slot="prepend" slot-scope="props">
                          {{ props.item.startTime + ' - ' + props.item.endTime }}
                        </template>
                        
                      </v-select>
                    </v-col>
                    <v-col cols="3">
                      <v-menu ref="startTime"
                        v-model="isShowStartTime"
                        :close-on-content-click="false"
                        :return-value.sync="startTime"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="startTime"
                            label="Start time"
                            prepend-icon="access_time"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          >
                          </v-text-field>
                        </template>
                        <v-time-picker
                          v-if="isShowStartTime"
                          v-model="startTime"
                          full-width
                          @click:minute="$refs.startTime.save(startTime)"
                        ></v-time-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="3">
                      <v-menu ref="endTime"
                        v-model="isShowEndTime"
                        :close-on-content-click="false"
                        :return-value.sync="endTime"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="endTime"
                            label="End time"
                            prepend-icon="access_time"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          >
                          </v-text-field>
                        </template>
                        <v-time-picker
                          v-if="isShowEndTime"
                          v-model="endTime"
                          full-width
                          @click:minute="$refs.endTime.save(endTime)"
                        ></v-time-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="1">
                      <v-btn color="success" @click="addPeriod()"><v-icon>ti-plus</v-icon></v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-form>
					</v-container>
				</v-card-text>
				<v-card-actions class="pa-4">
					<v-spacer></v-spacer>
					<v-btn class="px-4" color="success" v-on:click="editCurrentUser">{{$t('message.editBtn')}}</v-btn>
					<v-btn class="px-4" color="error" @click.native="closePopup">{{$t('message.close')}}</v-btn>
          <v-spacer></v-spacer>
				</v-card-actions>
			</v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
    props: ['isShowPopup', 'devices', 'editUser', 'userTypes', 'effectFromStringMinute', 'expiredAtStringMinute'],
    data() {
      return {
        isEditUserValid: true,
        editUserRules: {
          devices: [
            devices => !!devices.length || 'Devices should not empty',
          ],
          name: [ 
            name => !!name || 'Name is required',
            name => (name && name.length <= 10) || 'Name must be less than 10 characters',
          ],
          id: [ 
            id => !!id || 'ID is required',
            id => !isNaN(id) || 'ID must be a number'
          ],
          ic: [ 
            ic => !!ic || 'IC Card is required',
          ],
          confidenceLevel: [
            confidenceLevel => !isNaN(confidenceLevel) || 'ConfidenceLevel must be a number',
            confidenceLevel => (confidenceLevel > 0 && confidenceLevel < 100) || 'ConfidenceLevel must between 0 and 100'
          ]
        },
        startTime: "",
        endTime: "",
        isShowStartTime: false,
        isShowEndTime: false,
        isShowEffectFromPanel: false,
        isShowEffectFromMinutePanel: false,
        isShowExpiredAtPanel: false,
        isShowExpiredAtMinutePanel: false,
        facePhoto: {},
      }
    },
    mounted() {},
    computed: {
      cSelectAllDevices () {
        return this.editUser.devices.length === this.devices.length
      },
      cSelectSomeDevices () {
        return this.editUser.devices.length > 0 && !this.cSelectAllDevices
      },
      icon () {
        if (this.cSelectAllDevices) return 'mdi-close-box'
        if (this.cSelectSomeDevices) return 'mdi-minus-box'
        return 'mdi-checkbox-blank-outline'
      },
    },
    methods: {
      async editCurrentUser() {
        if(!this.$refs.editUser.validate()) return
        const editUser = {
          ...this.editUser,
          expiredAt: this.editUser.expiredAt ? this.editUser.expiredAt + ' ' + this.expiredAtStringMinute : undefined,
          effectFrom: this.editUser.effectFrom ? this.editUser.effectFrom + ' ' + this.effectFromStringMinute : undefined,
        }

        const editResponse = await this.$axios.post('/upload/user', editUser)
        if (editResponse.status === 200) {
          this.$emit('updateSuccess', true)
          this.$emit('closePopup', true)
          Vue.notify({
            group: 'loggedIn',
            type: 'success',
            text: 'Update User successful!'
          })
        } else {
          Vue.notify({
            group: 'loggedIn',
            type: 'error',
            text: 'Update user fail. Please try again later!'
          })
        }
      },
      selectAllDevices() {
      this.$nextTick(() => {
          if (this.cSelectAllDevices) {
            this.editUser.devices = []
          } else {
            this.editUser.devices = this.devices.slice()
          }
        })
      },
      async uploadFile() {
        if (this.facePhoto) {
          const reader = new FileReader();
          reader.addEventListener("load",  () => {
            this.editUser.facePhoto = reader.result;
          }, false)
    
          reader.readAsDataURL(this.facePhoto)
        } else {
          this.editUser.facePhoto = ""
        }
      },
      addPeriod() {
        this.editUser.allowPeriods = [...this.editUser.allowPeriods, { startTime: this.startTime, endTime: this.endTime }]
        this.startTime = ""
        this.endTime = ""
      },
      closePopup() {
        this.$emit('closePopup', true)
      }
    }
}
</script>

<style>

</style>