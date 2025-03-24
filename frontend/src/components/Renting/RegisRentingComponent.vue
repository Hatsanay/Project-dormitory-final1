<template>
  <div>
    <WidgetsStatsD class="mb-4" />
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>จัดการการเช่า</CCardHeader>
          <CCardBody>
            <CForm class="row g-2 needs-validation" novalidate @submit="handleSubmitTooltip01">
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="2">
                    <CFormLabel for="rentingID">รหัสการเช่า</CFormLabel>
                    <CFormInput v-model="autoID" type="text" id="rentingID" disabled />
                  </CCol>
                  <CCol md="5">
                    <CFormLabel for="userID">ชื่อผู้ใช้</CFormLabel>
                    <CFormSelect v-model="selectedUser" id="userID" required>
                      <option value="">เลือกชื่อผู้ใช้</option>
                      <option v-for="user in users" :key="user.user_ID" :value="user.user_ID">
                        {{ user.userName }}
                      </option>
                    </CFormSelect>
                    <CFormFeedback invalid>{{ userErrorMessage }}</CFormFeedback>
                  </CCol>
                  <CCol md="5">
                    <CFormLabel for="roomID">หมายเลขห้อง</CFormLabel>
                    <CFormSelect v-model="selectedRoom" id="roomID" required>
                      <option value="">เลือกหมายเลขห้อง</option>
                      <option v-for="room in rooms" :key="room.room_ID" :value="room.room_ID">
                        {{ room.room_Number }}
                      </option>
                    </CFormSelect>
                    <CFormFeedback invalid>{{ roomErrorMessage }}</CFormFeedback>
                  </CCol>
                </CRow>
              </CCol>
              <CButton type="submit" color="primary">บันทึก</CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

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
import { ref, computed, onMounted } from "vue";
import axios from "axios";

export default {
  name: "RegisRentingComponent",
  setup() {
    const autoID = ref("");
    const selectedUser = ref("");
    const selectedRoom = ref("");
    const users = ref([]);
    const rooms = ref([]);
    const validatedTooltip01 = ref(false);
    const toasts = ref([]);

    const isUserInvalid = computed(() => validatedTooltip01.value && !selectedUser.value);
    const isRoomInvalid = computed(() => validatedTooltip01.value && !selectedRoom.value);


    const userErrorMessage = computed(() => (isUserInvalid.value ? "กรุณาเลือกผู้เช่า" : ""));
    const roomErrorMessage = computed(() => (isRoomInvalid.value ? "กรุณาเลือกห้อง" : ""));

    const handleSubmitTooltip01 = (event) => {
      validatedTooltip01.value = true;

      if (isUserInvalid.value || isRoomInvalid.value) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        handleSubmit();
      }
    };

    const handleSubmit = async () => {
      try {
        const response = await axios.post("/api/auth/registerRenting", {
          renting_user_ID: selectedUser.value,
          renting_room_ID: selectedRoom.value,
        });
        const response2 = await axios.put("/api/auth/updateRoomStatusRenting", {
          roomID: selectedRoom.value,
        });
        createToast("Success", response.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        let errorMessage = "เกิดข้อผิดพลาดในการลงทะเบียนการเช่า";

        if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }

        createToast("Error", errorMessage);
        console.error("Error:", error);
      }
    };

    const createToast = (title, content) => {
      toasts.value.push({
        title: title,
        content: content,
      });

      setTimeout(() => {
        toasts.value.shift();
      }, 5000);
    };

    const fetchAutoID = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getAutoRentingID", {
          headers: { Authorization: `Bearer ${token}` },
        });
        autoID.value = response.data;
      } catch (error) {
        console.error("Error in fetching Auto ID:", error.message || error);
        createToast("Error", "เกิดข้อผิดพลาดในการดึงรหัสการเช่า");
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/auth/getUserForRenting");
        users.value = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
        createToast("Error", "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้");
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await axios.get("/api/auth/getRoomForRenting");
        rooms.value = response.data;
      } catch (error) {
        console.error("Error fetching rooms:", error);
        createToast("Error", "เกิดข้อผิดพลาดในการดึงข้อมูลห้อง");
      }
    };

    onMounted(() => {
      fetchAutoID();
      fetchUsers();
      fetchRooms();
    });

    return {
      autoID,
      selectedUser,
      selectedRoom,
      users,
      rooms,
      validatedTooltip01,
      handleSubmitTooltip01,
      isUserInvalid,
      isRoomInvalid,
      toasts,
      userErrorMessage,
      roomErrorMessage
    };
  },
};
</script>
