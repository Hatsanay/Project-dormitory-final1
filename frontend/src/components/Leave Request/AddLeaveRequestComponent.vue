<template>
    <div>
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === '2' }"
            @click.prevent="switchTab('2')"
            href="#"
          >
            <i class="fa-solid fa-calendar-plus"></i>
            ลงวันลา
          </a>
        </li>
      </ul>
  
      <div class="tab-content mt-3">
        <div v-if="activeTab === '2'" class="tab-pane active">
          <FullCalendar :options="calendarOptions" :key="leaveEvents.length" />
        </div>
      </div>
  
      <!-- Modal สำหรับลงวันลา -->
      <CModal alignment="center" :visible="visibleLeaveModal" @close="closeLeaveModal">
        <CModalHeader>
          <CModalTitle> ลงวันลา </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div class="form-group">
            <label>เลือกชื่อพนักงาน:</label>
            <CFormSelect v-model="selectedUser">
              <option value="">เลือกพนักงาน</option>
              <option v-for="user in users" :key="user.user_ID" :value="user.user_ID">
                {{ user.fullname }}
              </option>
            </CFormSelect>
          </div>
  
          <div class="form-group">
            <label>วันที่เริ่มลา:</label>
            <input type="date" v-model="startDate" class="form-control" />
          </div>
  
          <div class="form-group">
            <label>วันที่สิ้นสุดลา:</label>
            <input type="date" v-model="endDate" class="form-control" />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" @click="closeLeaveModal">ปิด</CButton>
          <CButton color="primary" @click="submitLeaveRequest">ยืนยัน</CButton>
        </CModalFooter>
      </CModal>
  
      <!-- Modal สำหรับแสดงรายละเอียดการลา -->
      <CModal alignment="center" :visible="visibleLeaveDetailModal" @close="closeLeaveDetailModal">
        <CModalHeader>
          <CModalTitle> รายละเอียดการลา </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div class="form-group">
            <label>ชื่อพนักงาน:</label>
            <p>{{ selectedLeaveDetail.fullname }}</p>
          </div>
  
          <div class="form-group">
            <label>วันที่เริ่มลา:</label>
            <p>{{ selectedLeaveDetail.start_date }}</p>
          </div>
  
          <div class="form-group">
            <label>วันที่สิ้นสุดลา:</label>
            <p>{{ selectedLeaveDetail.end_date }}</p>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" @click="cancelLeaveRequest">ยกเลิกการลา</CButton>
          <CButton color="secondary" @click="closeLeaveDetailModal">ปิด</CButton>
        </CModalFooter>
      </CModal>
    </div>
  </template>
  
 <script>
import { ref, onMounted, computed } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  CFormSelect,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
} from "@coreui/vue";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "LeaveApplication",
  components: {
    FullCalendar,
    CFormSelect,
    CButton,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CModalTitle,
  },
  setup() {
    const activeTab = ref("2");
    const visibleLeaveModal = ref(false);
    const visibleLeaveDetailModal = ref(false);
    const selectedUser = ref("");
    const startDate = ref("");
    const endDate = ref("");
    const leaveEvents = ref([]);
    const users = ref([]);
    const selectedLeaveDetail = ref({}); // เก็บรายละเอียดการลาที่เลือก

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getUserForLeaveRe", {
          headers: { Authorization: `Bearer ${token}` },
        });
        users.value = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchLeaveEvents = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("/api/auth/getLeaveRe", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Leave Data from API:", response.data); // ตรวจสอบข้อมูลจาก API

    leaveEvents.value = response.data.map((leave) => ({
  id: leave.LeaveRequest_ID,  // ✅ ตรวจสอบว่าใช้ LeaveRequest_ID ถูกต้อง
  title: leave.fullname || "ไม่มีชื่อ",
  start: leave.start_date,
  end: leave.end_date ? new Date(leave.end_date) : new Date(leave.start_date),
  backgroundColor: "#ff4444",
  borderColor: "#ff4444",
  textColor: "#fff",
}));

    console.log("Mapped Events:", leaveEvents.value); // ตรวจสอบข้อมูลหลังแปลง
  } catch (error) {
    console.error("Error fetching leave events:", error);
  }
};


    const submitLeaveRequest = async () => {
      if (!selectedUser.value || !startDate.value || !endDate.value) {
        Swal.fire({
          icon: "warning",
          title: "กรุณากรอกข้อมูลให้ครบถ้วน",
          confirmButtonText: "ตกลง",
        });
        return;
      }

      if (new Date(startDate.value) > new Date(endDate.value)) {
        Swal.fire({
          icon: "warning",
          title: "วันที่เริ่มลาต้องน้อยกว่าวันที่สิ้นสุด",
          confirmButtonText: "ตกลง",
        });
        return;
      }
      const leaveData = {
        user_id: selectedUser.value,
        startDate: startDate.value,
        endDate: endDate.value,
      };

      try {
        await axios.post("/api/auth/AddLeaveRequest", leaveData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        Swal.fire({
          icon: "success",
          title: "ลงวันลาสำเร็จ",
          confirmButtonText: "ตกลง",
        });
        closeLeaveModal();
        fetchLeaveEvents();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: error.response?.data?.error || "ไม่สามารถลงวันลาได้",
          confirmButtonText: "ตกลง",
        });
      }
    };

    const cancelLeaveRequest = async () => {
  try {
    const response = await axios.put(`/api/auth/CancelLeave`, null, {
      params: {
        leaveId: selectedLeaveDetail.value.id, 
      },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    
    Swal.fire({
      icon: "success",
      title: "ยกเลิกการลาสำเร็จ",
      confirmButtonText: "ตกลง",
    });
    closeLeaveDetailModal();
    fetchLeaveEvents();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: error.response?.data?.error || "ไม่สามารถยกเลิกการลาได้",
      confirmButtonText: "ตกลง",
    });
  }
};
    const closeLeaveModal = () => {
      visibleLeaveModal.value = false;
      selectedUser.value = "";
      startDate.value = "";
      endDate.value = "";
    };

    const closeLeaveDetailModal = () => {
      visibleLeaveDetailModal.value = false;
      selectedLeaveDetail.value = {};
    };

    const calendarOptions = computed(() => ({
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: "dayGridMonth",
      dateClick: (info) => {
        startDate.value = info.dateStr;
        endDate.value = info.dateStr;
        visibleLeaveModal.value = true;
      },
      events: leaveEvents.value,
      eventClick: (info) => {
  console.log("Clicked Event:", info.event); 

  selectedLeaveDetail.value = {
  id: info.event.id,  
  fullname: info.event.title,
  start_date: info.event.start ? new Date(info.event.start).toISOString().split("T")[0] : "ไม่ระบุ",
  end_date: info.event.end ? new Date(info.event.end).toISOString().split("T")[0] : new Date(info.event.start).toISOString().split("T")[0],
};

  visibleLeaveDetailModal.value = true;
},
      eventContent: function (arg) {
        return {
          html: `<div style="color: white; background-color: red; padding: 5px; border-radius: 5px;">${arg.event.title}</div>`,
        };
      },
    }));

    onMounted(() => {
      fetchUsers();
      fetchLeaveEvents();
    });

    return {
      activeTab,
      visibleLeaveModal,
      visibleLeaveDetailModal,
      selectedUser,
      startDate,
      endDate,
      leaveEvents,
      users,
      selectedLeaveDetail,
      calendarOptions,
      submitLeaveRequest,
      cancelLeaveRequest,
      closeLeaveModal,
      closeLeaveDetailModal,
    };
  },
};
</script>
  
  <style scoped>
  .nav-tabs .nav-link.active {
    background-color: #007bff;
    color: white;
  }
  
  .fc-event {
    cursor: pointer;
    padding: 5px;
    border-radius: 5px;
    font-size: 14px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-label {
    font-weight: bold;
  }
  
  /* สไตล์สำหรับเหตุการณ์ลา */
  .custom-leave-event {
    background-color: #ff4444;
    border-color: #ff4444;
    color: #ffffff;
  }
  .fc-daygrid-day.fc-day-today {
    background-color: #ff4444 !important;
    color: white !important;
  }
  
  .fc-daygrid-day.fc-day-today a {
    color: white !important;
    font-weight: bold;
  }
  .leave-day {
  background-color: #ff4444 !important;
  color: white !important;
}
  </style>
  