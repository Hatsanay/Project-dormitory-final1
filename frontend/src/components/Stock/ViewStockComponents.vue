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
          @click="$router.push('/RegisStock')"
        >
          New
        </CButton>
      </CCol>
    </CRow>

    <CRow style="margin-bottom: 10px">
      <CCol :md="2">
        <CFormSelect v-model="selectedType" aria-label="Filter by Status" @change="filterItems">
          <option value="">ประเภท</option>
          <option v-for="type in types" :key="type.ID" :value="type.name">
            {{ type.name }}
          </option>
        </CFormSelect>
      </CCol>
      <CCol :md="7"></CCol>
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
          <div class="card-header">ตารางสต็อก</div>
          <div class="card-body table-responsive p-0">
            <table class="table">
              <thead>
                <tr>
                  <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
                  <th>แก้ไข</th>
                  <th>ลบ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="paginatedItems.length === 0">
                  <td colspan="8" class="text-center">ไม่มีข้อมูลที่ตรงกับการค้นหา</td>
                </tr>
                <tr v-for="item in paginatedItems" :key="item.ID">
                  <td>{{ item.ID }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ item.Type }}</td>
                  <td>{{ item.unit }}</td>
                  <td>{{ item.stat_Name }}</td>
                  <td>
                    <button
                      class="btn btn-warning btn-sm fontwhite"
                      @click="
                      $router.push({ 
                        path: '/EditStockView', 
                        query: { id: item.ID } })"
                    ><i class="fa-solid fa-user-pen"></i>
                      แก้ไข
                    </button>
                  </td>
                  <td>
                    <button class="btn btn-danger btn-sm fontwhite" 
                    @click="showModalDelete(item)">
                      <i class="fa-solid fa-trash"></i>
                      ลบ
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
                  <select v-model="rowsPerPage" class="form-select mx-2" @change="filterItems" style="width: auto">
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
      @close="closeDeleteModal"
      size="lg"
    >
      <CModalHeader>
        <CModalTitle>ยืนยันการลบข้อมูล</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <DeleteStockComponent
          :selectedStock="selectedStock"
          :closeModal="closeDeleteModal"
          :refreshViewData="fetchStatus"
        />
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
// import RegisStockComponent from "./RegisStockComponent.vue";
// import EditeStockComponents from "./EditeStockComponents.vue";
import DeleteStockComponent from "./DeleteStockComponent.vue";


export default {
  name: "ViewStockComponents",
  components: {
    // RegisStockComponent,
    // EditeStockComponents,
    DeleteStockComponent
    },
  setup() {
    const columns = ref([
      { key: "ID", label: "รหัสสต็อก" },
      { key: "name", label: "ชื่อวัสดุ" },
      { key: "quantity", label: "ปริมาณ" },
      { key: "Type", label: "ประเภท" },
      { key: "unit", label: "หน่วย" },
      { key: "stat_Name", label: "สถานะ" },
    ]);
    const stock = ref([]);
    const searchQuery = ref("");
    const selectedType = ref("");
    const filteredItems = ref([]);
    const rowsPerPage = ref(10);
    const currentPage = ref(1);
    const toasts = ref([]);
    const types = ref([]);
    const selectedStock = ref({});
    const visibleDeleteModal = ref(false);

    const totalPages = computed(() => {
      return Math.ceil(filteredItems.value.length / rowsPerPage.value);
    });

    const fetchStock = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getStockforstock", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        stock.value = response.data;
        filterItems();
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสต็อก:", error);
        showToast("Error fetching stock data", "error");
      }
    };

    const fetchStockTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getTypeStock", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        types.value = response.data;
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลประเภทสต็อก:", error);
      }
    };

    const showToast = (content, type = "success") => {
      toasts.value.push({
        title: type === "error" ? "Error" : "Success",
        content: content,
      });
    };

    const filterItems = () => {
  filteredItems.value = stock.value
    .filter((item) => {
      const matchesClass = selectedType.value
        ? item.Type === selectedType.value
        : true;

      const matchesSearch =
        item.ID?.toString().includes(searchQuery.value) || // Numeric field
        item.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.Type?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.stat_Name?.toLowerCase().includes(searchQuery.value.toLowerCase());

      return matchesClass && matchesSearch;
    })
    .sort((a, b) => {
      return a.ID - b.ID; 
    });
};
const showModalDelete = (item) => {
  selectedStock.value = item;
      visibleDeleteModal.value = true;
    };

    const closeDeleteModal = () => {
      visibleDeleteModal.value = false;
      selectedStock.value = {};
      fetchStatus();
    };

    const setPage = (page) => {
      currentPage.value = page;
      filterItems();
    };

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * rowsPerPage.value;
      const end = start + rowsPerPage.value;
      return filteredItems.value.slice(start, end);
    });

    onMounted(() => {
      fetchStock();
      fetchStockTypes();
    });

    watch([searchQuery, selectedType], filterItems);

    return {
      columns,
      stock,
      searchQuery,
      selectedType,
      filteredItems,
      paginatedItems,
      rowsPerPage,
      currentPage,
      totalPages,
      setPage,
      showToast,
      toasts,
      types,
      selectedStock,
      showModalDelete,
      closeDeleteModal,
      visibleDeleteModal
    };
  },
};
</script>
