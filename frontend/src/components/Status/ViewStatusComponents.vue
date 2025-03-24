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
          @click="$router.push('/RegisStatus')"
        >
          New
        </CButton>
      </CCol>
    </CRow>

    
    <CRow style="margin-bottom: 10px">
      <CCol :md="2">
        <CFormSelect v-model="selectedType" aria-label="Filter by Type">
          <option value="">ประเภท</option>
          <option v-for="type in types" :key="type.ID" :value="type.Name">
            {{ type.Name }}
          </option>
        </CFormSelect>
      </CCol>
      <CCol :md="7"></CCol>
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
          <div class="card-header">ตารางสถานะ</div>
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
                <tr v-for="item in paginatedItems" :key="item.stat_ID">
                  <td>{{ item.stat_ID }}</td>
                  <td>{{ item.Name }}</td>
                  <td>{{ item.sta_name }}</td>
                  <td>{{ item.stat }}</td>
                  <td>
                    <button
                      class="btn btn-warning btn-sm"
                      @click="$router.push({ path: '/EditStatusView', query: { id: item.stat_ID } })"
                    >
                      <i class="fa-solid fa-user-pen"></i> แก้ไข
                    </button>
                  </td>
                  <td>
                    <button class="btn btn-danger btn-sm" @click="showModalDelete(item)">
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
                <button class="btn btn-secondary" :disabled="currentPage === 1" @click="setPage(currentPage - 1)">
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
                <button class="btn btn-secondary" :disabled="currentPage === totalPages" @click="setPage(currentPage + 1)">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CModal alignment="center" :visible="visibleDeleteModal" @close="closeDeleteModal" size="lg">
      <CModalHeader>
        <CModalTitle>ยืนยันการลบข้อมูล</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <DeleteStatusComponent
          :selectedStatus="selectedStatus"
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
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/vue";
import axios from "axios";
import DeleteStatusComponent from "./DeleteStatusComponent.vue";

export default {
  name: "ViewStatusComponents",
  components: {
    DeleteStatusComponent,
  },
  setup() {
    const columns = ref([
      { key: "stat_ID", label: "รหัสสถานะ" },
      { key: "Name", label: "ชื่อสถานะ" },
      { key: "sta_name", label: "ประเภท" },
      { key: "stat", label: "สถานะ" },
    ]);

    const status = ref([]);
    const searchQuery = ref("");
    const selectedType = ref("");
    const filteredItems = ref([]);
    const rowsPerPage = ref(10);
    const currentPage = ref(1);
    const toasts = ref([]);
    const types = ref([]);
    const selectedStatus = ref({});
    const visibleDeleteModal = ref(false);

    const totalPages = computed(() => Math.ceil(filteredItems.value.length / rowsPerPage.value));

    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getStatusForView", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        status.value = response.data;
        filterItems(); 
      } catch (error) {
        showToast("Error fetching status data", "error");
      }
    };

    const fetchStatusTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getStatusType", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        types.value = response.data;
      } catch (error) {
        showToast("Error fetching status types", "error");
      }
    };

    const showToast = (content, type = "success") => {
      toasts.value.push({
        title: type === "error" ? "Error" : "Success",
        content: content,
      });
    };

    const filterItems = () => {
      filteredItems.value = status.value
        .filter((item) => {
          const matchesType = selectedType.value ? item.sta_name === selectedType.value : true;

          const matchesSearch =
            item.stat_ID?.toString().includes(searchQuery.value) ||
            item.Name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            item.sta_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            item.stat?.toLowerCase().includes(searchQuery.value.toLowerCase());

          return matchesType && matchesSearch;
        })
        .sort((a, b) => a.stat_ID - b.stat_ID); // Fixed sorting by stat_ID
    };

    const showModalDelete = (item) => {
      selectedStatus.value = item;
      visibleDeleteModal.value = true;
    };

    const closeDeleteModal = () => {
      visibleDeleteModal.value = false;
      selectedStatus.value = {};
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
      fetchStatus();
      fetchStatusTypes();
    });

    watch([searchQuery, selectedType], filterItems);

    return {
      columns,
      status,
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
      selectedStatus,
      showModalDelete,
      closeDeleteModal,
      visibleDeleteModal
    };
  },
};
</script>
