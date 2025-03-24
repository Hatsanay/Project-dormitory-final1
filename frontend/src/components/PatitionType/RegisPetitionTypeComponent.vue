<template>
  <div>
    <WidgetsStatsD class="mb-4" />
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>จัดการประเภทคำร้อง</CCardHeader>
          <CCardBody>
            <CForm class="row g-2 needs-validation" novalidate @submit="handleSubmitTooltip01">
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="2">
                    <CFormLabel for="petitionTypeID">รหัสประเภทคำร้อง</CFormLabel>
                    <CFormInput v-model="autoID" type="text" id="petitionTypeID" disabled />
                  </CCol>
                  <CCol md="5">
                    <CFormLabel for="petitionTypeName">ชื่อประเภทคำร้อง</CFormLabel>
                    <CFormInput
                      v-model="petitionTypeName"
                      type="text"
                      id="petitionTypeName"
                      required
                      :class="{ 'is-invalid': isPetitionTypeInvalid }"
                    />
                    <CFormFeedback invalid>
                      {{ petitionTypeErrorMessage }}
                    </CFormFeedback>
                  </CCol>
                </CRow>
                <CFormInput v-if="visible" v-model="token" type="text" id="token" />
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
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  name: "PetitionTypeComponent",
  setup() {
    const autoID = ref("");
    const petitionTypeName = ref("");
    const validatedTooltip01 = ref(false);
    const toasts = ref([]);
    const petitionTypeStatus = ref("");
    const isPetitionTypeInvalid = computed(() => {
      return validatedTooltip01.value && (petitionTypeName.value.trim() === "" || !/^[\u0E00-\u0E7F\s]+$/.test(petitionTypeName.value));
    });

    const petitionTypeErrorMessage = computed(() => {
      if (petitionTypeName.value.trim() === "") {
        return "กรุณากรอกชื่อประเภทคำร้อง";
      } 
      return "";
    });

    const handleSubmitTooltip01 = (event) => {
      validatedTooltip01.value = true;

      if (isPetitionTypeInvalid.value) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        handleSubmit();
      }
    };

    const handleSubmit = async () => {
      try {
        const response = await axios.post("/api/auth/registerPetitionType", {
          petitionTypeName: petitionTypeName.value,
        });

        createToast("Success", response.data.message);

        // Delay 1 second before refreshing the page
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        let errorMessage = "เกิดข้อผิดพลาดในการลงทะเบียนประเภทคำร้อง";

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
        const response = await axios.get("/api/auth/getAutotidPetitionType", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        autoID.value = response.data;
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          console.error("Error:", error.response.data.error);
          createToast("ดึงข้อมูล ID เกิดข้อผิดพลาด:", error.response.data.error);
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
      petitionTypeName,
      petitionTypeStatus,
      validatedTooltip01,
      handleSubmitTooltip01,
      isPetitionTypeInvalid,
      petitionTypeErrorMessage,
      toasts,
    };
  }
};
</script>
