<template>
	<div>
		<v-container fluid class="grid-list-xl py-0 mt-n3">
			<v-row>
				<app-card
					:heading="$t('message.deviceList')"
					:fullBlock="true"
					colClasses="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12"
				>
					<v-data-table
						:headers="headers"
						:items="devices"
						:search="search"
                        @item-expanded="expandDevice"
						v-model="selected"
						item-key="name"
                        show-expand
                        single-expand
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
						<td>
							<v-checkbox
								color="primary"
								hide-details
								v-model="props.selected"
							></v-checkbox>
						</td>
						<td>{{ props.item.name }}</td>
					</template>
                    <template v-slot:expanded-item="{ headers, item }">
                        <td :colspan="headers.length" v-for="(user) in item.users" :key="user.id">{{ user.name }}</td>
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
      selected: [],
      headers: [
        {
          text: "Tên thiết bị",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: '', value: 'data-table-expand' }
      ],
      devices: []
    };
  },
  mounted() {
    this.getDevices();
  },
  methods: {
    async getDevices() {
      const deviceResponse = await this.$axios.get('/registered/device/list')
      if (deviceResponse.status === 200) {
          this.devices = deviceResponse.data.map(device => {
              return { name: device, users: [] }
          })
      } else {
        Vue.notify({
          group: 'loggedIn',
          type: 'error',
          text: 'Không thể lấy danh sách thiết bị. Vui lòng tải lại trang!'
        })
      }
    },
    async expandDevice({ item }) {
        if (!item.users.length) {
            const usersResponse = await this.$axios.get(`/get/user/list/of/${item.name}`)
            if (usersResponse.status === 200) {
                item.users = usersResponse.data
            } else {
                Vue.notify({
                    group: 'loggedIn',
                    type: 'error',
                    text: 'Không thể lấy danh sách người dùng. Vui lòng thử lại sau!'
                })
            }
        }
    }
  }
};
</script>
