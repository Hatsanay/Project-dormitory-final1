<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>แก้ไขข้อมูลประเภทสต็อก</CCardHeader>
          <CCardBody>
            <CForm
              class="row g-3 needs-validation"
              novalidate
              @submit="handleSubmitTypeStock"
            >
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="2">
                    <CFormLabel for="typeStockID">รหัสประเภทสต็อก</CFormLabel>
                    <CFormInput v-model="typeStockID" type="text" id="typeStockID" disabled />
                  </CCol>
                  <CCol md="6">
                    <CFormLabel for="typeStockName">ชื่อประเภทสต็อก</CFormLabel>
                    <CFormInput
                      v-model="typeStockName"
                      type="text"
                      id="typeStockName"
                      required
                      :class="{ 'is-invalid': isTypeStockInvalid }"
                    />
                    <CFormFeedback invalid>{{ typeStockErrorMessage }}</CFormFeedback>
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
  name: "EditTypeStockView",
  setup() {
    const route = useRoute();
    const typeStockID = ref(route.query.id || ""); // Assuming typeStock ID comes from query
    const typeStockName = ref("");
    const toasts = ref([]);

    // Validation flags
    const isTypeStockInvalid = computed(() => !typeStockName.value.trim());

    // Error messages
    const typeStockErrorMessage = "กรุณากรอกชื่อประเภทสต็อก";

    const handleSubmitTypeStock = async (event) => {
      event.preventDefault(); // Prevent default form submission

      if (isTypeStockInvalid.value) {
        return; // Stop if validation fails
      }

      try {
        const payload = {
          newName: typeStockName.value,
        };
        await axios.put(`/api/auth/updateTypeStock?ID=${typeStockID.value}`, payload);
        toasts.value.push({
          title: "สำเร็จ",
          content: "ข้อมูลประเภทสต็อกถูกบันทึกเรียบร้อยแล้ว",
        });
        setTimeout(() => {
          this.$router.push("/ViewTypeStockView"); 
        }, 1000);
      } catch (error) {
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        });
      }
    };

    const fetchTypeStockByID = async (id) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getTypeStockByID", {
          params: { ID: id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const typeStockData = response.data;
        typeStockName.value = typeStockData.name || "";
      } catch (error) {
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "ไม่สามารถดึงข้อมูลประเภทสต็อกได้",
        });
      }
    };

    onMounted(() => {
      fetchTypeStockByID(typeStockID.value);
    });

    return {
      typeStockID,
      typeStockName,
      toasts,
      handleSubmitTypeStock,
      isTypeStockInvalid,
      typeStockErrorMessage,
    };
  },
};
</script>
