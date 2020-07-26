<template>
	<div>
		<v-container fluid class="grid-list-xl py-0 mt-n3">
			<v-row>
				<app-card
					:heading="$t('message.usersTitle')"
					:fullBlock="true"
					colClasses="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12"
				>
          <v-row>
            <v-col cols="12">  
              <v-btn color="success " @click="showNewUserDialog = true">Create User</v-btn>
            </v-col>
          </v-row>
          <v-card>
            <v-card-title>
              <v-row>
                <v-col cols="4">                    
                </v-col>
                <v-col cols="2">
                  <v-select
                    v-model="selectedDevice"
                    :items="devices"
                    label="Select Device"
                    @change="changeSelectedDevice()"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="searchUserKey"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-title>
              <v-data-table
                :headers="headers"
                :items="users"
                :search="searchUserKey"
                item-key="userId">
                <template slot="headerCell" slot-scope="props">
                  <v-tooltip bottom>
                    <span slot="activator">
                      {{ props.header.text }}
                    </span>
                    <span>
                      {{ props.header.text }}
                    </span>
                  </v-tooltip>
                </template>
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.name }}</td>
                </template>
                <template v-slot:item.action="{ item }">
                  <v-btn color="error" @click="removeUser(item)"><v-icon>ti-trash</v-icon></v-btn>
                </template>
              </v-data-table>
          </v-card>
				</app-card>
			</v-row>
		</v-container>
    <v-dialog v-model="showNewUserDialog" max-width="900px" max-height="1000px" :fullscreen="true">
      <v-card>
				<v-card-title>
					<span class="headline">{{$t('message.addNewUser')}}</span>
				</v-card-title>
				<v-card-text>
					<v-container class="grid-list-md pa-0">
            <v-form
              ref="newUser"
              v-model="isNewUserValid"
              lazy-validation
            >
              <v-row>
                <v-col cols="12">
                  <v-select v-model="newUser.devices" :items="devices" label="Add to Devices" multiple>
                    <template v-slot:prepend-item>
                    <v-list-item
                      ripple
                      @click="selectAllDevices"
                    >
                      <v-list-item-action>
                        <v-icon :color="newUser.devices.length > 0 ? 'indigo darken-4' : ''">{{ icon }}</v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>Select All</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-row>
                    <v-col cols="12" align="center">
                      <v-img :src="srcFacePhoto" width="100" height="150"></v-img>
                    </v-col>
                    <v-col cols="12">
                      <v-file-input 
                        :label="$t('message.facePhoto')"
                        :rules="uploadRules"
                        filled
                        v-model="facePhoto"
                        prepend-icon="mdi-camera"
                        @change="uploadFile()"
                      ></v-file-input>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="8">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field :label="$t('message.userId')" v-model="newUser.userId" :rules="newUserRules.id" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <div>
                        <v-text-field :label="$t('message.name')" v-model="newUser.name" :rules="newUserRules.name" required></v-text-field>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-text-field :label="$t('message.phone')" v-model="newUser.phone"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <div>
                    <v-select
                      v-model="newUser.userType"
                      :items="userTypes"
                      item-text="text"
                      item-value="value"
                      :label="$t('message.userType')"
                    ></v-select>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-text-field type="number" :label="$t('message.confidenceLevel')" v-model="newUser.confidenceLevel" :rules="newUserRules.confidenceLevel"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <div>
                    <v-text-field :label="$t('message.ic')" v-model="newUser.ic" :rules="newUserRules.ic" required></v-text-field>
                  </div>
                </v-col>
              </v-row>
              <v-row>
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
                        v-model="newUser.effectFrom" 
                        :label="$t('message.effectFrom')" 
                        prepend-icon="event" 
                        readonly 
                        v-bind="attrs" 
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="newUser.effectFrom"
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
              </v-row>
              <v-row>
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
                        v-model="newUser.expiredAt"
                        :label="$t('message.expiredAt')"
                        prepend-icon="event"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="newUser.expiredAt"
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
            </v-form>
					</v-container>
				</v-card-text>
				<v-card-actions class="pa-4">
					<v-spacer></v-spacer>
					<v-btn class="px-4" color="success" v-on:click="addNewUser">{{$t('message.add')}}</v-btn>
					<v-btn class="px-4" color="error" @click.native="showNewUserDialog = false">{{$t('message.close')}}</v-btn>
				</v-card-actions>
			</v-card>
    </v-dialog>
	</div>
</template>

<script>
import Vue from 'vue';

export default {
  data() {
    return {
      loader: true,
      searchUserKey: "",
      headers: [
        {
          text: "ID",
          align: "left",
          sortable: false,
          value: "userId",
          width: "10%"
        },
        {
          text: "Username",
          align: "left",
          sortable: false,
          value: "name",
        },
        { text: 'Action', align: "left", value: 'action', width: "10%" },
      ],
      userTypes: [
        {
          text: "Face only",
          value: 0
        },
        {
          text: "Face and Card",
          value: 1
        }
      ],
      devices: [],
      users: [],
      selectedDevice: "",
      showNewUserDialog: false,
      newUser: {
        devices: [],
        confidenceLevel: 80,
        userType: 0
      },
      isShowEffectFromPanel: false,
      isShowEffectFromMinutePanel: false,
      isShowExpiredAtPanel: false,
      isShowExpiredAtMinutePanel: false,
      effectFromStringMinute: "",
      expiredAtStringMinute: "",
      facePhoto: {},
      srcFacePhoto: "",
      uploadRules: [
        file => !file || file.size < 1000000 || 'FacePhoto size should be less than 1 MB!',
      ],
      isNewUserValid: true,
      newUserRules: {
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
      }
    }
  },
  mounted() {
    this.getDevices();
  },
  computed: {
    cSelectAllDevices () {
      return this.newUser.devices.length === this.devices.length
    },
    cSelectSomeDevices () {
      return this.newUser.devices.length > 0 && !this.cSelectAllDevices
    },
    icon () {
      if (this.cSelectAllDevices) return 'mdi-close-box'
      if (this.cSelectSomeDevices) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
  },
  methods: {
    async uploadFile() {
      if (this.facePhoto) {
        const reader = new FileReader();
        reader.addEventListener("load",  () => {
          this.srcFacePhoto = reader.result;
        }, false)
  
        reader.readAsDataURL(this.facePhoto)
      } else {
        this.srcFacePhoto = ""
      }
    },
    async changeSelectedDevice() {
      const usersResponse = await this.$axios.get(`/get/user/list/of/${this.selectedDevice}`)
        if (usersResponse.status === 200) {
          this.users = usersResponse.data
        } else {
          Vue.notify({
            group: 'loggedIn',
            type: 'error',
            text: 'Can not get User list. Please try again later!'
          })
        }
    },
    renewUser() {
      this.newUser = {
        devices: [],
        confidenceLevel: 80,
        userType: 0,
        name: "",
        userId: "",
        expiredAt: "",
        effectFrom: "",
        facePhoto: ""
      }
      this.srcFacePhoto = ""
      this.facePhoto = {}
    },
    async addNewUser() {
      if(!this.$refs.newUser.validate()) return
      this.newUser = {
        ...this.newUser,
        expiredAt: this.newUser.expiredAt + ' ' + this.expiredAtStringMinute,
        effectFrom: this.newUser.effectFrom + ' ' + this.effectFromStringMinute,
        facePhoto: this.srcFacePhoto
      }

      const addResponse = await this.$axios.post('/upload/user', this.newUser)
      if (addResponse.status === 200) {
        this.renewUser()
        this.showNewUserDialog = false
        if (this.selectedDevice) {
          this.changeSelectedDevice()
        }
        Vue.notify({
          group: 'loggedIn',
          type: 'success',
          text: 'Create User successful!'
        })
      } else {
        Vue.notify({
          group: 'loggedIn',
          type: 'error',
          text: 'Create user fail. Please try again later!'
        })
      }
    },
    async removeUser(user) {
      const deleteResponse = await this.$axios.delete(`/delete/user`, { params: { userId: user.userId, deviceId: this.selectedDevice } })
      if (deleteResponse.status === 200) {
        this.users = this.users.filter(holdUser => holdUser.userId !== user.userId)
        this.showNewUserDialog = false
        Vue.notify({
          group: 'loggedIn',
          type: 'success',
          text: 'Remove user successful!'
        })
      } else {
        Vue.notify({
          group: 'loggedIn',
          type: 'error',
          text: 'Remove user fail. Please try again later!'
        })
      }
    },    
    async getDevices() {
      const deviceResponse = await this.$axios.get('/registered/device/list')
      if (deviceResponse.status === 200) {
          this.devices = deviceResponse.data
      } else {
        Vue.notify({
          group: 'loggedIn',
          type: 'error',
          text: 'Can not get Devive list. Please reload page!'
        })
      }
    },
    selectAllDevices() {
      this.$nextTick(() => {
          if (this.cSelectAllDevices) {
            this.newUser.devices = []
          } else {
            this.newUser.devices = this.devices.slice()
          }
        })
    }
  }
};
</script>
