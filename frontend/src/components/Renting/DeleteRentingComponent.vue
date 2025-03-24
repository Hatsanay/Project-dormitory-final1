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
              @submit="handleSubmitRenting"
            >
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="3">
                    <CFormLabel for="renting_Id">รหัสการเช่า</CFormLabel>
                    <CFormInput v-model="renting_ID" type="text" id="renting_Id" disabled />
                  </CCol>
                  <CCol md="9">
                    <CFormLabel for="rentingStatus">สถานะการเช่า</CFormLabel>
                    <CFormSelect v-model="rentingStatus" id="rentingStatus" required>
                      <option value="">กรุณาเลือกสถานะ</option>
                      <option
                        v-for="sta in status"
                        :key="sta.staren_ID"
                        :value="String(sta.staren_ID)"
                      >
                        {{ sta.staren_name }}
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
  name: "DeleteRentingComponent",
  props: {
    selectedRenting: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const renting_ID = ref(props.selectedRenting?.renting_ID || "");
    const rentingStatus = ref(props.selectedRenting?.renting_stat_ID || "");
    const roomID = ref(props.selectedRenting?.renting_room_ID || "");
    const status = ref([]);
    const toasts = ref([]);

    watch(
      () => props.selectedRenting,
      (newRenting) => {
        renting_ID.value = newRenting?.renting_ID || "";
        rentingStatus.value = newRenting?.renting_stat_ID || "";
        roomID.value = newRenting?.renting_room_ID || "";
      },
      { immediate: true }
    );

    const fetchUnits = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getDeletableRenting", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        status.value = response.data;
      } catch (error) {
        console.error("Error fetching renting status:", error);
      }
    };

    const handleSubmitRenting = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          ID: renting_ID.value,
          statusID: rentingStatus.value,
        };

        if (rentingStatus.value === "SRT000002") {
          const roomPayload = {
            roomID: roomID.value,
          };
          await axios.put("/api/auth/updateRoomStatusCancelRenting", roomPayload);
        }
        await axios.put("/api/auth/updateStatusRenting", payload);
        toasts.value.push({
          title: "สำเร็จ",
          content: "ข้อมูลสถานะการเช่าถูกอัปเดตเรียบร้อยแล้ว",
        });
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        });
        console.error("Error updating renting status:", error);
      }
    };

    onMounted(() => {
      fetchUnits();
    });

    return {
      renting_ID,
      rentingStatus,
      roomID,
      status,
      toasts,
      handleSubmitRenting,
    };
  },
};
</script>
