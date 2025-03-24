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
              @submit="handleSubmitTypeStatus"
            >
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="3">
                    <CFormLabel for="typeStatus_Id">รหัสประเภทวัสดุ</CFormLabel>
                    <CFormInput v-model="typeStatus_ID" type="text" id="typeStatus_Id" disabled />
                  </CCol>
                  <CCol md="9">
                    <CFormLabel for="typeStatusName">สถานะรายการ</CFormLabel>
                    <CFormSelect v-model="typeStatusName" id="typeStatusName" required>
                      <option value="">กรุณาเลือกสถานะ</option>
                      <option
                        v-for="typeStatus in typeStatuss"
                        :key="typeStatus.stat_ID"
                        :value="String(typeStatus.stat_ID)"
                      >
                        {{ typeStatus.stat_Name }}
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

    <!--Notifications -->
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
  name: "DeleteTypeStatusComponent",
  props: {
    selectedTypeStatus: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const typeStatus_ID = ref(props.selectedTypeStatus?.statTyp_ID || "");
    const typeStatusName = ref(props.selectedTypeStatus?.statTyp_stat_ID || "");
    const typeStatuss = ref([]);
    const toasts = ref([]);

    watch(
      () => props.selectedTypeStatus,
      (newTypeStatus) => {
        typeStatus_ID.value = newTypeStatus?.statTyp_ID || "";
        typeStatusName.value = newTypeStatus?.statTyp_stat_ID || "";
      },
      { immediate: true }
    );

    const fetchTypeStatuss = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getDeletableTypeStatus", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        typeStatuss.value = response.data;
      } catch (error) {
        console.error("Error fetching typeStatuss:", error);
      }
    };
    
    const handleSubmitTypeStatus = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          statTyp_ID: typeStatus_ID.value,
          statTyp_stat_ID: typeStatusName.value,
        };

        await axios.put("/api/auth/updateStatusTypeStatus", payload);
        toasts.value.push({
          title: "สำเร็จ",
          content: "ข้อมูลประเภทวัสดุถูกอัปเดตเรียบร้อยแล้ว",
        });
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        });
        console.error("Error updating typeStatus:", error);
      }
    };

    onMounted(() => {
      fetchTypeStatuss();
    });

    return {
      typeStatus_ID,
      typeStatusName,
      typeStatuss,
      toasts,
      handleSubmitTypeStatus,
    };
  },
};
</script>
