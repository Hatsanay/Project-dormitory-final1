<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>แก้ไขสถานะ</CCardHeader>
          <CCardBody>
            <CForm
              class="row g-3 needs-validation"
              novalidate
              @submit="handleSubmitStatus"
            >
              <CCol md="12">
                <CRow class="mb-3">

                  <CCol md="2">
                    <CFormLabel for="statusID">รหัสสถานะ</CFormLabel>
                    <CFormInput v-model="statusID" type="text" id="statusID" disabled />
                  </CCol>

                  <CCol md="3">
                    <CFormLabel for="name">ชื่อสถานะ</CFormLabel>
                    <CFormInput
                      v-model="name"
                      type="text"
                      id="name"
                      required
                      :class="{ 'is-invalid': isStatusInvalid }"
                    />
                    <CFormFeedback invalid>{{ nameErrorMessage }}</CFormFeedback>
                  </CCol>

                  <CCol md="3">
                    <CFormLabel for="selectedStatusType">ประเภทสถานะ</CFormLabel>
                    <CFormSelect
                      v-model="selectedStatusType"
                      id="selectedStatusType"
                      required
                      :class="{ 'is-invalid': isStatusTypeInvalid }"
                    >
                      <option value="">กรุณาเลือกประเภทสถานะ</option>
                      <option
                        v-for="type in statusTypes"
                        :key="type.statTyp_ID"
                        :value="type.statTyp_ID"
                      >
                        {{ type.Name }}
                      </option>
                    </CFormSelect>
                    <CFormFeedback invalid>{{ statusTypeErrorMessage }}</CFormFeedback>
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
  name: "EditeStatusComponents", 
  setup() {
    const route = useRoute();
    const statusID = ref(route.query.id || ""); // รหัสสถานะจาก query
    const name = ref(""); // ชื่อของสถานะ
    const selectedStatusType = ref(""); // ประเภทของสถานะ
    const statusTypes = ref([]); // ตัวเลือกประเภทสถานะจาก API
    const toasts = ref([]);

    // Validation flags
    const isStatusInvalid = computed(() => !name.value.trim());
    const isStatusTypeInvalid = computed(() => !selectedStatusType.value);

    // Error messages
    const nameErrorMessage = "กรุณากรอกชื่อสถานะ";
    const statusTypeErrorMessage = "กรุณาเลือกประเภทสถานะ";

    // ฟังก์ชันบันทึกสถานะ
    const handleSubmitStatus = async (event) => {
      event.preventDefault(); // Prevent default form submission

      if (isStatusInvalid.value || isStatusTypeInvalid.value) {
        return; // Stop if validation fails
      }

      try {
        const payload = {
          newName: name.value,
          stat_StatTypID: selectedStatusType.value, // ส่งประเภทสถานะไปด้วย
        };
        await axios.put(`/api/auth/updateStatus?ID=${statusID.value}`, payload);
        toasts.value.push({
          title: "สำเร็จ",
          content: "ข้อมูลสถานะถูกบันทึกเรียบร้อยแล้ว",
        });
        setTimeout(() => {
          this.$router.push("/ViewStatusView"); 
        }, 1000);
      } catch (error) {
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        });
      }
    };

    // ดึงข้อมูลสถานะตาม ID
    const fetchStatusByID = async (id) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getStatusByID", {
          params: { ID: id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const statusData = response.data;
        name.value = statusData.stat_name || "";
        selectedStatusType.value = statusData.stat_StatTypID || ""; 
      } catch (error) {
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "ไม่สามารถดึงข้อมูลสถานะได้",
        });
      }
    };
    const fetchStatusTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getStatusType", {
          headers: { Authorization: `Bearer ${token}` },
        });
        statusTypes.value = response.data;
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลประเภทสถานะ:", error);
      }
    };

    onMounted(() => {
      fetchStatusByID(statusID.value); 
      fetchStatusTypes();
    });

    return {
      statusID,
      name,
      selectedStatusType,
      statusTypes,
      toasts,
      handleSubmitStatus,
      isStatusInvalid,
      isStatusTypeInvalid,
      nameErrorMessage,
      statusTypeErrorMessage,
    };
  },
};
</script>
