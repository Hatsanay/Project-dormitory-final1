<template>
  <div>
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === '1' }"
          @click.prevent="setActiveTab('1')"
          href="#"
        >
          <i class="fa-solid fa-screwdriver-wrench"></i>
          คำร้องขอแจ้งซ่อม
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === '2' }"
          @click.prevent="setActiveTab('2')"
          href="#"
        >
          <i class="fa-solid fa-clock-rotate-left"></i>
          ประวัติการแจ้งซ่อม
        </a>
      </li>
    </ul>

    <div class="tab-content mt-3">
      <!-- Tab 1 -->
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
          <CCol v-for="item in paginatedItems" :key="item.mainr_ID" md="12" class="mb-4">
            <CCard class="card-modern" @click="showModal(item)">
              <CCardHeader
                class="card-header-modern"
                v-if="item.status_ID === 'STC000001'"
                :class="{ 'bg-warning text-dark': item.status_ID === 'STC000001' }"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="m-0 card-title-modern">
                    <i class="fa-solid fa-circle-user"></i> ผู้แจ้ง: {{ item.fullname }}
                  </h5>
                  <span class="date-modern text-dark">{{ item.mainr_Date }}</span>
                </div>
              </CCardHeader>

              <CCardHeader
                class="card-header-modern"
                v-else
                :class="{ 'bg-secondary': item.status_ID !== 'STC000001' }"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="m-0 card-title-modern">
                    <i class="fa-solid fa-circle-user"></i> ผู้แจ้ง: {{ item.fullname }}
                  </h5>
                  <span class="date-modern">{{ item.mainr_Date }}</span>
                </div>
              </CCardHeader>

              <CCardBody>
                <div class="d-flex flex-column">
                  <p>
                    <strong><i class="fa-regular fa-id-card"></i> รหัส: </strong>
                    {{ item.mainr_ID }}
                  </p>
                  <p>
                    <strong><i class="fa-solid fa-igloo"></i> ห้อง:</strong>
                    {{ item.roomNumber }}
                  </p>
                  <p>
                    <strong><i class="fa-regular fa-newspaper"></i> หัวเรื่อง:</strong>
                    {{ item.mainr_ProblemTitle }}
                  </p>
                  <p>
                    <strong
                      ><i class="fa-solid fa-screwdriver-wrench"></i> ประเภท:</strong
                    >
                    {{ item.Type }}
                  </p>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <p></p>
                  <p v-if="item.status_ID != 'STC000009'" class="status-modern mb-0">
                    <div
                  v-if="item.scheduleTime"
                  class="d-flex justify-content-between align-items-center"
                >
                  <p></p>
                  <p v-if="item.status_ID != 'STC000003'" class="status-modern mb-0">
                    <strong>เวลานัด:</strong> {{ item.scheduleTime }}
                  </p>
                </div>
                    <strong>สถานะ:</strong> {{ item.status }}
                  </p>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <p></p>
                  <p v-if="item.status_ID == 'STC000009'" class="status-modern mb-0">
                    <strong>สถานะ:</strong> {{ item.status }} (รอรับเรื่องเบิก)
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

      <!-- tab2 -->
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
          <CCol v-for="item in paginatedItems" :key="item.mainr_ID" md="12" class="mb-4">
            <CCard class="card-modern" @click="showModalhistory(item)">
              <CCardHeader class="card-header-modern-history">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="m-0 card-title-modern">
                    <i class="fa-solid fa-circle-user"></i> ผู้แจ้ง: {{ item.fullname }}
                  </h5>
                  <span class="date-modern">{{ item.mainr_Date }}</span>
                </div>
              </CCardHeader>
              <CCardBody>
                <div class="d-flex flex-column">
                  <p>
                    <strong><i class="fa-regular fa-id-card"></i> รหัส: </strong>
                    {{ item.mainr_ID }}
                  </p>
                  <p>
                    <strong><i class="fa-solid fa-igloo"></i> ห้อง:</strong>
                    {{ item.roomNumber }}
                  </p>
                  <p>
                    <strong><i class="fa-regular fa-newspaper"></i> หัวเรื่อง:</strong>
                    {{ item.mainr_ProblemTitle }}
                  </p>
                  <p>
                    <strong
                      ><i class="fa-solid fa-screwdriver-wrench"></i> ประเภท:</strong
                    >
                    {{ item.Type }}
                  </p>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <p></p>
                  <p class="status-modern mb-0">
                    <strong>สถานะ:</strong> {{ item.status }}
                  </p>
                </div>

                <div
                  v-if="item.SuccessDate != 'Invalid Date Invalid Date'"
                  class="d-flex justify-content-between align-items-center"
                >
                  <p></p>
                  <p class="status-modern mb-0">
                    <strong>เวลา:</strong> {{ item.SuccessDate }}
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
    >
      <CModalHeader>
        <CModalTitle id="ModelDetailRequest">
          <i class="fa-solid fa-screwdriver-wrench"></i>
          รายละเอียดการแจ้งซ่อม ID: {{ selectedUser.mainr_ID }}
          <span>วันที่: {{ selectedUser.mainr_Date }}</span>
        </CModalTitle>
      </CModalHeader>
      <CModalBody style="max-height: 400px; overflow-y: auto">
        <p style="word-wrap: break-word; white-space: pre-wrap">
          <strong>ผู้แจ้ง: </strong> {{ selectedUser.fullname }}
        </p>
        <p style="word-wrap: break-word; white-space: pre-wrap">
          <strong>ห้อง:</strong> {{ selectedUser.roomNumber }}
        </p>
        <p style="word-wrap: break-word; white-space: pre-wrap">
          <strong>หัวเรื่อง:</strong> {{ selectedUser.mainr_ProblemTitle }}
        </p>
        <p style="word-wrap: break-word; white-space: pre-wrap">
          <strong>รายละเอียด:</strong> {{ selectedUser.mainr_ProblemDescription }}
        </p>
        <p style="word-wrap: break-word; white-space: pre-wrap">
          <strong>ประเภท:</strong> {{ selectedUser.Type }}
        </p>
        <p tyle="word-wrap: break-word; white-space: pre-wrap">
          <strong>สถานะ:</strong> {{ selectedUser.status }}
        </p>


        <div v-if="imageUrls.length > 0" class="mt-3">
          <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center">
            <img
              v-for="(url, index) in imageUrls"
              :key="index"
              :src="getImageUrl(url)"
              alt="รูปภาพแจ้งซ่อม"
              style="
                max-width: 500px;
                max-height: 500px;
                object-fit: cover;
                cursor: pointer;
              "
              @click="openImageModal(index)"
            />
          </div>
        </div>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" @click="closeModelDetailRequest">ปิด</CButton>
        <CButton
          v-if="selectedUser.status_ID == 'STC000001'"
          class="frontwhite"
          color="danger"
          @click="denyClick(selectedUser)"
        >
          <i class="fa-solid fa-ban"></i>
          ปฎิเสธ
        </CButton>
        <CButton
          v-if="selectedUser.status_ID == 'STC000001'"
          color="primary"
          @click="sendtomac(selectedUser)"
        >
          <i class="fa-solid fa-paper-plane"></i>
          ส่งคำร้องให้ช่างตรวจสอบ
        </CButton>

        <CButton
          v-if="selectedUser.status_ID == 'STC000003'"
          color="success text-light"
          @click="$router.push('/starffTimeReqView')"
        >
          <i class="fa-solid fa-paper-plane"></i>
          ไปหน้านัดเวลา
        </CButton>
        <CButton
          v-if="selectedUser.status_ID == 'STC000009'"
          color="success text-light"
          @click="$router.push('/starffWithdrawReqView')"
        >
          <i class="fa-solid fa-paper-plane"></i>
          ไปหน้ารับเรื่องเบิก
        </CButton>
      </CModalFooter>
    </CModal>

    <CModal
      alignment="center"
      :visible="visibleModelHistoryRequest"
      @close="closeModelHistoryRequest"
      size="xl"
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle id="ModelHistoryRequest">
          <i class="fa-solid fa-screwdriver-wrench"></i>
          รายละเอียดการแจ้งซ่อม ID: {{ selectedUser.mainr_ID }}
          <span>วันที่: {{ selectedUser.mainr_Date }}</span>
        </CModalTitle>
      </CModalHeader>
      <CModalBody style="max-height: 400px; overflow-y: auto">
        <p><strong>ผู้แจ้ง: </strong> {{ selectedUser.fullname }}</p>
        <p><strong>ห้อง:</strong> {{ selectedUser.roomNumber }}</p>
        <p><strong>หัวเรื่อง:</strong> {{ selectedUser.mainr_ProblemTitle }}</p>
        <p><strong>รายละเอียด:</strong> {{ selectedUser.mainr_ProblemDescription }}</p>
        <p><strong>ประเภท:</strong> {{ selectedUser.Type }}</p>
        <p><strong>สถานะ:</strong> {{ selectedUser.status_ID }}</p>

        <div v-if="imageUrls.length > 0" class="mt-3">
          <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center">
            <img
              v-for="(url, index) in imageUrls"
              :key="index"
              :src="getImageUrl(url)"
              alt="รูปภาพแจ้งซ่อม"
              style="
                max-width: 500px;
                max-height: 500px;
                object-fit: cover;
                cursor: pointer;
              "
              @click="openImageModal(index)"
            />
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="closeModelHistoryRequest">ปิด</CButton>
      </CModalFooter>
    </CModal>

    <vue-easy-lightbox
      :visible="visibleImageModal"
      :imgs="imageUrls.map((url) => getImageUrl(url))"
      :index="currentImageIndex"
      @hide="closeImageModalOnly"
      @prev="handlePreviousImage"
      @next="handleNextImage"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import VueEasyLightbox from "vue-easy-lightbox";
import Swal from "sweetalert2";

export default {
  name: "starffMgnReq",
  components: {
    VueEasyLightbox,
  },
  setup() {
    const activeTab = ref("1");
    const searchQuery = ref("");
    const items = ref([]);
    const rowsPerPage = ref(3);
    const currentPage = ref(1);
    const visibleModelDetailRequest = ref(false);
    const visibleImageModal = ref(false);
    const selectedUser = ref({});
    const imageUrls = ref([]);
    const currentImageIndex = ref(0);

    const searchQuerytab2 = ref("");
    const itemstab2 = ref([]);
    const rowsPerPagetab2 = ref(3);
    const currentPagetab2 = ref(1);
    const visibleModelDetailRequesttab2 = ref(false);
    const visibleModelHistoryRequest = ref(false);
    const visibleImageModaltab2 = ref(false);
    const selectedUsertab2 = ref({});

    const setActiveTab = (tab) => {
      activeTab.value = tab;
      searchQuery.value = "";
      selectedUser.value = {};
      imageUrls.value = [];
      currentPage.value = 1;
      items.value = [];
      if (tab === "1") {
        fetchRequests();
      } else if (tab === "2") {
        fetchRequeststab2();
      } else if (tab === "3") {
        // fetchRequestsTab3();
      } else if (tab === "4") {
      }
    };

    const fetchRequests = async () => {
      const userId = localStorage.getItem("userID");
      try {
        const response = await axios.get(`/api/auth/getReq`);
        items.value = response.data;

        // จัดเรียงสถานะให้ "STC000001" ขึ้นมาก่อน
        items.value.sort((a, b) => {
          if (a.mainr_Stat_ID === "STC000001" && b.mainr_Stat_ID !== "STC000001") {
            return -1;
          } else if (a.mainr_Stat_ID !== "STC000001" && b.mainr_Stat_ID === "STC000001") {
            return 1;
          }
          return 0;
        });
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการแจ้งซ่อม:", error);
      }
    };

    const fetchRequeststab2 = async () => {
      const userId = localStorage.getItem("userID");
      try {
        const response = await axios.get(`/api/auth/getReqhistory`);
        items.value = response.data;
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการแจ้งซ่อม:", error);
      }
    };

    const showModalhistory = (item) => {
      selectedUser.value = item;
      fetchImages(item.mainr_ID);
      visibleModelHistoryRequest.value = true;
    };

    const closeModelHistoryRequest = () => {
      visibleModelHistoryRequest.value = false;
      selectedUser.value = {};
      imageUrls.value = [];
    };

    const filteredItems = computed(() => {
      return items.value.filter((item) => {
        return Object.keys(item).some((key) => {
          return String(item[key])
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase());
        });
      });
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredItems.value.length / rowsPerPage.value);
    });

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * rowsPerPage.value;
      const end = start + rowsPerPage.value;
      return filteredItems.value.slice(start, end);
    });

    const fetchImages = async (mainr_ID) => {
      try {
        const response = await axios.get(`/api/auth/getImgById?id=${mainr_ID}`);
        imageUrls.value = response.data.map((img) => img.imges_Path);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงรูปภาพ:", error);
        imageUrls.value = [];
      }
    };

    const getImageUrl = (path) => {
      // return `http://localhost:3030/uploads/${path}`; //local
      return `http://localhost:3030/uploads/${path}`; //hosting
    };

    const showModal = (item) => {
      selectedUser.value = item;
      fetchImages(item.mainr_ID);
      visibleModelDetailRequest.value = true;
    };

    const openImageModal = (index) => {
      currentImageIndex.value = index;
      visibleImageModal.value = true;
    };

    const closeImageModalOnly = () => {
      visibleImageModal.value = false;
    };

    const closeModelDetailRequest = () => {
      visibleModelDetailRequest.value = false;
      selectedUser.value = {};
      imageUrls.value = [];
    };

    const handlePreviousImage = () => {
      if (currentImageIndex.value > 0) {
        currentImageIndex.value -= 1;
      }
    };

    const handleNextImage = () => {
      if (currentImageIndex.value < imageUrls.value.length - 1) {
        currentImageIndex.value += 1;
      }
    };

    const denyClick = (selectedUser) => {
      Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "การปฎิเสธคำร้องนี้ไม่สามารถย้อนกลับได้!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยันการปฎิเสธ",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.put(`/api/auth/denyReq`, {
              mainr_ID: selectedUser.mainr_ID,
            });

            Swal.fire({
              title: "ปฎิเสธเรียบร้อย!",
              text: "การแจ้งซ่อมของคุณถูกปฎิเสธแล้ว.",
              icon: "success",
            }).then(() => {
              window.location.reload();
            });

            closeModelDetailRequest();
            fetchRequests();
          } catch (error) {
            console.error("เกิดข้อผิดพลาดในการปฎิเสธแจ้งซ่อม:", error);
            Swal.fire({
              title: "เกิดข้อผิดพลาด!",
              text: "ไม่สามารถปฎิเสธการแจ้งซ่อมได้.",
              icon: "error",
            });
          }
        }
      });
    };

    const sendtomac = (selectedUser) => {
      Swal.fire({
        title: "คุณแน่ใจหรือไม่ที่จะส่งคำร้องให้ช่าง?",
        text: "การส่งคำร้องนี้ไม่สามารถย้อนกลับได้!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยันส่งคำร้อง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.put(`/api/auth/sendtomacReq`, {
              mainr_ID: selectedUser.mainr_ID,
            });

            Swal.fire({
              title: "ส่งคำร้องเรียบร้อย!",
              text: "ส่งคำร้องให้ช่างแล้ว.",
              icon: "success",
            }).then(() => {
              window.location.reload();
            });

            closeModelDetailRequest();
            fetchRequests();
          } catch (error) {
            console.error("เกิดข้อผิดพลาดในการปฎิเสธแจ้งซ่อม:", error);
            Swal.fire({
              title: "เกิดข้อผิดพลาด!",
              text: "ไม่สามารถปฎิเสธการแจ้งซ่อมได้.",
              icon: "error",
            });
          }
        }
      });
    };

    onMounted(() => {
      fetchRequests();
    });

    return {
      activeTab,
      setActiveTab,
      searchQuery,
      paginatedItems,
      totalPages,
      rowsPerPage,
      currentPage,
      visibleModelDetailRequest,
      closeModelDetailRequest,
      showModal,
      selectedUser,
      imageUrls,
      getImageUrl,
      openImageModal,
      closeImageModalOnly,
      visibleImageModal,
      currentImageIndex,
      handlePreviousImage,
      handleNextImage,
      denyClick,
      sendtomac,

      //tab2
      searchQuerytab2,
      itemstab2,
      rowsPerPagetab2,
      currentPagetab2,
      visibleModelDetailRequesttab2,
      visibleImageModaltab2,
      selectedUsertab2,
      visibleModelHistoryRequest,
      showModalhistory,
      closeModelHistoryRequest,
    };
  },
};
</script>

<style scoped>
.card-body p {
  margin: 0;
}

.date {
  font-weight: bold;
  color: white;
}

.cancelButton {
  color: white;
}
.frontwhite {
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

.custom-bg {
  background-color: #ffd000; /* สีเขียวอ่อน */
}
</style>
