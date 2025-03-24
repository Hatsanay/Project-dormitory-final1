<template>
  <div>
    <CRow>
      <CCol :md="10"></CCol>
      <CCol :md="2">
        <CButton
          color="primary"
          class="w-100"
          block
          style="margin-bottom: 10px"
          @click="$router.push('/RegisRoom')"
        >
          New
        </CButton>
      </CCol>
    </CRow>

    <CRow style="margin-bottom: 10px">
      <CCol :md="2">
        <CFormSelect v-model="selectedStatus" aria-label="Filter by Status" @change="filterItems">
          <option value="">สถานะ</option>
          <option v-for="status in statuss" :key="status.stat_ID" :value="status.stat_Name">
            {{ status.stat_Name }}
          </option>
        </CFormSelect>
      </CCol>
      <CCol :md="7"> </CCol>
      <CCol :md="3">
        <CInputGroup>
          <CFormInput placeholder="Search..." v-model="searchQuery" @input="filterItems" />
          <CInputGroupText>
            <CIcon name="cil-magnifying-glass" />
          </CInputGroupText>
        </CInputGroup>
      </CCol>
    </CRow>

    <div class="row">
      <div class="col-md-12">
        <div class="card mb-4">
          <div class="card-header">ตารางห้องพัก</div>
          <div class="card-body table-responsive p-0">
            <table class="table">
              <thead>
                <tr>
                  <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
                  <th>รายละเอียด</th>
                  <th>แก้ไข</th>
                  <th>ลบ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in paginatedItems" :key="item.room_ID">
                  <td>{{ item.room_ID }}</td>
                  <td>{{ item.room }}</td>
                  <td>{{ item.room_stat_Name }}</td>
                  <td>{{ item.room_status_Name }}</td>
                  <td>
                    <button class="btn btn-info btn-sm fontwhite" @click="showModal(item)">
                      <i class="fa-solid fa-eye"></i> รายละเอียด
                    </button>
                  </td>
                  <td>
                    <button
                      class="btn btn-warning btn-sm fontwhite"
                      @click="$router.push({ path: '/EditRoomView', query: { id: item.room_ID } })"
                    >
                      <i class="fa-solid fa-user-pen"></i> แก้ไข
                    </button>
                  </td>
                  <td>
                    <button class="btn btn-danger btn-sm fontwhite" @click="showModalDelete(item)">
                      <i class="fa-solid fa-trash"></i> ลบ
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer">
            <div class="row">
              <div class="col-md-4">
                <div class="d-flex align-items-center">
                  <span>Show</span>
                  <select v-model="rowsPerPage" class="form-select mx-2" style="width: auto" @change="filterItems">
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="20">20</option>
                    <option :value="50">50</option>
                    <option :value="100">100</option>
                  </select>
                  <span>entries</span>
                </div>
              </div>
              <div class="col-md-8 d-flex justify-content-end">
                <button class="btn btn-secondary" :disabled="currentPage === 1" @click="currentPage--">Previous</button>
                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="setPage(page)"
                  :class="page === currentPage ? 'btn btn-primary mx-1' : 'btn btn-secondary mx-1'"
                >
                  {{ page }}
                </button>
                <button class="btn btn-secondary" :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ViewModal -->
    <CModal alignment="center" :visible="visibleViewModal" @close="closeModal" size="lg">
      <CModalHeader>
        <CModalTitle>ข้อมูลห้องพัก</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <modelViewRoomComponents :selectedRoom="selectedRoom" />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="closeModal">ปิด</CButton>
      </CModalFooter>
    </CModal>

    <!-- DeleteModal -->
    <CModal alignment="center" :visible="visibleDeleteModal" @close="closeDeleteModal" size="lg">
      <CModalHeader>
        <CModalTitle>ข้อมูลห้องพัก</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <DeleteRoomComponent :selectedRoom="selectedRoom" :closeModal="closeDeleteModal" :refreshViewData="fetchRoom" />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="closeDeleteModal">Close</CButton>
      </CModalFooter>
    </CModal>

    <CToaster class="p-3" placement="top-end">
      <CToast v-for="(toast, index) in toasts" :key="index" visible>
        <CToastHeader closeButton>
          <span class="me-auto fw-bold">{{ toast.title }}</span>
        </CToastHeader>
        <CToastBody>{{ toast.content }}</CToastBody>
      </CToast>
    </CToaster>
  </div>
</template>

<script>
import { ref, watch, onMounted, computed } from "vue";
import axios from "axios";
import DeleteRoomComponent from "./DeleteRoomComponent.vue";
import modelViewRoomComponents from "./modelViewRoomComponents.vue"; // Added import for view modal

export default {
  name: "ViewRoomComponents",
  components: {
    DeleteRoomComponent,
    modelViewRoomComponents,
  },
  setup() {
    const columns = ref([
      { key: "room_ID", label: "รหัส" },
      { key: "room_Number", label: "เลขห้อง" },
      { key: "stat_Name", label: "สถานะห้อง" },
      { key: "status", label: "สถานะ" },
    ]);

    const room = ref([]);
    const statuss = ref([]);
    const searchQuery = ref("");
    const selectedStatus = ref("");
    const filteredItems = ref([]);
    const rowsPerPage = ref(10);
    const currentPage = ref(1);
    const visibleViewModal = ref(false);
    const visibleDeleteModal = ref(false);
    const selectedRoom = ref({});

    const totalPages = computed(() => Math.ceil(filteredItems.value.length / rowsPerPage.value));

    const fetchRoom = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getRoom", {
          headers: { Authorization: `Bearer ${token}` },
        });
        room.value = response.data;
        filterItems();
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลห้องพัก:", error);
      }
    };

    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getStatusRoom", {
          headers: { Authorization: `Bearer ${token}` },
        });
        statuss.value = response.data;
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล Status:", error);
      }
    };

    const filterItems = () => {
      filteredItems.value = room.value
        .filter((item) => {
          const matchesClass = selectedStatus.value ? item.room_stat_Name === selectedStatus.value : true;
          const matchesSearch =
            item.room_ID?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            item.room_Number?.toLowerCase().includes(searchQuery.value.toLowerCase());
          return matchesClass && matchesSearch;
        })
        .sort((a, b) => a.room_ID.localeCompare(b.room_ID));
    };

    const showModal = (item) => {
      selectedRoom.value = item;
      visibleViewModal.value = true;
    };

    const showModalDelete = (item) => {
      selectedRoom.value = item;
      visibleDeleteModal.value = true;
    };

    const closeModal = () => {
      visibleViewModal.value = false;
      selectedRoom.value = {};
    };

    const closeDeleteModal = () => {
      visibleDeleteModal.value = false;
      selectedRoom.value = {};
      fetchRoom();
    };

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * rowsPerPage.value;
      return filteredItems.value.slice(start, start + rowsPerPage.value);
    });

    const setPage = (page) => {
      currentPage.value = page;
    };

    onMounted(() => {
      fetchRoom();
      fetchStatus();
    });

    watch([selectedStatus, searchQuery], filterItems, { immediate: true });

    return {
      columns,
      room,
      statuss,
      searchQuery,
      selectedStatus,
      filteredItems,
      paginatedItems,
      rowsPerPage,
      currentPage,
      totalPages,
      setPage,
      showModal,
      showModalDelete,
      closeModal,
      visibleViewModal,
      visibleDeleteModal,
      closeDeleteModal,
      selectedRoom,
    };
  },
};
</script>
