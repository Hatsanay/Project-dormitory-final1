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
              @submit="handleSubmitUnit"
            >
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="3">
                    <CFormLabel for="unit_Id">รหัสหน่วย</CFormLabel>
                    <CFormInput v-model="unit_ID" type="text" id="unit_Id" disabled />
                  </CCol>
                  <CCol md="9">
                    <CFormLabel for="unitStatus">สถานะหน่วย</CFormLabel>
                    <CFormSelect v-model="unitStatus" id="unitStatus" required>
                      <option value="">กรุณาเลือกสถานะ</option>
                      <option
                        v-for="sta in status"
                        :key="sta.StaUse_ID"
                        :value="String(sta.StaUse_ID)"
                      >
                        {{ sta.StaUse_Name }}
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
  name: "DeleteUnitComponent",
  props: {
    selectedUnit: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const unit_ID = ref(props.selectedUnit?.ID || "");
    const unitStatus = ref(props.selectedUnit?.status || "");
    const status = ref([]);
    const toasts = ref([]);

    watch(
      () => props.selectedUnit,
      (newUnit) => {
        unit_ID.value = newUnit?.ID || "";
        unitStatus.value = newUnit?.status || "";
      },
      { immediate: true }
    );

    const fetchUnits = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getDeletableUnits", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        status.value = response.data;
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };
    const handleSubmitUnit = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          ID: unit_ID.value,
          statusID: unitStatus.value,
        };
        await axios.put("/api/auth/updateStatusUnit", payload);
        toasts.value.push({
          title: "สำเร็จ",
          content: "ข้อมูลหน่วยถูกอัปเดตเรียบร้อยแล้ว",
        });
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        });
        console.error("Error updating unit:", error);
      }
    };

    onMounted(() => {
      fetchUnits();
    });

    return {
      unit_ID,
      unitStatus,
      status,
      toasts,
      handleSubmitUnit,
    };
  },
};
</script>
