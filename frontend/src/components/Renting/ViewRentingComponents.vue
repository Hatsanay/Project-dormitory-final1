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
          @click="$router.push('/RegisRenting')"
        >
          New
        </CButton>
      </CCol>
    </CRow>

    <CRow style="margin-bottom: 10px">
      <CCol :md="2"></CCol>
      <CCol :md="7"> </CCol>
      <CCol :md="3">
        <CInputGroup>
          <CFormInput placeholder="Search..." v-model="searchQuery" />
          <CInputGroupText>
            <CIcon name="cil-magnifying-glass" />
          </CInputGroupText>
        </CInputGroup>
      </CCol>
    </CRow>

    <div class="row">
      <div class="col-md-12">
        <div class="card mb-4">
          <div class="card-header">ตารางการเช่า</div>
          <div class="card-body table-responsive p-0">
            <table class="table">
              <thead>
                <tr>
                  <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
                  <th>ลบ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in paginatedItems" :key="item.ID">
                  <td>{{ item.renting_ID }}</td>
                  <td>{{ item.userName }}</td>
                  <td>{{ item.room_Number }}</td>
                  <td>{{ item.stat_Name }}</td>
                  <!--<td>
                    <button
                      class="btn btn-warning btn-sm fontwhite"
                      @click="
                        $router.push({
                          path: '/EditRentingView',
                          query: { id: item.ID },
                        })
                      "
                    ><i class="fa-solid fa-user-pen"></i> แก้ไข</button>
                  </td>-->
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
                  <select v-model="rowsPerPage" class="form-select mx-2" style="width: auto">
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
                <button class="btn btn-secondary" :disabled="currentPage === 1" @click="currentPage--">
                  Previous
                </button>
                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="setPage(page)"
                  :class="page === currentPage ? 'btn btn-primary mx-1' : 'btn btn-secondary mx-1'"
                >
                  {{ page }}
                </button>
                <button class="btn btn-secondary" :disabled="currentPage === totalPages" @click="currentPage++">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6"></div>
    </div>

    <CModal 
    alignment="center" 
    :visible="visibleDeleteModal" 
    @close="closeDeleteModal" size="lg">

      <CModalHeader>
        <CModalTitle>ยืนยันการลบข้อมูล</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <DeleteRentingComponent 
        :selectedRenting="selectedRenting" 
        :closeModal="closeDeleteModal" 
        :refreshViewData="fetchRentings" />
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
import DeleteRentingComponent from "./DeleteRentingComponent.vue";

export default {
  name: "ViewRentingComponents",
  components: {
    DeleteRentingComponent,
  },
  setup() {
    const columns = ref([
      { key: "renting_ID", label: "รหัสการเช่า" },
      { key: "userName", label: "ชื่อผู้เช่า" },
      { key: "room_Number", label: "หมายเลขห้อง" },
      { key: "stat_Name", label: "สถานะ" },
    ]);

    const rentings = ref([]);
    const searchQuery = ref("");
    const filteredItems = ref([]);
    const rowsPerPage = ref(10);
    const currentPage = ref(1);
    const selectedRenting = ref({});
    const visibleDeleteModal = ref(false);
    const toasts = ref([]);

    const totalPages = computed(() => {
      return Math.ceil(filteredItems.value.length / rowsPerPage.value);
    });

    const fetchRentings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getRenting", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        rentings.value = response.data;
        filterItems();
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการเช่า:", error);
        toasts.value.push({
          title: "Error",
          content: "ไม่สามารถดึงข้อมูลการเช่าได้",
        });
      }
    };

    const filterItems = () => {
      filteredItems.value = rentings.value
        .filter((item) => {
          const matchesSearch =
            item.renting_ID?.toString().toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            item.userName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            item.room_Number?.toLowerCase().includes(searchQuery.value.toLowerCase())||
            item.stat_Name?.toLowerCase().includes(searchQuery.value.toLowerCase());

          return matchesSearch;
        })
        .sort((a, b) => (a.ID < b.ID ? -1 : a.ID > b.ID ? 1 : 0));
    };

    const showModalDelete = (item) => {
      selectedRenting.value = item;
      visibleDeleteModal.value = true;
    };

    const closeDeleteModal = () => {
      visibleDeleteModal.value = false;
      selectedRenting.value = {};
      fetchRentings();
    };

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * rowsPerPage.value;
      const end = start + rowsPerPage.value;
      return filteredItems.value.slice(start, end);
    });

    onMounted(() => {
      fetchRentings();
    });

    watch(searchQuery, () => {
      filterItems();
      currentPage.value = 1;
    });

    return {
      columns,
      rentings,
      searchQuery,
      filteredItems,
      paginatedItems,
      rowsPerPage,
      currentPage,
      totalPages,
      selectedRenting,
      showModalDelete,
      closeDeleteModal,
      visibleDeleteModal,
      toasts,
    };
  },
};
</script>
