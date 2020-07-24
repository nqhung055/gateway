<template>
	<div>
		<v-container fluid class="grid-list-xl py-0 mt-n3">
			<v-row>
				<app-card
					:heading="$t('message.usersTitle')"
					:fullBlock="true"
					colClasses="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12"
				>
        <v-btn color="success " @click="createNewUser(item)">Create User</v-btn>
        <v-select
          outlined
          v-model="selectedDevice"
          :items="devices"
          label="Select Device"
          @change="changeSelectedDevice()"
        ></v-select>
					<v-data-table
						:headers="headers"
						:items="users"
						item-key="userId"
					>
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
            <v-btn color="error" @click="removeUser(item)">Remove</v-btn>
          </template>
					</v-data-table>
				</app-card>
			</v-row>
		</v-container>
	</div>
</template>

<script>
import Vue from 'vue';

export default {
  data() {
    return {
      loader: true,
      search: "",
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
      devices: [],
      users: [],
      selectedDevice: ""
    };
  },
  mounted() {
    this.getDevices();
  },
  methods: {
    async changeSelectedDevice() {
      const usersResponse = await this.$axios.get(`/get/user/list/of/${this.selectedDevice}`)
        if (usersResponse.status === 200) {
          this.users = usersResponse.data
        } else {
          Vue.notify({
            group: 'loggedIn',
            type: 'error',
            text: 'Không thể lấy danh sách người dùng. Vui lòng thử lại sau!'
          })
        }
    },
    async createNewUser() {
      console.log(7777777777);
    },
    async removeUser(user) {
      const deleteResponse = await this.$axios.delete(`/delete/user`, { params: { userId: user.userId, deviceId: this.selectedDevice } })
      if (deleteResponse.status === 200) {
        this.users = this.users.filter(holdUser => holdUser.userId !== user.userId)
        Vue.notify({
          group: 'loggedIn',
          type: 'success',
          text: 'Xóa người dùng thành công!'
        })
      } else {
        Vue.notify({
          group: 'loggedIn',
          type: 'error',
          text: 'Có lỗi khi xóa người dùng. Vui lòng thử lại sau!'
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
          text: 'Không thể lấy danh sách thiết bị. Vui lòng tải lại trang!'
        })
      }
    }
  }
};
</script>
