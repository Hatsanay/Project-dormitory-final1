<template>
  <div>
    <WidgetsStatsD class="mb-4" />
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>ข้อมูลห้องพัก</CCardHeader>
          <CCardBody>
            <CForm class="row g-3 needs-validation" novalidate>
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="3">
                    <CFormLabel for="room_ID">รหัสห้อง</CFormLabel>
                    <CFormInput v-model="room_ID" type="text" id="room_ID" disabled />
                  </CCol>
                  <CCol md="3">
                    <CFormLabel for="floor">ชั้น</CFormLabel>
                    <CFormInput v-model="floor" type="text" id="floor" disabled />
                  </CCol>
                  <CCol md="5" class="position-relative">
                    <CFormLabel for="room_Name">ชื่อห้อง</CFormLabel>
                    <CFormInput
                      v-model="room_Name"
                      type="text"
                      id="room_Name"
                      required
                      :class="{ 'is-invalid': isRoomNameInvalid }"
                      disabled
                    />
                    <CFormFeedback invalid>{{ roomErrorMessage }}</CFormFeedback>
                  </CCol>
                </CRow>
                <CRow class="mb-3">
                  <CCol md="3">
                    <CFormLabel for="statroom">สถานะห้อง</CFormLabel>
                    <CFormInput v-model="statroom" type="text" id="statroom" disabled />
                  </CCol>
                  <CCol md="3">
                    <CFormLabel for="status">สถานะ</CFormLabel>
                    <CFormInput v-model="status" type="text" id="status" disabled />
                  </CCol>
                </CRow>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Notifications -->
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
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

export default {
  name: "ModelViewRoomComponents",
  props: {
    selectedRoom: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const room_ID = ref(props.selectedRoom?.room_ID || "");
    const room_Name = ref(props.selectedRoom?.room || "");
    const floor = ref(props.selectedRoom?.floor_name || "");
    const type = ref(props.selectedRoom?.roomType_name || "");
    const statroom = ref(props.selectedRoom?.room_stat_Name || "");
    const status = ref(props.selectedRoom?.room_status_Name || "");
    const Air = ref(props.selectedRoom?.BrandModel || "");
    const room_Type = ref(props.selectedRoom?.room_Type || "");
    const toasts = ref([]);

    const isRoomNameInvalid = computed(() => room_Name.value.trim() === "");
    const roomErrorMessage = computed(() => {
      return room_Name.value.trim() === "" ? "กรุณากรอกชื่อห้อง" : "";
    });

    const fetchRoomByID = async (rid) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getRoomByNumber", {
          params: { ID: rid },
          headers: { Authorization: `Bearer ${token}` },
        });
        const roomData = response.data;
        room_ID.value = roomData.room_ID || "";
        room_Name.value = roomData.room || "";
        floor.value = roomData.floor_name || "";
        type.value = roomData.roomType_name || "";
        statroom.value = roomData.room_stat_Name || "";
        status.value = roomData.room_status_Name || "";
        Air.value = roomData.BrandModel || "";
      } catch (error) {
        console.error("Error fetching room data:", error);
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "ไม่สามารถดึงข้อมูลห้องได้",
        });
      }
    };

    onMounted(() => {
      fetchRoomByID(room_ID.value);
    });

    watch(
      () => props.selectedRoom,
      (newRoom) => {
        room_ID.value = newRoom?.room_ID || "";
        room_Name.value = newRoom?.room || "";
        floor.value = newRoom?.floor_name || "";
        type.value = newRoom?.roomType_name || "";
        statroom.value = newRoom?.room_stat_Name || "";
        status.value = newRoom?.room_status_Name || "";
        Air.value = newRoom?.BrandModel || "";
        room_Type.value = newRoom?.room_Type || "";
      },
      { immediate: true }
    );

    return {
      room_ID,
      room_Name,
      floor,
      type,
      statroom,
      status,
      Air,
      toasts,
      isRoomNameInvalid,
      roomErrorMessage,
      room_Type
    };
  },
};
</script>
