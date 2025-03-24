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
          <i class="fa-solid fa-clock"></i>
          การแจ้งซ่อมที่รอนัด
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === '3' }"
          @click.prevent="switchTab('3')"
          href="#"
        >
          <i class="fa-solid fa-clock-rotate-left"></i>
          ปฎิทินเวลาว่างของช่าง
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === '2' }"
          @click.prevent="switchTab('2')"
          href="#"
        >
          <i class="fa-solid fa-calendar-days"></i>
          นัดเวลาซ่อม
        </a>
      </li>
    </ul>

    <div class="tab-content mt-3">
      <div v-if="activeTab === '2'" class="tab-pane active">
        <CRows>
          <CFormSelect v-model="selectedClass" aria-label="Filter by Class">
            <option value="">ช่างทั้งหมด</option>
            <option
              v-for="technician in technicians"
              :key="technician.user_ID"
              :value="technician.fullname"
            >
              {{ technician.fullname }}
            </option>
          </CFormSelect>
          <br />
        </CRows>
        <CRows>
          <FullCalendar :events="events" :options="calendarOptions" ref="calendar" />
        </CRows>
      </div>

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
              <CCardHeader class="card-header-modern">
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
      <div v-if="activeTab === '3'" class="tab-pane active">
        <CRows>
          <CFormSelect
            v-model="selectedTechnicianIDTab3"
            @change="fetchTechnicianTab3"
            aria-label="เลือกช่าง"
          >
            <option value="">กรุณาเลือกช่าง</option>
            <option
              v-for="technician in technicians"
              :key="technician.user_ID"
              :value="technician.user_ID"
            >
              {{ technician.fullname }}
            </option>
          </CFormSelect>
          <br />
        </CRows>
        <CRows>
          <FullCalendar
            :events="availableTimesTab3"
            :options="availabilityCalendarOptions"
            ref="availabilityCalendarTab3"
            :key="selectedTechnicianIDTab3"
          />
        </CRows>
      </div>
    </div>

    <CModal
      alignment="center"
      :visible="visibleModelDetailRequest"
      @close="closeModelDetailRequest"
      size="xl"
      fullscren
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
        <p><strong>ผู้แจ้ง: </strong> {{ selectedUser.fullname }}</p>
        <p><strong>ห้อง:</strong> {{ selectedUser.roomNumber }}</p>
        <p><strong>หัวเรื่อง:</strong> {{ selectedUser.mainr_ProblemTitle }}</p>
        <p><strong>รายละเอียด:</strong> {{ selectedUser.mainr_ProblemDescription }}</p>
        <p><strong>ประเภท:</strong> {{ selectedUser.Type }}</p>
        <p><strong>สถานะ:</strong> {{ selectedUser.status }}</p>

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
      </CModalFooter>
    </CModal>

    <CModal
      alignment="center"
      :visible="visibleModal"
      @close="closeModal"
      size="xl"
      backdrop="static"
      class="custom-modal"
    >
      <CModalHeader class="custom-modal-header">
        <CModalTitle class="custom-modal-title">
          <i class="fa-solid fa-calendar-check"></i>
          มอบหมายงานสำหรับวันที่: {{ selectedDate }}
        </CModalTitle>
      </CModalHeader>
      <CModalBody class="custom-modal-body">
        <div class="form-group">
          <label for="repair-select" class="form-label">เลือกรายการแจ้งซ่อม:</label>
          <CFormSelect
            v-model="selectedRepair"
            aria-label="เลือกรายการแจ้งซ่อม"
            id="repair-select"
          >
            <option value="">เลือกรายการ</option>
            <option v-for="item in items" :key="item.mainr_ID" :value="item.mainr_ID">
              {{ item.mainr_ProblemTitle }} (ID: {{ item.mainr_ID }}) ห้อง:{{
                item.roomNumber
              }}
            </option>
          </CFormSelect>
        </div>

        <div class="form-group">
          <label for="technician-select" class="form-label">เลือกช่างหลัก:</label>
          <CFormSelect
            v-model="selectedTechnician"
            aria-label="เลือกช่างหลัก"
            id="technician-select"
          >
            <option value="">เลือกช่างหลัก</option>
            <option
              v-for="technician in technicians"
              :key="technician.user_ID"
              :value="technician.user_ID"
            >
              {{ technician.fullname }}
            </option>
          </CFormSelect>
        </div>

        <div class="form-group">
          <label for="assistants-select" class="form-label">เลือกผู้ช่วยช่าง:</label>
          <div class="d-flex align-items-center">
            <CFormSelect
              v-model="newAssistant"
              aria-label="เลือกผู้ช่วยช่าง"
              id="assistants-select"
            >
              <option value="">เลือกผู้ช่วย</option>
              <option
                v-for="technician in filteredAssistants"
                :key="technician.user_ID"
                :value="technician.user_ID"
              >
                {{ technician.fullname }}
              </option>
            </CFormSelect>
            <CButton @click="addAssistant" class="ml-2" :disabled="!newAssistant">
              +
            </CButton>
          </div>
          <ul class="mt-2 assistant-list">
            <li
              v-for="(assistantName, index) in assistantsWithNames"
              :key="selectedAssistants[index]"
              class="d-flex justify-content-between align-items-center"
            >
              {{ assistantName }}
              <CButton @click="removeAssistant(index)" color="danger" size="sm">
                ลบ
              </CButton>
            </li>
          </ul>
        </div>

        <div class="form-group">
          <label for="start-time" class="form-label">เลือกเวลาเริ่มต้น:</label>
          <input type="time" v-model="startTime" id="start-time" class="form-control" />
        </div>

        <div class="form-group">
          <label for="end-time" class="form-label">เลือกเวลาสิ้นสุด:</label>
          <input type="time" v-model="endTime" id="end-time" class="form-control" />
        </div>
      </CModalBody>
      <CModalFooter class="custom-modal-footer">
        <CButton color="secondary" @click="closeModal">ยกเลิก</CButton>
        <CButton color="primary" @click="assignWork">ยืนยันการมอบหมาย</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import { ref, onMounted, watchEffect, computed, watch } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
} from "@coreui/vue";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "starffTimeReq",
  components: {
    FullCalendar,
  },
  setup() {
    const activeTab = ref("1");
    const events = ref([]);
    const allEvents = ref([]);
    const selectedClass = ref("");
    const technicians = ref([]);
    const visibleModal = ref(false);
    const selectedDate = ref("");
    const selectedTechnician = ref("");
    const items = ref([]);
    const searchQuery = ref("");
    const rowsPerPage = ref(3);
    const currentPage = ref(1);
    const visibleModelDetailRequest = ref(false);
    const selectedUser = ref({});
    const imageUrls = ref([]);
    const selectedAssistants = ref([]);
    const newAssistant = ref("");

    const selectedRepair = ref("");
    const startTime = ref("");
    const endTime = ref("");
    const someValue = ref("");

    const selectedTechnicianIDTab3 = ref(""); // ตัวแปรเก็บ ID ของช่างใน Tab 3
    const availableTimesTab3 = ref([]); // ตัวแปรเก็บเวลาว่างของช่างใน Tab 3

    const calendarOptions = ref({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      editable: true,
      selectable: true,
      selectMirror: true,
      eventClassNames: () => ["custom-event"],
      eventContent: function (arg) {
        return {
          html: `<div>
               <span class="event-time">${arg.event.startStr.slice(
                 11,
                 16
               )} - ${arg.event.endStr.slice(11, 16)}</span>
               <span class="event-title">${arg.event.title}</span>
             </div>`,
        };
      },
      dateClick(info) {
        const selectedDateTime = new Date(info.dateStr);
        const currentDateTime = new Date();

        currentDateTime.setHours(0, 0, 0, 0);

        if (selectedDateTime < currentDateTime) {
          Swal.fire({
            icon: "warning",
            title: "ไม่สามารถนัดวันที่ที่ผ่านไปแล้วได้",
            text: "กรุณาเลือกวันที่ที่ถูกต้อง",
            confirmButtonText: "ตกลง",
          });
        } else {
          selectedDate.value = info.dateStr;
          visibleModal.value = true;
        }
      },
    });

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

    const fetchRequests = async () => {
      try {
        const response = await axios.get(`/api/auth/getReqwaitForShc`);
        items.value = response.data;
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    const fetchRepairSchedule = async () => {
      try {
        const response = await axios.get("/api/auth/getreqtime");
        allEvents.value = response.data.map((item) => {
          const date = item.Date;
          const formattedStartTime = `${date}T${item.startTime}`;
          const formattedEndTime = `${date}T${item.endTime}`;
          const technicians = item.technicians
            .map((tech) => `<br>ช่าง: ${tech}`)
            .join("");

          return {
            title: `${item.sdr_mainr_ID} <br> ห้อง: ${item.room} ${technicians}`,
            start: formattedStartTime,
            end: formattedEndTime,
            description: `รายละเอียดงานซ่อม ${item.sdr_mainr_ID}`,
            technicians: item.technicians,
          };
        });
        filterEvents();
      } catch (error) {
        console.error("Error fetching repair schedule:", error);
      }
    };

    const fetchtechnicians = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getMacForShc", {
          headers: { Authorization: `Bearer ${token}` },
        });
        technicians.value = response.data;
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลช่าง:", error);
      }
    };

    const filteredTechnicians = computed(() => {
      return selectedClass.value
        ? technicians.value.filter(
            (technician) => technician.user_ID === selectedClass.value
          )
        : technicians.value;
    });

    const filterEvents = () => {
      if (selectedClass.value) {
        events.value = allEvents.value.filter((event) =>
          event.technicians.includes(selectedClass.value)
        );
      } else {
        events.value = allEvents.value;
      }
    };

    const closeModal = () => {
      visibleModal.value = false;
      selectedTechnician.value = "";
    };

    const filteredAssistants = computed(() => {
      return technicians.value.filter(
        (technician) =>
          technician.user_ID !== selectedTechnician.value &&
          !selectedAssistants.value.includes(technician.user_ID)
      );
    });
    const assistantsWithNames = computed(() => {
      return selectedAssistants.value.map((assistantId) => {
        const technician = technicians.value.find((tech) => tech.user_ID === assistantId);
        return technician ? technician.fullname : assistantId;
      });
    });

    const addAssistant = () => {
      if (newAssistant.value && !selectedAssistants.value.includes(newAssistant.value)) {
        selectedAssistants.value.push(newAssistant.value);
        newAssistant.value = "";
      } else {
        Swal.fire({
          icon: "warning",
          title: "ไม่สามารถเพิ่มได้",
          text: "กรุณาเลือกผู้ช่วยช่างก่อนเพิ่ม",
          confirmButtonText: "ตกลง",
        });
      }
    };

    const removeAssistant = (index) => {
      selectedAssistants.value.splice(index, 1);
    };

    const assignWork = async () => {
      if (
        !selectedRepair.value ||
        !selectedTechnician.value ||
        !startTime.value ||
        !endTime.value
      ) {
        // แจ้งเตือนเมื่อข้อมูลไม่ครบถ้วน
        Swal.fire({
          icon: "warning",
          title: "กรุณากรอกข้อมูลให้ครบถ้วน",
          text: "โปรดระบุช่างหลักและข้อมูลที่เกี่ยวข้อง",
          confirmButtonText: "ตกลง",
        });
        return;
      }

      const assignmentData = {
        repairID: selectedRepair.value,
        technician: selectedTechnician.value,
        assistants: selectedAssistants.value,
        date: selectedDate.value,
        startTime: startTime.value,
        endTime: endTime.value,
      };

      try {
        const response = await axios.post("/api/auth/assignWork", assignmentData);
        Swal.fire({
          icon: "success",
          title: "มอบหมายงานสำเร็จ",
          text: "ข้อมูลได้ถูกบันทึกแล้ว",
          confirmButtonText: "ตกลง",
        }).then(() => {
          window.location.reload();
        });
        closeModal();
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการมอบหมายงาน:", error);
        if (error.response && error.response.data.error) {
          // แจ้งเตือนเมื่อพบการทับซ้อนของเวลานัดหมาย
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: error.response.data.error,
            confirmButtonText: "ตกลง",
          });
        } else {
          // แจ้งเตือนทั่วไปหากมีข้อผิดพลาดในการบันทึกข้อมูล
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถบันทึกข้อมูลได้",
            confirmButtonText: "ตกลง",
          });
        }
      }
    };

    const showModal = (item) => {
      selectedUser.value = item;
      fetchImages(item.mainr_ID);
      visibleModelDetailRequest.value = true;
    };

    const closeModelDetailRequest = () => {
      visibleModelDetailRequest.value = false;
      selectedUser.value = {};
      imageUrls.value = [];
    };

    const fetchImages = async (mainr_ID) => {
      try {
        const response = await axios.get(`/api/auth/getImgById?id=${mainr_ID}`);
        imageUrls.value = response.data.map((img) => img.imges_Path);
      } catch (error) {
        console.error("Error fetching images:", error);
        imageUrls.value = [];
      }
    };

    const getImageUrl = (path) => {
      // return `http://localhost:3030/uploads/${path}`; //local
      return `http://localhost:3030/uploads/${path}`; //hosting
    };

    // ฟังก์ชันดึงเวลาว่างของช่างในแท็บ 3
    const fetchTechnicianTab3 = async () => {
      if (!selectedTechnicianIDTab3.value) {
        availableTimesTab3.value = [];
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `/api/auth/getTechnicianAppointments?technicianID=${selectedTechnicianIDTab3.value}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // เก็บช่วงเวลาที่ไม่ว่าง
        const unavailableTimes = response.data.map((appointment) => ({
          start: new Date(appointment.start),
          end: new Date(appointment.end),
          color: "#dc3545", // สีแดงสำหรับเวลาที่ไม่ว่าง
          title: "ไม่ว่าง",
        }));

        const availableTimes = [];
        const today = new Date();
        const daysInWeek = 30;

        // ลูปในแต่ละวันของสัปดาห์นี้
        for (let i = 0; i < daysInWeek; i++) {
          const day = new Date(today);
          day.setDate(today.getDate() + i);

          for (let hour = 6; hour < 20; hour++) {
            const startHour = new Date(day);
            startHour.setHours(hour, 0, 0, 0);

            const endHour = new Date(day);
            endHour.setHours(hour + 1, 0, 0, 0);

            // ตรวจสอบว่าช่วงเวลานี้ไม่ว่างหรือไม่
            const isUnavailable = unavailableTimes.some(
              (unavailable) =>
                startHour >= unavailable.start && startHour < unavailable.end
            );

            if (!isUnavailable) {
              availableTimes.push({
                title: "ว่าง",
                start: startHour.toISOString(),
                end: endHour.toISOString(),
                color: "#28a745", // สีเขียวสำหรับเวลาที่ว่าง
              });
            }
          }
        }

        // รวมเวลาว่างและไม่ว่างทั้งหมดใน `availableTimesTab3`
        availableTimesTab3.value = [...unavailableTimes, ...availableTimes];
      } catch (error) {
        console.error("Error fetching availability for Tab 3:", error);
      }
    };

    watch(selectedTechnicianIDTab3, fetchTechnicianTab3);

    // การตั้งค่า FullCalendar สำหรับแท็บ 3
    const availabilityCalendarOptions = computed(() => ({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: "timeGridWeek",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      editable: false,
      selectable: false,
      events: availableTimesTab3.value,
    }));

    const switchTab = (tab) => {
      activeTab.value = tab;
    };

    watchEffect(() => {
      filterEvents();
      availabilityCalendarOptions.value = {
        ...availabilityCalendarOptions.value,
        events: availableTimesTab3.value,
      };
      calendarOptions.value.events = events.value;
    });

    onMounted(() => {
      fetchRequests();
      fetchtechnicians();
      fetchRepairSchedule();
    });

    return {
      activeTab,
      switchTab,
      events,
      calendarOptions,
      technicians,
      selectedClass,
      visibleModal,
      selectedDate,
      selectedTechnician,
      closeModal,
      assignWork,
      items,
      searchQuery,
      filteredItems,
      totalPages,
      paginatedItems,
      currentPage,
      rowsPerPage,
      showModal,
      closeModelDetailRequest,
      selectedUser,
      visibleModelDetailRequest,
      imageUrls,
      getImageUrl,
      newAssistant,
      selectedAssistants,
      addAssistant,
      removeAssistant,
      // assignWork,
      filteredAssistants,
      selectedRepair,
      startTime,
      endTime,
      assistantsWithNames,
      availabilityCalendarOptions,
      availableTimesTab3,
      selectedTechnicianIDTab3,
      fetchTechnicianTab3,
      someValue,
      technicians,
    };
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
}

.custom-event {
  background-color: #e6f7ff;
  border: 2px solid #007bff;
  border-radius: 8px;
  padding: 8px;
  margin: 4px 0;
  color: #333;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
  transition: background-color 0.3s ease;
}

.custom-event:hover {
  background-color: #cceeff;
}

.event-time {
  font-weight: bold;
  font-size: 12px;
  color: #007bff;
}

.event-title {
  font-size: 14px;
  font-weight: bold;
  margin-top: 5px;
  color: #007bff;
  white-space: pre-line;
}

.fc-event-time {
  display: none;
}

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
.custom-modal {
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  background-color: #f9f9f9;
  max-width: 800px;
  width: 100%;
}

.custom-modal-header {
  background-color: #007bff;
  color: #fff;
  padding: 20px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.custom-modal-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.custom-modal-body {
  padding: 20px;
  background-color: #fff;
  max-height: 500px;
  overflow-y: auto;
}

.custom-modal-footer {
  background-color: #f1f1f1;
  padding: 15px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  display: flex;
  justify-content: space-between;
}

.form-group {
  margin-bottom: 15px;
}

.form-label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.form-control {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ced4da;
  margin-top: 5px;
}

.assistant-list {
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
}

.assistant-list li {
  background-color: #e9ecef;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.assistant-list li:hover {
  background-color: #dee2e6;
}

.ml-2 {
  margin-left: 10px;
}
</style>
