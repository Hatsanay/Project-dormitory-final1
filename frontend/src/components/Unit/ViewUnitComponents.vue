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
            @click="$router.push('/RegisUnit')"
          >
            New
          </CButton>
        </CCol>
      </CRow>
  
      <CRow style="margin-bottom: 10px">
        <CCol :md="2">
          
        </CCol>
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
            <div class="card-header">ตารางหน่วย</div>
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
                  <tr v-for="item in paginatedItems" :key="item.ID">
                    <td>{{ item.ID }}</td>
                    <td>{{ item.Name }}</td>
                    <td>{{ item.stat_Name }}</td>
                    <td>
                      <button
                        class="btn btn-warning btn-sm fontwhite"
                        @click="
                          $router.push({
                            path: '/EditUnitView',
                            query: { id: item.ID },
                          })
                        "
                      ><i class="fa-solid fa-user-pen"></i>
                        แก้ไข
                      </button>
                    </td>
                    <td>
                      <button
                        class="btn btn-danger btn-sm fontwhite"
                        @click="showModalDelete(item)"
                      ><i class="fa-solid fa-trash"></i>
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
                    <select
                      v-model="rowsPerPage"
                      class="form-select mx-2"
                      style="width: auto"
                    >
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
                  <button
                    class="btn btn-secondary"
                    :disabled="currentPage === 1"
                    @click="currentPage--"
                  >
                    Previous
                  </button>
                  <button
                    v-for="page in totalPages"
                    :key="page"
                    @click="setPage(page)"
                    :class="
                      page === currentPage
                        ? 'btn btn-primary mx-1'
                        : 'btn btn-secondary mx-1'
                    "
                  >
                    {{ page }}
                  </button>
                  <button
                    class="btn btn-secondary"
                    :disabled="currentPage === totalPages"
                    @click="currentPage++"
                  >
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
        <DeleteUnitComponent
          :selectedUnit="selectedUnit"
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
import RegisUnitComponent from "./RegisUnitComponent.vue";
import DeleteUnitComponent from "./DeleteUnitComponent.vue";

export default {
    name: "ViewUnitComponents",
    components: {
      RegisUnitComponent,
      DeleteUnitComponent
    },
    setup() {
        const columns = ref([
            { key: "ID", label: "รหัส" },
            { key: "Name", label: "ชื่อหน่วย" },
            { key: "stat_Name", label: "สถานะ" }
        ]);

        const unit = ref([]);
        const searchQuery = ref("");
        const filteredItems = ref([]);
        const rowsPerPage = ref(10);
        const currentPage = ref(1);
        const selectedUnit = ref({});
        const visibleDeleteModal = ref(false);

        const totalPages = computed(() => {
            return Math.ceil(filteredItems.value.length / rowsPerPage.value);
        });

        const fetchUnit = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("/api/auth/getUnit", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                unit.value = response.data;
                filterItems();
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูลหน่วย:", error);
            }
        };

        const filterItems = () => {
            filteredItems.value = unit.value.filter((item) => {
                const matchesSearch =
                    item.ID?.toString().toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                    item.Name?.toLowerCase().includes(searchQuery.value.toLowerCase());
                    item.stat_Name?.toLowerCase().includes(searchQuery.value.toLowerCase());

                return matchesSearch;
            }).sort((a, b) => 
            (a.ID < b.ID ? -1 : a.ID > b.ID ? 1 : 0));
        };

        const showModalDelete = (item) => {
      selectedUnit.value = item;
      visibleDeleteModal.value = true;
    };

    const closeDeleteModal = () => {
      visibleDeleteModal.value = false;
      selectedUnit.value = {};
      fetchStatus();
    };

        const paginatedItems = computed(() => {
            const start = (currentPage.value - 1) * rowsPerPage.value;
            const end = start + rowsPerPage.value;
            return filteredItems.value.slice(start, end);
        });

        onMounted(() => {
            fetchUnit();
        });

        watch(searchQuery, () => {
            filterItems();
            currentPage.value = 1;
        });

        return {
            columns,
            unit,
            searchQuery,
            filteredItems,
            paginatedItems,
            rowsPerPage,
            currentPage,
            totalPages,
            selectedUnit,
            showModalDelete,
            closeDeleteModal,
            visibleDeleteModal
        };
    },
};
</script>
