<template>
  <div>
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === '1' }"
          @click.prevent="switchTab('1')"
          href="#"
        >
          <i class="fa-solid fa-hammer"></i>
          รับเรื่องแจ้งเบิกวัสดุอุปกรณ์
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === '2' }"
          @click.prevent="switchTab('2')"
          href="#"
        >
          <i class="fa-solid fa-cart-plus"></i>
          เบิกวัสดุอุปกรณ์
        </a>
      </li>
    </ul>

    <div class="tab-content mt-3">
      <div v-if="activeTab === '1'" class="tab-pane active">
        <CRow style="margin-bottom: 10px">
          <CCol :md="9"></CCol>
          <CCol :md="3" style="margin-bottom: 10px">
            <CInputGroup>
              <CFormInput placeholder="ค้นหา..." v-model="searchQuery" />
              <CInputGroupText>
                <CIcon name="cil-magnifying-glass" />
              </CInputGroupText>
            </CInputGroup>
          </CCol>
        </CRow>

        <CRow>
          <CCol
            v-for="item in paginatedItems"
            :key="item.requisition_ID"
            md="12"
            class="mb-4"
          >
            <CCard class="card-modern" @click="showModaltab1(item)">
              <CCardHeader class="card-header-modern">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="m-0 card-title-modern">
                    <i class="fa-solid fa-circle-user"></i> ผู้แจ้งเบิก:
                    {{ item.fullname }}
                  </h5>
                  <span class="date-modern">{{ item.requisition_Date }}</span>
                </div>
              </CCardHeader>
              <CCardBody>
                <div class="d-flex flex-column">
                  <p>
                    <strong
                      ><i class="fa-solid fa-basket-shopping"></i> รหัสการแจ้งเบิก:
                    </strong>
                    {{ item.requisition_ID }}
                  </p>
                  <p>
                    <strong
                      ><i class="fa-solid fa-screwdriver-wrench"></i>
                      รหัสการแจ้งซ่อม:</strong
                    >
                    {{ item.requisition_mainr_ID }}
                  </p>
                  <p>
                    <strong><i class="fa-solid fa-table-list"></i> จำนวน:</strong>
                    {{ item.countlist }} รายการ
                  </p>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <p></p>
                  <p class="status-modern mb-0">
                    <strong>สถานะ:</strong> {{ item.statusRequis }}
                  </p>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <div class="card-footer-modern">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <CButton
              class="btn-modern"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              Previous
            </CButton>

            <div>
              <span>Showing page {{ currentPage }} of {{ totalPages }}</span>
            </div>

            <CButton
              class="btn-modern"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              Next
            </CButton>
          </div>

          <div class="d-flex align-items-center">
            <span>Show</span>
            <select
              v-model="rowsPerPage"
              class="form-select-modern mx-2"
              style="width: auto"
            >
              <option :value="3">3</option>
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            <span>entries</span>
          </div>
        </div>
      </div>

      <div v-if="activeTab === '2'" class="tab-pane active">
        <CRow style="margin-bottom: 10px">
          <CCol :md="9"></CCol>
          <CCol :md="3" style="margin-bottom: 10px">
            <CInputGroup>
              <CFormInput placeholder="ค้นหา..." v-model="searchQuery" />
              <CInputGroupText>
                <CIcon name="cil-magnifying-glass" />
              </CInputGroupText>
            </CInputGroup>
          </CCol>
        </CRow>

        <CRow>
          <CCol
            v-for="item in paginatedItems"
            :key="item.requisition_ID"
            md="12"
            class="mb-4"
          >
            <CCard class="card-modern" @click="showModaltab2(item)">
              <CCardHeader class="card-header-modern">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="m-0 card-title-modern">
                    <i class="fa-solid fa-circle-user"></i> ผู้แจ้งเบิก:
                    {{ item.fullname }}
                  </h5>
                  <span class="date-modern">{{ item.requisition_Date }}</span>
                </div>
              </CCardHeader>
              <CCardBody>
                <div class="d-flex flex-column">
                  <p>
                    <strong
                      ><i class="fa-solid fa-basket-shopping"></i> รหัสการแจ้งเบิก:
                    </strong>
                    {{ item.requisition_ID }}
                  </p>
                  <p>
                    <strong
                      ><i class="fa-solid fa-screwdriver-wrench"></i>
                      รหัสการแจ้งซ่อม:</strong
                    >
                    {{ item.requisition_mainr_ID }}
                  </p>
                  <p>
                    <strong><i class="fa-solid fa-table-list"></i> จำนวน:</strong>
                    {{ item.countlist }} รายการ
                  </p>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <p></p>
                  <p class="status-modern mb-0">
                    <strong>สถานะ:</strong> {{ item.statusRequis }}
                  </p>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <div class="card-footer-modern">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <CButton
              class="btn-modern"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              Previous
            </CButton>

            <div>
              <span>Showing page {{ currentPage }} of {{ totalPages }}</span>
            </div>

            <CButton
              class="btn-modern"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              Next
            </CButton>
          </div>

          <div class="d-flex align-items-center">
            <span>Show</span>
            <select
              v-model="rowsPerPage"
              class="form-select-modern mx-2"
              style="width: auto"
            >
              <option :value="3">3</option>
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            <span>entries</span>
          </div>
        </div>
      </div>
    </div>

    <CModal
      alignment="center"
      :visible="visibleModelDetailRequest"
      @close="closeModelDetailRequest"
      aria-labelledby="VerticallyCenteredExample"
      size="xl"
      backdrop="static"
      fullscreen
    >
      <CModalHeader>
        <CModalTitle id="ModelDetailRequest">
          <h7>
            การแจ้งเบิกวัสดุ ID: {{ selectedUser.requisition_ID }}
            <span>วันที่: {{ selectedUser.requisition_Date }}</span>
          </h7>
        </CModalTitle>
      </CModalHeader>
      <CModalBody style="display: flex; flex-direction: column; height: 100%">
        <CRow style="flex-grow: 1">
          <CCol :md="12" style="flex-grow: 1; max-height: 800px; overflow-y: auto">
            <CCard style="flex-grow: 1">
              <CCardHeader>
                <h7>ตารางรายการแจ้งเบิก</h7>
              </CCardHeader>
              <CModalBody style="flex-grow: 1; overflow-y: auto">
                <CRow>
                  <CCol :md="8"> </CCol>
                  <CCol :md="4">
                    <CInputGroup style="margin-bottom: 10px">
                      <CFormInput
                        placeholder="ค้นหาวัสดุ..."
                        v-model="searchQueryStock"
                      />
                      <CInputGroupText>
                        <CIcon name="cil-magnifying-glass" />
                      </CInputGroupText>
                    </CInputGroup>
                  </CCol>
                </CRow>

                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>ลำดับ</th>
                      <th>ชื่อวัสดุ</th>
                      <th>จำนวนคงเหลือ</th>
                      <th>จำนวนที่ต้องการเบิก</th>
                      <th>จำนวนที่ขาด</th>
                      <th>หน่วย</th>
                      <th>สถานะ</th>
                      <th class="text-center">สั่งซื้อ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(stock, index) in paginatedStockItems" :key="index">
                      <td>{{ stock.listnumber }}</td>
                      <td>{{ stock.stockname }}</td>
                      <td>{{ stock.stockquantity }}</td>
                      <td>{{ stock.withdrawquantity }}</td>
                      <td>{{ stock.stockbroken }}</td>
                      <td>{{ stock.unit }}</td>
                      <td>{{ stock.statusRequislist }}</td>
                      <td>
                        <td class="d-flex justify-content-center align-items-center">
                        <CButton class="btnOrder" v-if="stock.stockbroken !== 0" color="primary" @click=" $router.push({
                              path: '/orderCreate',
                              query: { id: stock.requisition_ID },
                            })">
                          <i class="fa-solid fa-basket-shopping"></i>
                        </CButton>
                      </td>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div class="d-flex justify-content-between align-items-center">
                  <CButton
                    :disabled="currentPageStock === 1"
                    @click="currentPageStock--"
                    class="btn btn-secondary"
                  >
                    Previous
                  </CButton>

                  <span>Showing page {{ currentPageStock }} of {{ totalPagesStock }}</span>

                  <CButton
                    :disabled="currentPageStock === totalPagesStock"
                    @click="currentPageStock++"
                    class="btn btn-secondary"
                  >
                    Next
                  </CButton>
                </div>

                <div class="d-flex align-items-center mt-3">
                  <span>Show</span>
                  <select
                    v-model="rowsPerPageStock"
                    class="form-select-modern mx-2"
                    style="width: auto"
                  >
                    <option :value="3">3</option>
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="20">20</option>
                    <option :value="50">50</option>
                    <option :value="100">100</option>
                  </select>
                  <span>entries</span>
                </div>
              </CModalBody>
            </CCard>
          </CCol>
        </CRow>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" @click="closeModelDetailRequest">ปิด</CButton>

        <CButton color="primary" @click="acceptWithdrawRequest"> รับเรื่องแจ้งเบิก </CButton>
      </CModalFooter>
    </CModal>


   <!-- Modal for Tab 2 -->
<CModal
  alignment="center"
  :visible="visibleModelTab2"
  @close="closeModelTab2"
  aria-labelledby="VerticallyCenteredExample"
  size="xl"
  backdrop="static"
  fullscreen
>
  <CModalHeader>
    <CModalTitle id="ModelDetailTab2">
      <h7>
        การแจ้งเบิกวัสดุ ID: {{ selectedUserTab2.requisition_ID }}
        <span>วันที่: {{ selectedUserTab2.requisition_Date }}</span>
      </h7>
    </CModalTitle>
  </CModalHeader>
  <CModalBody style="display: flex; flex-direction: column; height: 100%">
    <CRow style="flex-grow: 1">
      <CCol :md="12" style="flex-grow: 1; max-height: 800px; overflow-y: auto">
        <CCard style="flex-grow: 1">
          <CCardHeader>
            <h7>ตารางรายการแจ้งเบิก</h7>
          </CCardHeader>
          <CModalBody style="flex-grow: 1; overflow-y: auto">
            <CRow>
              <CCol :md="8"> </CCol>
              <CCol :md="4">
                <CInputGroup style="margin-bottom: 10px">
                  <CFormInput
                    placeholder="ค้นหาวัสดุ..."
                    v-model="searchQueryStock"
                  />
                  <CInputGroupText>
                    <CIcon name="cil-magnifying-glass" />
                  </CInputGroupText>
                </CInputGroup>
              </CCol>
            </CRow>

            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>ชื่อวัสดุ</th>
                  <th>จำนวนที่ต้องการเบิก</th>
                  <th>หน่วย</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(stock, index) in paginatedStockItems" :key="index">
                  <td>{{ stock.listnumber }}</td>
                  <td>{{ stock.stockname }}</td>
                  <td>{{ stock.withdrawquantity }}</td>
                  <td>{{ stock.unit }}</td>
                  <td>{{ stock.statusRequislist }}</td>
                </tr>
              </tbody>
            </table>

            <div class="d-flex justify-content-between align-items-center">
              <CButton
                :disabled="currentPageStock === 1"
                @click="currentPageStock--"
                class="btn btn-secondary"
              >
                Previous
              </CButton>

              <span>Showing page {{ currentPageStock }} of {{ totalPagesStock }}</span>

              <CButton
                :disabled="currentPageStock === totalPagesStock"
                @click="currentPageStock++"
                class="btn btn-secondary"
              >
                Next
              </CButton>
            </div>

            <div class="d-flex align-items-center mt-3">
              <span>Show</span>
              <select
                v-model="rowsPerPageStock"
                class="form-select-modern mx-2"
                style="width: auto"
              >
                <option :value="3">3</option>
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
              <span>entries</span>
            </div>
          </CModalBody>
        </CCard>
      </CCol>
    </CRow>
  </CModalBody>

  <CModalFooter>
    <CButton color="primary" @click="acceptWithdrawTab2">เบิก/รับวัสดุ</CButton>
    <CButton color="danger" @click="cancelWithdrawTab2">ลบการเบิก</CButton>
    <CButton color="secondary" @click="closeModelTab2">ปิด</CButton>

  </CModalFooter>
</CModal>

  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import VueEasyLightbox from "vue-easy-lightbox";
import Swal from "sweetalert2";


export default {
  name: "starffWithdrawReq",
  components: {
    VueEasyLightbox,
  },
  setup() {
    const activeTab = ref("1");
    const searchQuery = ref("");
    const searchQueryStock = ref("");
    const items = ref([]);
    const stockItems = ref([]);
    const rowsPerPage = ref(3);
    const rowsPerPageStock = ref(20);
    const currentPage = ref(1);
    const currentPageStock = ref(1);
    const visibleModelDetailRequest = ref(false);
    const visibleModelTab2 = ref(false);
    const selectedUser = ref({});
    const selectedUserTab2 = ref({});
    

    const fetchRequisition = async () => {
      try {
        const response = await axios.get(`/api/auth/getWithdrawReq`);
        items.value = response.data;
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการแจ้งซ่อม:", error);
      }
    };

    const fetchReqWithdraw = async () => {
      try {
        const response = await axios.get(`/api/auth/getWithdraw`);
        items.value = response.data;
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการแจ้งซ่อม:", error);
      }
    };

    const fetchRequisitionlist = async (requiid) => {
  try {
    const response = await axios.get(`/api/auth/getWithdrawReqlist?id=${requiid}`);
    stockItems.value = response.data.filter(
      (item) => item.requisition_ID === requiid
    ); 
  } catch (error) {
    console.error("Error fetching history requests:", error);
  }
};


    const acceptWithdrawRequest = async () => {
        try {
          const requisitionID = selectedUser.value.requisition_ID;
          const mainr_ID = selectedUser.value.requisition_mainr_ID;
          
          if (!requisitionID) {
            Swal.fire("Error", "โปรดระบุ requisitionID", "error");
            return;
          }

          const hasShortage = stockItems.value.some((item) => item.stockbroken > 0);
          if (hasShortage) {
            Swal.fire("ไม่สามารถรับเรื่องได้", "วัสดุมีจำนวนไม่พอ กรุณาสั่งซื้อ", "warning");
            return;
          }

          const response = await axios.put('/api/auth/putReqWithdraw', {
            requisitionID: requisitionID,
            mainr_ID: mainr_ID,
          });


          Swal.fire("สำเร็จ", response.data.message, "success").then(() => {
                window.location.reload();
              });
              console.log('requisitionID:', requisitionID);
              console.log('mainr_ID:', mainr_ID);


          closeModelDetailRequest();

          fetchRequisition();
        } catch (error) {
          if (error.response && error.response.data.error) {
            Swal.fire("Error", error.response.data.error, "error");
          } else {
            Swal.fire("Error", "เกิดข้อผิดพลาดในการดำเนินการ", "error");
          }
        }
      };


      const acceptWithdrawTab2 = async () => {
          try {
            const requisitionID = selectedUserTab2.value.requisition_ID;

            if (!requisitionID) {
              Swal.fire("Error", "โปรดระบุ requisitionID", "error");
              return;
            }

            const response = await axios.put('/api/auth/putAcceptWithdraw', {
              requisitionID: requisitionID,
            });

            Swal.fire("สำเร็จ", response.data.message, "success").then(() => {
                window.location.reload();
              });

            closeModelTab2();
            fetchReqWithdraw();
          } catch (error) {
            console.error("เกิดข้อผิดพลาด:", error);
            Swal.fire("Error", "เกิดข้อผิดพลาดในการดำเนินการ", "error");
          }
        };


        const cancelWithdrawTab2 = async () => {
          try {
            const requisitionID = selectedUserTab2.value.requisition_ID;

            if (!requisitionID) {
              Swal.fire("Error", "โปรดระบุ requisitionID", "error");
              return;
            }

            const response = await axios.put('/api/auth/cancelWithdraw', {
              requisitionID: requisitionID,
            });

            Swal.fire("สำเร็จ", response.data.message, "success").then(() => {
                window.location.reload();
              });

            closeModelTab2();
            fetchReqWithdraw();
          } catch (error) {
            console.error("เกิดข้อผิดพลาด:", error);
            Swal.fire("Error", "เกิดข้อผิดพลาดในการดำเนินการ", "error");
          }
        };






const switchTab = (tab) => {
  activeTab.value = tab;
  searchQuery.value = "";
  searchQueryStock.value = "";
  selectedUser.value = {};
  selectedUserTab2.value = {};
  items.value = [];
  stockItems.value = [];
  currentPage.value = 1;
  currentPageStock.value = 1;

  if (tab === "2") {
    fetchReqWithdraw();
  } else if(tab === "1") {
    fetchRequisition();
  }
};



    const filteredItems = computed(() => {
      return items.value.filter((item) =>
        Object.keys(item).some((key) =>
          String(item[key]).toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      );
    });

    const filteredStockItems = computed(() => {
      return stockItems.value.filter((stock) =>
        Object.keys(stock).some((key) =>
          String(stock[key]).toLowerCase().includes(searchQueryStock.value.toLowerCase())
        )
      );
    });
    

    const totalPages = computed(() => {
      return Math.ceil(filteredItems.value.length / rowsPerPage.value);
    });

    const totalPagesStock = computed(() => {
      return Math.ceil(filteredStockItems.value.length / rowsPerPageStock.value);
    });

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * rowsPerPage.value;
      const end = start + rowsPerPage.value;
      return filteredItems.value.slice(start, end);
    });

    const paginatedStockItems = computed(() => {
      const start = (currentPageStock.value - 1) * rowsPerPageStock.value;
      const end = start + rowsPerPageStock.value;
      return filteredStockItems.value.slice(start, end);
    });

    const showModaltab1 = (item) => {
      selectedUser.value = item;
      fetchRequisitionlist(item.requisition_ID);
      visibleModelDetailRequest.value = true;
    };

    const closeModelDetailRequest = () => {
      visibleModelDetailRequest.value = false;
      selectedUser.value = {};
    };

    const showModaltab2 = (item) => {
      selectedUserTab2.value = item;
      fetchRequisitionlist(item.requisition_ID); 
      visibleModelTab2.value = true;
    };


    const closeModelTab2 = () => {
      visibleModelTab2.value = false;
      selectedUserTab2.value = {};
    };

    const orderItem = (stock) => {
      console.log(`กำลังสั่งซื้อ: ${stock.reqlist_stock_ID}`);
    };


    onMounted(() => {
      fetchRequisition();
    });

    return {
      activeTab,
      searchQuery,
      searchQueryStock,
      paginatedItems,
      paginatedStockItems,
      totalPages,
      totalPagesStock,
      rowsPerPage,
      rowsPerPageStock,
      currentPage,
      currentPageStock,
      visibleModelDetailRequest,
      selectedUser,
      showModaltab1,
      closeModelDetailRequest,
      switchTab,
      orderItem,
      acceptWithdrawRequest,

      visibleModelTab2,
      showModaltab2,
      closeModelTab2,
      acceptWithdrawTab2,
      cancelWithdrawTab2,
      selectedUserTab2,
    };
  },
};
</script>

<style scoped>
.card-body p {
  margin: 0;
}

.btnOrder{
  height: 100%;
  font-size: 10px;
}

.text-center {
  text-align: center;
}

td.text-center {
  display: flex;
  align-items: center;
  justify-content: center;
}


.date {
  font-weight: bold;
  color: white;
}

.cancelButton {
  color: white;
}

.status {
  font-size: 18px;
  color: rgb(228, 148, 0);
  text-align: right;
  margin-top: 10px;
}

.card-modern {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}

.card-modern:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-header-modern {
  color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 10px;
}
.card-header-modern-history {
  color: white;
  background-color: #6c757d;
  /* background-color: #212631; */

  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 10px;
}

.card-title-modern {
  font-size: 1.2rem;
  font-weight: bold;
}

.date-modern {
  font-weight: bold;
  color: #e0e0e0;
}

.status-modern {
  font-size: 16px;
  color: #ff9800;
  text-align: right;
}

.cancelButton-modern {
  width: 100%;
  color: white;
  background-color: #f44336;
  border-radius: 5px;
  padding: 10px;
}

.card-footer-modern {
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-modern {
  background-color: #6c757d;
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn-modern:hover {
  background-color: #5a6268;
}

.form-select-modern {
  border-radius: 5px;
  padding: 5px;
  border: 1px solid #ced4da;
}
</style>
