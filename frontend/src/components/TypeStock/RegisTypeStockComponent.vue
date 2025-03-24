<template>
  <div>
    <WidgetsStatsD class="mb-4" />
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>เพิ่มข้อมูลประเภทสต็อก</CCardHeader>
          <CCardBody>
            <CForm class="row g-2 needs-validation" novalidate @submit="handleSubmitTooltip01">
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="2">
                    <CFormLabel for="autoID">รหัสประเภทสต็อก</CFormLabel>
                    <CFormInput v-model="autoID" type="text" id="autoID" disabled />
                  </CCol>
                  <CCol md="3">
                    <CFormLabel for="typestockname">ชื่อประเภท</CFormLabel>
                    <CFormInput
                      v-model="typestockname"
                      type="text"
                      id="typestockname"
                      required
                      :class="{ 'is-invalid': isStockInvalid }"
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
  name: "RegisTypeStockComponent",
  
  setup() {
    const autoID = ref("");
    const typestockname = ref("");
    const validatedTooltip01 = ref(false);
    const toasts = ref([]);

    // Stock type name validation
    const isStockInvalid = computed(() => {
      return validatedTooltip01.value && typestockname.value.trim() === "";
    });

    const nameErrorMessage = computed(() => {
      if (typestockname.value.trim() === "") {
        return "กรุณากรอกชื่อประเภทวัสดุ"; // "Please enter material type name"
      }
      return "";
    });

    const handleSubmitTooltip01 = (event) => {
      validatedTooltip01.value = true;

      // Prevent submission if input is invalid
      if (isStockInvalid.value) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        handleSubmit();
      }
    };

    const handleSubmit = async () => {
      try {
        const response = await axios.post("/api/auth/registerTypeStock", {
          name: typestockname.value,
        });

        createToast("Success", response.data.message);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        let errorMessage = "เกิดข้อผิดพลาดในการลงทะเบียนประเภทวัสดุ"; // "Error registering material type"

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
        const response = await axios.get("/api/auth/getAutotidTypeStock", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        autoID.value = response.data;
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          console.error("Error:", error.response.data.error);
          createToast("ดึงข้อมูล ID เกิดข้อผิดพลาด:", error.response.data.error); // "Error fetching ID data:"
        } else {
          console.error("Error in fetching Auto ID:", error.message || error);
        }
      }
    };

    onMounted(() => {
      fetchAutoID();
    });

    return {
      autoID,
      typestockname,
      validatedTooltip01,
      handleSubmitTooltip01,
      isStockInvalid,
      nameErrorMessage,
      toasts,
    };
  },
};
</script>
