<template>
  <div>
    <WidgetsStatsD class="mb-4" />
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>จัดการหน่วย</CCardHeader>
          <CCardBody>
            <CForm class="row g-2 needs-validation" novalidate @submit="handleSubmitTooltip01">
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="2">
                    <CFormLabel for="unitID">รหัสหน่วย</CFormLabel>
                    <CFormInput v-model="autoID" type="text" id="unitID" disabled />
                  </CCol>
                  <CCol md="5">
                    <CFormLabel for="unitName">ชื่อหน่วย</CFormLabel>
                    <CFormInput
                      v-model="unitName"
                      type="text"
                      id="unitName"
                      required
                      :class="{ 'is-invalid': isUnitInvalid }"
                    />
                    <CFormFeedback invalid>
                      {{ unitErrorMessage }}
                    </CFormFeedback>
                  </CCol>
                </CRow>
                <CFormInput v-if="visable" v-model="token" type="text" id="token" />
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
  name: "UnitComponent",
  setup() {
    const autoID = ref("");
    const unitName = ref("");
    const validatedTooltip01 = ref(false);
    const toasts = ref([]);
    const unitStatus = ref("");
    const isUnitInvalid = computed(() => {
      return validatedTooltip01.value && unitName.value.trim() === "" ;
    });

    const unitErrorMessage = computed(() => {
      if (unitName.value.trim() === "") {
        return "กรุณากรอกชื่อหน่วย";
      } 
      return "";
    });

    const handleSubmitTooltip01 = (event) => {
      validatedTooltip01.value = true;

      if (isUnitInvalid.value) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        handleSubmit();
      }
    };

    const handleSubmit = async () => {
      try {
        const response = await axios.post("/api/auth/registerUnit", {
          unitName: unitName.value,
          unitStatus: unitStatus.value,
        });

        createToast("Success", response.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        let errorMessage = "เกิดข้อผิดพลาดในการลงทะเบียนหน่วย";

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
        const response = await axios.get("/api/auth/getAutotidUnit", {
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
      unitName,
      unitStatus,
      validatedTooltip01,
      handleSubmitTooltip01,
      isUnitInvalid,
      unitErrorMessage,
      toasts,
    };
  }
};
</script>
