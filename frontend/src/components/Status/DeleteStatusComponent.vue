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
              @submit="handleSubmitStatus"
            >
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="3">
                    <CFormLabel for="stat_Id">รหัสรายการ</CFormLabel>
                    <CFormInput v-model="stat_ID" type="text" id="stat_Id" disabled />
                  </CCol>
                  <CCol md="9">
                    <CFormLabel for="statusName">สถานะรายการ</CFormLabel>
                    <CFormSelect v-model="statusName" id="statusName" required>
                      <option value="">กรุณาเลือกสถานะ</option>
                      <option
                        v-for="status in statuses"
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
  name: "DeleteStatusComponent",
  props: {
    selectedStatus: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const stat_ID = ref(props.selectedStatus?.stat_ID || "");
    const statusName = ref(props.selectedStatus?.stat || "");
    const statuses = ref([]);
    const toasts = ref([]);

    watch(
      () => props.selectedStatus,
      (newstat) => {
        stat_ID.value = newstat?.stat_ID || "";
        statusName.value = newstat?.stat_stat_ID || "";
      },
      { immediate: true }
    );

    const fetchStatuses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getDeletableStatus", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        statuses.value = response.data;
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    const handleSubmitStatus = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          ID: stat_ID.value,
          statusID: statusName.value,
        };

        await axios.put("/api/auth/updateStatusSta", payload);
        toasts.value.push({
          title: "สำเร็จ",
          content: "สถานะรายการถูกอัปเดตเรียบร้อยแล้ว",
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
      fetchStatuses();
    });

    return {
      stat_ID,
      statusName,
      statuses,
      toasts,
      handleSubmitStatus,
    };
  },
};
</script>
