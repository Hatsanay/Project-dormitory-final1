<template>
  <div>
    <WidgetsStatsD class="mb-4" />
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>เพิ่มข้อมูลสถานะ</CCardHeader>
          <CCardBody>
            <CForm class="row g-2 needs-validation" novalidate @submit="handleSubmitTooltip">
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="2">
                    <CFormLabel for="autoID">รหัสสถานะ</CFormLabel>
                    <CFormInput v-model="autoID" type="text" id="autoID" disabled />
                  </CCol>
                  <CCol md="3">
                    <CFormLabel for="statusname">ชื่อสถานะ</CFormLabel>
                    <CFormInput
                      v-model="statusname"
                      type="text"
                      id="statusname"
                      required
                      :class="{ 'is-invalid': isStatusInvalid }" />
                    <CFormFeedback invalid>{{ nameErrorMessage }}</CFormFeedback>
                  </CCol>
                  <CCol md="3">
                    <CFormLabel for="selectedType">ประเภทสถานะ</CFormLabel>
                    <CFormSelect v-model="selectedType" id="selectedType" required :class="{ 'is-invalid': isTypeInvalid }">
                      <option value="">กรุณาเลือกประเภทสถานะ</option>
                      <option v-for="type in types" :key="type.statTyp_ID" :value="type.statTyp_ID">{{ type.Name }}</option>
                    </CFormSelect>
                    <CFormFeedback invalid>{{ typeErrorMessage }}</CFormFeedback>
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
  name: "RegisStatusComponent",
  setup() {
    const autoID = ref("");
    const statusname = ref("");
    const description = ref("");
    const selectedType = ref("");
    const toasts = ref([]);
    const types = ref([]);
    const validatedTooltip = ref(false);

    // Validation Computed Properties
    const isStatusInvalid = computed(() => validatedTooltip.value && !statusname.value);
    const isTypeInvalid = computed(() => validatedTooltip.value && !selectedType.value);

    // Error Messages
    const nameErrorMessage = computed(() => (isStatusInvalid.value ? "กรุณากรอกชื่อสถานะ" : ""));
    const typeErrorMessage = computed(() => (isTypeInvalid.value ? "กรุณาเลือกประเภทสถานะ" : ""));

    // Handle Form Submission
    const handleSubmitTooltip = (event) => {
      validatedTooltip.value = true;
      if (isStatusInvalid.value || isTypeInvalid.value) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        handleSubmit();
      }
    };

    // API Submit Function
    const handleSubmit = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post("/api/auth/registerStatus", {
          stat_Name: statusname.value,
          stat_StatTypID: selectedType.value,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        createToast("Success", response.data.message);
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        createToast("Error", error.response?.data?.error || "เกิดข้อผิดพลาดในการลงทะเบียนสถานะ");
        console.error("Error:", error);
      }
    };

    // Toast Notifications
    const createToast = (title, content) => {
      toasts.value.push({ title, content });
      setTimeout(() => toasts.value.shift(), 5000);
    };

    // Fetch Data Functions
    const fetchAutoID = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getAutotidSta", {
          headers: { Authorization: `Bearer ${token}` },
        });
        autoID.value = response.data;
      } catch (error) {
        createToast("Error", error.response?.data?.error || "เกิดข้อผิดพลาดในการดึงข้อมูล ID");
      }
    };

    const fetchStatusTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getStatusType", {
          headers: { Authorization: `Bearer ${token}` },
        });
        types.value = response.data;
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลประเภทสถานะ:", error);
      }
    };

    onMounted(() => {
      fetchAutoID();
      fetchStatusTypes();
    });

    return {
      autoID,
      statusname,
      description,
      selectedType,
      handleSubmitTooltip,
      isStatusInvalid,
      nameErrorMessage,
      isTypeInvalid,
      typeErrorMessage,
      toasts,
      types,
    };
  },
};
</script>
