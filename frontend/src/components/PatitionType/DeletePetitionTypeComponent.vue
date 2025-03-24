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
              @submit="handleSubmitPetition"
            >
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="3">
                    <CFormLabel for="petition_Id">รหัสคำร้อง</CFormLabel>
                    <CFormInput v-model="petition_ID" type="text" id="petition_Id" disabled />
                  </CCol>
                  <CCol md="9">
                    <CFormLabel for="petitionType">สถานะประเภทคำร้อง</CFormLabel>
                    <CFormSelect v-model="petitionType" id="petitionType" required>
                      <option value="">กรุณาเลือกสถานะประเภทคำร้อง</option>
                      <option
                        v-for="type in petitionTypes"
                        :key="type.stat_ID"
                        :value="String(type.stat_ID)"
                      >
                        {{ type.stat_Name }}
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
  name: "DeletePetitionTypeComponent",
  props: {
    selectedPetitionType: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const petition_ID = ref(props.selectedPetitionType?.ID || "");
    const petitionType = ref(props.selectedPetitionType?.petitionType_stat_ID || "");
    const petitionTypes = ref([]);
    const toasts = ref([]);

    watch(
      () => props.selectedPetitionType,
      (newPetition) => {
        petition_ID.value = newPetition?.ID || "";
        petitionType.value = newPetition?.petitionType_stat_ID || "";
      },
      { immediate: true }
    );

    const fetchPetitionTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getDeletablePetitionTypes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        petitionTypes.value = response.data;
      } catch (error) {
        console.error("Error fetching petition types:", error);
      }
    };

    const handleSubmitPetition = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          ID: petition_ID.value,
          statusID: petitionType.value,
        };
        await axios.put("/api/auth/updateStatusPetitionType", payload);
        toasts.value.push({
          title: "สำเร็จ",
          content: "ข้อมูลคำร้องถูกอัปเดตเรียบร้อยแล้ว",
        });
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        });
        console.error("Error updating petition:", error);
      }
    };

    onMounted(() => {
      fetchPetitionTypes();
    });

    return {
      petition_ID,
      petitionType,
      petitionTypes,
      toasts,
      handleSubmitPetition,
    };
  },
};
</script>
