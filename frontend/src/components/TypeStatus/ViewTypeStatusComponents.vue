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
          @click="$router.push('/RegisTypeStatus')"
        >
          New
        </CButton>
      </CCol>
    </CRow>

    <CRow style="margin-bottom: 10px">
      <CCol :md="2"></CCol>
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
          <div class="card-header">ตารางประเภทสถานะ</div>
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
                  <td>{{ item.statTyp_ID }}</td>
                  <td>{{ item.Name }}</td>
                  <td>{{ item.stat_Name }}</td>
                  <td>
                    <button
                      class="btn btn-warning btn-sm fontwhite"
                      @click="
                      $router.push({ 
                        path: '/EditTypeStatusView', 
                        query: { id: item.statTyp_ID } })"
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
                <button class="btn btn-secondary" :disabled="currentPage === 1" @click="prevPage">
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
                <button class="btn btn-secondary" :disabled="currentPage === totalPages" @click="nextPage">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
<!--//////////////////////////////////Delete////////////////////////////////////////-->
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
        <DeleteTypeStatusComponent
          :selectedTypeStatus="selectedTypeStatus"
          :closeModal="closeDeleteModal"
          :refreshViewData="fetchStatus"
        />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="closeDeleteModal">Close</CButton>
      </CModalFooter>
    </CModal>
<!--//////////////////////////////////////////////////////////////////////////-->
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
import RegisTypeStatusComponent from "./RegisTypeStatusComponent.vue";
import EditeTypeStatusComponents from "./EditeTypeStatusComponents.vue";
import DeleteTypeStatusComponent from "./DeleteTypeStatusComponent.vue";

export default {
  name: "ViewTypeStatusComponents",
  components: {
    RegisTypeStatusComponent,
    EditeTypeStatusComponents,
    DeleteTypeStatusComponent
    },

  setup() {
    const columns = ref([
      { key: "statTyp_ID", label: "รหัสประเภทสถานะ" },
      { key: "Name", label: "ชื่อประเภท" },
      { key: "stat_Name", label: "สถานะ" },
    ]);

    const statusTypes = ref([]);
    const filteredItems = ref([]); 
    const searchQuery = ref(""); 
    const rowsPerPage = ref(10); 
    const currentPage = ref(1); 
    const toasts = ref([]); 
    const selectedTypeStatus = ref({});
    const visibleDeleteModal = ref(false);

    const totalPages = computed(() => {
      return Math.ceil(filteredItems.value.length / rowsPerPage.value);
    });

    const fetchStatusTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getStatusType", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        statusTypes.value = response.data;
        filterItems(); // Filter items after data is fetched
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลประเภทสถานะ:", error);
        showToast("Error fetching status types", "error");
      }
    };

    const showToast = (content, type = "success") => {
      toasts.value.push({
        title: type === "error" ? "Error" : "Success",
        content: content,
      });
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        filterItems();
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        filterItems();
      }
    };

    // Filter items based on search query
    const filterItems = () => {
      filteredItems.value = statusTypes.value
        .filter((item) => {
          const matchesSearch =
            item.statTyp_ID?.toString().includes(searchQuery.value) ||
            item.Name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            item.stat_Name?.toLowerCase().includes(searchQuery.value.toLowerCase());

          return matchesSearch;
        })
        .sort((a, b) => a.statTyp_ID - b.statTyp_ID); // Sort numerically by ID
    };

    const showModalDelete = (item) => {
      selectedTypeStatus.value = item;
      visibleDeleteModal.value = true;
    };

    const closeDeleteModal = () => {
      visibleDeleteModal.value = false;
      selectedTypeStatus.value = {};
      fetchStatus();
    };

    const setPage = (page) => {
      currentPage.value = page;
      filterItems(); // Refetch filtered items for pagination
    };

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * rowsPerPage.value;
      const end = start + rowsPerPage.value;
      return filteredItems.value.slice(start, end);
    });

    onMounted(() => {
      fetchStatusTypes(); // Fetch status types on component mount
    });

    watch(searchQuery, filterItems); // Watch searchQuery and filter on change

    return {
      columns,
      searchQuery,
      filteredItems,
      paginatedItems,
      rowsPerPage,
      currentPage,
      totalPages,
      setPage,
      showToast,
      prevPage,
      nextPage,
      toasts,
      selectedTypeStatus,
      showModalDelete,
      closeDeleteModal,
      visibleDeleteModal
    };
  },
};
</script>
