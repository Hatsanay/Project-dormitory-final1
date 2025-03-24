<template>
  <div>
    <WidgetsStatsD class="mb-4" />
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>แก้ไขข้อมูลประเภทคำร้อง</CCardHeader>
          <CCardBody>
            <CForm class="row g-3 needs-validation" novalidate @submit="handleSubmit">
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="2">
                    <CFormLabel for="petitionType_ID">รหัสประเภทคำร้อง</CFormLabel>
                    <CFormInput v-model="petitionType_ID" type="text" id="petitionType_ID" disabled />
                  </CCol>
                  <CCol md="3" class="position-relative">
                    <CFormLabel for="petitionType_Name">ชื่อประเภทคำร้อง</CFormLabel>
                    <CFormInput
                      v-model="petitionType_Name"
                      type="text"
                      id="petitionType_Name"
                      required
                      :class="{ 'is-invalid': isPetitionTypeNameInvalid }"
                    />
                    <CFormFeedback invalid>{{ petitionTypeErrorMessage }}</CFormFeedback>
                  </CCol>
                </CRow>
              </CCol>
              <CButton type="submit" color="primary" :disabled="isPetitionTypeNameInvalid">บันทึก</CButton>
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
  name: "EditePetitionTypeComponents",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const petitionType_ID = ref(route.query.id || ""); 
    const petitionType_Name = ref("");
    const toasts = ref([]);

    const isPetitionTypeNameInvalid = computed(() => petitionType_Name.value.trim() === "");

    const petitionTypeErrorMessage = computed(() => {
      if (petitionType_Name.value.trim() === "") {
        return "กรุณากรอกชื่อประเภทคำร้อง";
      }
      return "";
    });

    const handleSubmit = async (event) => {
      event.preventDefault();
      if (isPetitionTypeNameInvalid.value) return;
      try {
        const payload = { petitionTypeName: petitionType_Name.value};
        await axios.put(`/api/auth/updatePetitionType?ID=${petitionType_ID.value}`, payload);
        addToast("สำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
        setTimeout(() => {
          router.push("ViewPetitionTypeView");
        }, 1000);
      } catch (error) {
        addToast("ข้อผิดพลาด", "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    };

    const fetchPetitionTypeByID = async (pid) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getPetitionTypeByID", {
          params: { ID: pid },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const petitionTypeData = response.data;
        petitionType_Name.value = petitionTypeData.Type || "";
      } catch (error) {
        console.error("Error fetching petition type data:", error);
        addToast("ข้อผิดพลาด", "ไม่สามารถดึงข้อมูลประเภทคำร้องได้");
      }
    };

    // Helper function to show toast notifications
    const addToast = (title, content) => {
      toasts.value.push({ title, content });
    };

    onMounted(() => {
      fetchPetitionTypeByID(petitionType_ID.value);
    });

    return {
      petitionType_ID,
      petitionType_Name,
      toasts,
      handleSubmit,
      isPetitionTypeNameInvalid,
      petitionTypeErrorMessage,
    };
  },
};
</script>
