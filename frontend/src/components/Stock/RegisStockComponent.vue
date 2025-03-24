<template>
  <div>
    <WidgetsStatsD class="mb-4" />
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>เพิ่มข้อมูลสต็อก</CCardHeader>
          <CCardBody>
            <CForm class="row g-2 needs-validation" novalidate @submit="handleSubmitTooltip">
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="2">
                    <CFormLabel for="autoID">รหัสสต็อก</CFormLabel>
                    <CFormInput v-model="autoID" type="text" id="autoID" disabled />
                  </CCol>
                  <CCol md="3">
                    <CFormLabel for="stockname">ชื่อวัสดุ</CFormLabel>
                    <CFormInput
                      v-model="stockname"
                      type="text"
                      id="stockname"
                      required
                      :class="{ 'is-invalid': isStockInvalid }"
                    />
                    <CFormFeedback invalid>{{ nameErrorMessage }}</CFormFeedback>
                  </CCol>
                  <CCol md="1">
                    <CFormLabel for="quantity">จำนวน</CFormLabel>
                    <CFormInput
                      v-model="quantity"
                      type="number"
                      id="quantity"
                      required
                      :class="{ 'is-invalid': isQuantityInvalid }"
                    />
                    <CFormFeedback invalid>{{ quantityErrorMessage }}</CFormFeedback>
                  </CCol>
                  <CCol md="3">
                    <CFormLabel for="selectedType">ประเภท</CFormLabel>
                    <CFormSelect v-model="selectedType" id="selectedType" required :class="{ 'is-invalid': isTypeInvalid }">
                      <option value="">กรุณาเลือกประเภท</option>
                      <option v-for="type in types" :key="type.ID" :value="type.ID">{{ type.name }}</option>
                    </CFormSelect>
                    <CFormFeedback invalid>{{ typeErrorMessage }}</CFormFeedback>
                  </CCol>
                  <CCol md="3">
                    <CFormLabel for="selectedUnit">หน่วย</CFormLabel>
                    <CFormSelect v-model="selectedUnit" id="selectedUnit" required :class="{ 'is-invalid': isUnitInvalid }">
                      <option value="">กรุณาเลือกหน่วย</option>
                      <option v-for="unit in units" :key="unit.ID" :value="unit.ID">{{ unit.Name }}</option>
                    </CFormSelect>
                    <CFormFeedback invalid>{{ unitErrorMessage }}</CFormFeedback>
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
  name: "RegisStockComponent",
  setup() {
    const autoID = ref("");
    const stockname = ref("");
    const quantity = ref(0);
    const selectedType = ref("");
    const selectedUnit = ref("");
    const toasts = ref([]);
    const units = ref([]);
    const types = ref([]);
    const validatedTooltip = ref(false);

    
    const isStockInvalid = computed(() => validatedTooltip.value && !stockname.value);
    const isQuantityInvalid = computed(() => validatedTooltip.value && (isNaN(quantity.value) || quantity.value <= 0));
    const isTypeInvalid = computed(() => validatedTooltip.value && !selectedType.value);
    const isUnitInvalid = computed(() => validatedTooltip.value && !selectedUnit.value);

    
    const nameErrorMessage = computed(() => (isStockInvalid.value ? "กรุณากรอกชื่อวัสดุ" : ""));
    const quantityErrorMessage = computed(() => (isQuantityInvalid.value ? "กรุณากรอกจำนวนให้ถูกต้อง" : ""));
    const typeErrorMessage = computed(() => (isTypeInvalid.value ? "กรุณาเลือกประเภท" : ""));
    const unitErrorMessage = computed(() => (isUnitInvalid.value ? "กรุณาเลือกหน่วย" : ""));

    
    const handleSubmitTooltip = (event) => {
      validatedTooltip.value = true;
      if (isStockInvalid.value || isQuantityInvalid.value || isTypeInvalid.value || isUnitInvalid.value) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        handleSubmit();
      }
    };

    
    const handleSubmit = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post("/api/auth/registerStock", {
          name: stockname.value,
          quantity: quantity.value,
          stock_type_stock_ID: selectedType.value,
          stock_unit_id: selectedUnit.value,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        createToast("Success", response.data.message);
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        createToast("Error", error.response?.data?.error || "เกิดข้อผิดพลาดในการลงทะเบียนวัสดุ");
        console.error("Error:", error);
      }
    };


    const createToast = (title, content) => {
      toasts.value.push({ title, content });
      setTimeout(() => toasts.value.shift(), 5000);
    };


    const fetchAutoID = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getAutotidStock", {
          headers: { Authorization: `Bearer ${token}` },
        });
        autoID.value = response.data;
      } catch (error) {
        createToast("Error", error.response?.data?.error || "เกิดข้อผิดพลาดในการดึงข้อมูล ID");
      }
    };

    const fetchUnits = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getUnit", {
          headers: { Authorization: `Bearer ${token}` },
        });
        units.value = response.data;
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลหน่วย:", error);
      }
    };

    const fetchStockTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getTypeStock", {
          headers: { Authorization: `Bearer ${token}` },
        });
        types.value = response.data;
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลประเภทสต็อก:", error);
      }
    };

    onMounted(() => {
      fetchAutoID();
      fetchUnits();
      fetchStockTypes();
    });

    return {
      autoID,
      stockname,
      quantity,
      selectedType,
      selectedUnit,
      handleSubmitTooltip,
      isStockInvalid,
      nameErrorMessage,
      isQuantityInvalid,
      quantityErrorMessage,
      isTypeInvalid,
      typeErrorMessage,
      isUnitInvalid,
      unitErrorMessage,
      toasts,
      types,
      units,
    };
  },
};
</script>
