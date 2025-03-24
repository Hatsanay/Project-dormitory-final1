<template>
  <div>
    <WidgetsStatsD class="mb-4" />
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>แก้ไขข้อมูลยูนิต</CCardHeader>
          <CCardBody>
            <CForm class="row g-3 needs-validation" novalidate @submit="handleSubmit">
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="2">
                    <CFormLabel for="unit_ID">รหัสยูนิต</CFormLabel>
                    <CFormInput v-model="unit_ID" type="text" id="unit_ID" disabled />
                  </CCol>
                  <CCol md="3" class="position-relative">
                    <CFormLabel for="unit_Name">ชื่อยูนิต</CFormLabel>
                    <CFormInput
                      v-model="unit_Name"
                      type="text"
                      id="unit_Name"
                      required
                      :class="{ 'is-invalid': isUnitNameInvalid }"
                    />
                    <CFormFeedback invalid>{{ unitErrorMessage }}</CFormFeedback>
                  </CCol>
                </CRow>
              </CCol>
              <CButton type="submit" color="primary" :disabled="isUnitNameInvalid">บันทึก</CButton>
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
import "@vuepic/vue-datepicker/dist/main.css";
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "EditUnitView",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const unit_ID = ref(route.query.id || ""); // Assuming ID comes from the query
    const unit_Name = ref("");
    const toasts = ref([]);

    const isUnitNameInvalid = computed(() => unit_Name.value.trim() === "");

    const unitErrorMessage = computed(() => {
      if (unit_Name.value.trim() === "") {
        return "กรุณากรอกชื่อยูนิต";
      }
      return "";
    });

    const handleSubmit = async (event) => {
      event.preventDefault();
      if (isUnitNameInvalid.value) return;

      try {
        const payload = { unitname: unit_Name.value };
        await axios.put(`/api/auth/updateUnit?ID=${unit_ID.value}`, payload);

        addToast("สำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
        setTimeout(() => {
          router.push("ViewUnitView");
        }, 1000);
      } catch (error) {
        addToast("ข้อผิดพลาด", "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    };


    const fetchUnitByID = async (uid) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getUnitByID", {
          params: { ID: uid },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const unitData = response.data;
        unit_Name.value = unitData.name || "";
      } catch (error) {
        console.error("Error fetching unit data:", error);
        addToast("ข้อผิดพลาด", "ไม่สามารถดึงข้อมูลยูนิตได้");
      }
    };

    // Helper function to show toast notifications
    const addToast = (title, content) => {
      toasts.value.push({ title, content });
    };

    onMounted(() => {
      fetchUnitByID(unit_ID.value);
    });

    return {
      unit_ID,
      unit_Name,
      toasts,
      handleSubmit,
      isUnitNameInvalid,
      unitErrorMessage,
    };
  },
};
</script>
