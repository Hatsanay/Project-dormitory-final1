<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>แก้ไขข้อมูลสถานะ</CCardHeader>
          <CCardBody>
            <CForm
              class="row g-3 needs-validation"
              novalidate
              @submit="handleSubmitTypeStatus"
            >
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="2">
                    <CFormLabel for="typeStatusID">รหัสสถานะ</CFormLabel>
                    <CFormInput v-model="typeStatusID" type="text" id="typeStatusID" disabled />
                  </CCol>
                  <CCol md="6">
                    <CFormLabel for="typeStatusName">ชื่อสถานะ</CFormLabel>
                    <CFormInput
                      v-model="typeStatusName"
                      type="text"
                      id="typeStatusName"
                      required
                      :class="{ 'is-invalid': isTypeStatusInvalid }"
                    />
                    <CFormFeedback invalid>{{ typeStatusErrorMessage }}</CFormFeedback>
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
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

export default {
  name: "EditTypeStatusView",
  setup() {
    const route = useRoute();
    const typeStatusID = ref(route.query.id || ""); // Assuming typeStatus ID comes from query
    const typeStatusName = ref("");
    const toasts = ref([]);

    // Validation flags
    const isTypeStatusInvalid = computed(() => !typeStatusName.value.trim());

    // Error messages
    const typeStatusErrorMessage = "กรุณากรอกชื่อสถานะ";

    const handleSubmitTypeStatus = async (event) => {
      event.preventDefault(); // Prevent default form submission

      if (isTypeStatusInvalid.value) {
        return; // Stop if validation fails
      }

      try {
        const payload = {
          newStatName: typeStatusName.value,
        };
        await axios.put(`/api/auth/updateStatusType?ID=${typeStatusID.value}`, payload);
        toasts.value.push({
          title: "สำเร็จ",
          content: "ข้อมูลสถานะถูกบันทึกเรียบร้อยแล้ว",
        });
        setTimeout(() => {
          this.$router.push("/ViewTypeStatusView"); 
        }, 1000);
      } catch (error) {
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        });
      }
    };

    const fetchTypeStatusByID = async (id) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getStatusTypeByID", {
          params: { ID: id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const typeStatusData = response.data;
        typeStatusName.value = typeStatusData.Name || "";
      } catch (error) {
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "ไม่สามารถดึงข้อมูลสถานะได้",
        });
      }
    };

    onMounted(() => {
      fetchTypeStatusByID(typeStatusID.value);
    });

    return {
      typeStatusID,
      typeStatusName,
      toasts,
      handleSubmitTypeStatus,
      isTypeStatusInvalid,
      typeStatusErrorMessage,
    };
  },
};
</script>
