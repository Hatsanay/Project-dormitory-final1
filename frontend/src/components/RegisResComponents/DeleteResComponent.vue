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
              @submit="handleSubmitTooltip01"
            >
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="3">
                    <CFormLabel for="resId">รหัส</CFormLabel>
                    <CFormInput v-model="autoID" type="text" id="resId" disabled />
                  </CCol>
                  <CCol md="9">
                    <CFormLabel for="resStatus">สถานะ</CFormLabel>
                    <CFormSelect v-model="resStatus" id="resStatus" required>
                      <option value="">กรุณาเลือกสถานะ</option>
                      <option
                        v-for="status in statusUser"
                        :key="status.stat_ID"
                        :value="String(status.stat_ID)"
                      >
                        {{ status.stat_Name }}
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
  name: "DeleteResComponent",
  props: {
    selectedUser: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const autoID = ref(props.selectedUser?.user_ID || "");
    const resStatus = ref(props.selectedUser?.user_Status_ID || "");
    const statusUser = ref([]);
    const toasts = ref([]);

    watch(
      () => props.selectedUser,
      (newUser) => {
        autoID.value = newUser?.user_ID || "";
        resStatus.value = newUser?.user_Status_ID || "";
      },
      { immediate: true }
    );

    const fetchStatusUserDelete = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getStatusUserDelete", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        statusUser.value = response.data;
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    const handleSubmitTooltip01 = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          userID: autoID.value,
          userStatus_ID: resStatus.value,
        };

        await axios.put("/api/auth/updateUserStatus", payload);
        toasts.value.push({
          title: "สำเร็จ",
          content: "สถานะถูกอัปเดตเรียบร้อยแล้ว",
        });
      } catch (error) {
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        });
        console.error("Error updating status:", error);
      }
    };

    onMounted(() => {
      fetchStatusUserDelete();
    });

    return {
      autoID,
      resStatus,
      statusUser,
      toasts,
      handleSubmitTooltip01,
    };
  },
};
</script>
