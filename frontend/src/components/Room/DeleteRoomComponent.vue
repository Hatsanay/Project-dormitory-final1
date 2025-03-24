<template>
  <div>
    <WidgetsStatsD class="mb-4" />
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardBody>
            <CForm
              class="row g-3 needs-validation"
              novalidate
              @submit="handleSubmitRoom"
            >
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="3">
                    <CFormLabel for="roomId">รหัสห้อง</CFormLabel>
                    <CFormInput v-model="roomID" type="text" id="roomId" disabled />
                  </CCol>
                  <CCol md="9">
                    <CFormLabel for="roomStatus">สถานะห้อง</CFormLabel>
                    <CFormSelect v-model="roomStatus" id="roomStatus" required>
                      <option value="">กรุณาเลือกสถานะ</option>
                      <option
                        v-for="status in statusRoom"
                        :key="status.StaUse_ID"
                        :value="String(status.StaUse_ID)"
                      >
                        {{ status.StaUse_Name }}
                      </option>
                    </CFormSelect>
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
import { ref, onMounted, watch } from "vue";
import axios from "axios";

export default {
  name: "DeleteRoomComponent",
  props: {
    selectedRoom: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const roomID = ref(props.selectedRoom?.room_ID || "");
    const roomStatus = ref(props.selectedRoom?.stat_Name || "");
    const statusRoom = ref([]);
    const toasts = ref([]);

    watch(
      () => props.selectedRoom,
      (newRoom) => {
        roomID.value = newRoom?.room_ID || "";
        roomStatus.value = newRoom?.room_status_ID || "";
      },
      { immediate: true }
    );

    const fetchStatusRoom = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getStatusRoomDelete", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        statusRoom.value = response.data;
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    const handleSubmitRoom = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          roomID: roomID.value,
          room_status_ID: roomStatus.value,
        };

        await axios.put("/api/auth/updateRoomStatus", payload);
        toasts.value.push({
          title: "สำเร็จ",
          content: "สถานะห้องถูกอัปเดตเรียบร้อยแล้ว",
        });
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        });
        console.error("Error updating status:", error);
      }
    };

    onMounted(() => {
      fetchStatusRoom();
    });

    return {
      roomID,
      roomStatus,
      statusRoom,
      toasts,
      handleSubmitRoom,
    };
  },
};
</script>
