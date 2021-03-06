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
              <v-btn color="success " @click="showNewUserDialogMethod()">Create User</v-btn>
            </v-col>
          </v-row>
          <v-card>
            <v-card-title>
              <v-row>
                <v-col cols="2" class="header-table-select-devices">
                  <v-select
                    v-model="selectedDevice"
                    :items="devices"
                    label="Select Device"
                    @change="changeSelectedDevice()"
                  ></v-select>
                </v-col>
                <v-col cols="6" class="header-table-search">
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
                item-key="userId"
                @dblclick:row="(e, { item }) => editUser(item)">
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
                  <v-btn color="success" @click="editUser(item)"><v-icon>ti-pencil</v-icon></v-btn>
                  <v-btn color="error" @click="removeUser(item)"><v-icon>ti-trash</v-icon></v-btn>
                </template>
              </v-data-table>
          </v-card>
				</app-card>
			</v-row>
		</v-container>
    <v-dialog v-model="showNewUserDialog" max-width="1000px" max-height="1000px">
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
                  <v-row>
                    <v-col cols="6" class="container-user-photo" order-md="last">
                      <v-row>
                        <v-col cols="12" align="center">
                          <v-img :src="srcFacePhoto" width="100" height="96"></v-img>
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
                    <v-col cols="6" class="container-user-info">
                      <v-row>
                        <v-col cols="12" class="user-devices">
                          <v-select v-model="newUser.devices" :items="devices" :rules="newUserRules.devices" label="Add to Devices" multiple>
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
                        <v-col cols="12" class="user-id">
                          <v-text-field :label="$t('message.userId')" v-model="newUser.userId" :rules="newUserRules.id" required></v-text-field>
                        </v-col>
                        <v-col cols="12" class="user-name">
                          <div>
                            <v-text-field :label="$t('message.name')" v-model="newUser.name" :rules="newUserRules.name" required></v-text-field>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="6" class="continer-user-left">
                      <v-row>
                        <v-col cols="12" class="user-phone">
                          <v-text-field :label="$t('message.phone')" v-model="newUser.phone"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="user-type">
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
                        <v-col cols="12" class="user-confidence">
                          <v-text-field type="number" :label="$t('message.confidenceLevel')" v-model="newUser.confidenceLevel" :rules="newUserRules.confidenceLevel"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="user-ic">
                          <div>
                            <v-text-field :label="$t('message.ic')" v-model="newUser.ic" :rules="newUserRules.ic" required></v-text-field>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="6" class="continer-user-right">
                      <v-row>
                        <v-col cols="6" class="user-ef-h">
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
                        <v-col cols="6" class="user-ef-m">
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
                        <v-col cols="6" class="user-ea-h">
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
                        <v-col cols="6" class="user-ea-m">
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
                        <v-col cols="5" class="user-al-s">
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
                                label="Start"
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
                        <v-col cols="5" class="user-al-e">
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
                                label="End"
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
                        <v-col cols="2" class="user-al-a">
                            <v-icon size="25" style="color: green; cursor: pointer;" @click="addPeriod()">ti-plus</v-icon>
                        </v-col>
                        <v-col cols="12" class="user-periods">
                          <v-select
                            v-model="newUser.allowPeriods"
                            :items="newUser.allowPeriods"
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
                      </v-row>
                    </v-col>
                  </v-row>    
                </v-col>            
              </v-row>
            </v-form>
					</v-container>
				</v-card-text>
				<v-card-actions class="pa-4">
					<v-spacer></v-spacer>
					<v-btn class="px-4" color="success" v-on:click="addNewUser">{{$t('message.add')}}</v-btn>
					<v-btn class="px-4" color="error" @click.native="showNewUserDialog = false">{{$t('message.close')}}</v-btn>
          <v-spacer></v-spacer>
				</v-card-actions>
			</v-card>
    </v-dialog>
    <edit-user
      :isShowPopup="showEditUserDialog"
      :device="devices"
      :editUser="editedUser"
      :userTypes="userTypes"
      :effectFromStringMinute="editUserEffectFromStringMinute"
      :expiredAtStringMinute="editUserExpiredAtStringMinute"
      @updateSuccess="changeSelectedDevice()"
      @closePopup="closePopupEditUser()"></edit-user>
	</div>
</template>

<script>
import Vue from 'vue';
import editUser from '../gateway-user/edit'

export default {
  components: {
    editUser
  },
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
        { text: 'Action', align: "center", value: 'action', width: "10%" },
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
      showEditUserDialog: false,
      newUser: {
        devices: [],
        confidenceLevel: 80,
        userType: 0,
        allowPeriods: []
      },
      isShowEffectFromPanel: false,
      isShowEffectFromMinutePanel: false,
      isShowExpiredAtPanel: false,
      isShowExpiredAtMinutePanel: false,
      effectFromStringMinute: "",
      expiredAtStringMinute: "",

      isShowEndTime: false,
      isShowStartTime: false,
      endTime: "",
      startTime: "",

      facePhoto: {},
      srcFacePhoto: "",
      uploadRules: [
        file => !file || file.size < 1000000 || 'FacePhoto size should be less than 1 MB!',
      ],
      isNewUserValid: true,
      newUserRules: {
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
      editedUser: {},
      editUserEffectFromStringMinute: "",
      editUserExpiredAtStringMinute: "",
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
        facePhoto: "",
        allowPeriods: []
      }
      this.effectFromStringMinute = ""
      this.expiredAtStringMinute = ""
      this.srcFacePhoto = ""
      this.facePhoto = {}
    },
    async addNewUser() {
      if(!this.$refs.newUser.validate()) return
      this.newUser = {
        ...this.newUser,
        expiredAt: this.newUser.expiredAt ? this.newUser.expiredAt + ' ' + this.expiredAtStringMinute : undefined,
        effectFrom: this.newUser.effectFrom ? this.newUser.effectFrom + ' ' + this.effectFromStringMinute : undefined,
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
    },
    showNewUserDialogMethod() {
      this.showNewUserDialog = true
      if (this.$refs.newUser) {
        // When init ref this.$refs.newUser is undefined
        this.$refs.newUser.resetValidation()
      }
    },
    editUser(user) {      
      this.showEditUserDialog = true

      const editUser = {
        devices: [user.sn],
        userId: user.userId,
        name: user.name,
        phone: user.phone,
        userType: parseInt(user.userType),
        confidenceLevel: user.confidenceLevel,
        ic: user.icCard,
        facePhoto: user.infoPhoto,
        allowPeriods: user.cycle ? JSON.parse(user.cycle) : undefined,
        expiredAt: (user.validUntil && user.validUntil !== 'forever') ? user.validUntil.substring(0, 10) : undefined,
      }
      this.editUserExpiredAtStringMinute = (user.validUntil && user.validUntil !== 'forever') ? user.validUntil.substring(11, 5) : ""
      this.editedUser = editUser
    },
    addPeriod() {
      this.newUser.allowPeriods = [...this.newUser.allowPeriods, { startTime: this.startTime, endTime: this.endTime }]
      this.startTime = ""
      this.endTime = ""
    },
    closePopupEditUser() {
      this.showEditUserDialog = false
    }
  }
};
</script>

<style>
.v-text-field {
  margin-top: 0 !important;
}
.v-text-field input {
  padding: 2px 0 2px;
}
.container {
  max-width: 100%;
}
.col {
  padding: 2px 10px !important;
}
.v-dialog {
  overflow-x: hidden;
}
@media screen and (max-width: 1024px) {
  .header-table-select-devices,
  .header-table-search {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media only screen and (max-width: 720px) {
  .continer-user-left,
  .continer-user-right,
  .container-user-info,
  .container-user-photo {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
