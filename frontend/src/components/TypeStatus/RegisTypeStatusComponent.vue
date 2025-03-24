<template>
  <div>
    <WidgetsStatsD class="mb-4" />
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>เพิ่มข้อมูลประเภทสถานะ</CCardHeader>
          <CCardBody>
            <CForm class="row g-2 needs-validation" novalidate @submit.prevent="handleSubmitTooltip01">
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="2">
                    <CFormLabel for="autoID">รหัสประเภทสถานะ</CFormLabel>
                    <CFormInput v-model="autoID" type="text" id="autoID" disabled />
                  </CCol>
                  <CCol md="3">
                    <CFormLabel for="typestatusname">ชื่อประเภท</CFormLabel>
                    <CFormInput
                      v-model="typestatusname"
                      type="text"
                      id="typestatusname"
                      required
                      :class="{ 'is-invalid': isStatusInvalid }"
                    />
                    <CFormFeedback invalid>
                      {{ nameErrorMessage }}
                    </CFormFeedback>
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
  name: "RegisTypeStatusComponent",

  setup() {
    const autoID = ref("");
    const typestatusname = ref("");
    const validatedTooltip01 = ref(false);
    const toasts = ref([]);

    // Computed property to check if the status name input is invalid
    const isStatusInvalid = computed(() => {
      return validatedTooltip01.value && typestatusname.value.trim() === "";
    });

    const nameErrorMessage = computed(() => {
      return typestatusname.value.trim() === "" ? "กรุณากรอกชื่อประเภทสถานะ" : "";
    });

    // Form submission with validation check
    const handleSubmitTooltip01 = () => {
      validatedTooltip01.value = true;

      if (isStatusInvalid.value) {
        return; // Stop form submission if input is invalid
      }

      handleSubmit(); // Call submit function if valid
    };

    // Function to handle the form submission
    const handleSubmit = async () => {
      try {
        const response = await axios.post("/api/auth/registerStatusType", {
          stat_Name: typestatusname.value,
        });

        createToast("Success", response.data.message);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        let errorMessage = "เกิดข้อผิดพลาดในการลงทะเบียนประเภทสถานะ"; // Default error message

        if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }

        createToast("Error", errorMessage);
        console.error("Error:", error);
      }
    };

    // Function to create and manage toast notifications
    const createToast = (title, content) => {
      toasts.value.push({ title, content });
      setTimeout(() => toasts.value.shift(), 5000); // Auto-remove after 5 seconds
    };

    // Fetch the auto-generated ID for the status type
    const fetchAutoID = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getAutotidStatusType", {
          headers: { Authorization: `Bearer ${token}` },
        });
        autoID.value = response.data;
      } catch (error) {
        let errorMessage = "Error in fetching Auto ID";
        if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
        console.error("Error:", error);
        createToast("Error", errorMessage);
      }
    };

    // Fetch the auto ID when the component is mounted
    onMounted(fetchAutoID);

    return {
      autoID,
      typestatusname,
      validatedTooltip01,
      handleSubmitTooltip01,
      isStatusInvalid,
      nameErrorMessage,
      toasts,
    };
  },
};
</script>
