<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>แก้ไขข้อมูลสต็อกสินค้า</CCardHeader>
          <CCardBody>
            <CForm
              class="row g-3 needs-validation"
              novalidate
              @submit="handleSubmitStock"
            >
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="2">
                    <CFormLabel for="stockID">รหัสสต็อก</CFormLabel>
                    <CFormInput v-model="stockID" type="text" id="stockID" disabled />
                  </CCol>
                  <CCol md="3">
                    <CFormLabel for="name">ชื่อวัสดุ</CFormLabel>
                    <CFormInput
                      v-model="name"
                      type="text"
                      id="name"
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
                      min="1"
                      :class="{ 'is-invalid': isQuantityInvalid }"
                    />
                    <CFormFeedback invalid>{{ quantityErrorMessage }}</CFormFeedback>
                  </CCol>
                  <CCol md="3">
                    <CFormLabel for="selectedType">ประเภท</CFormLabel>
                    <CFormSelect v-model="selectedType" id="selectedType" required :class="{ 'is-invalid': isTypeInvalid }">
                      <option value="">กรุณาเลือกประเภท</option>
                      <option 
                      v-for="type in types" 
                      :key="type.ID" 
                      :value="type.ID">
                      {{ type.name }}</option>
                    </CFormSelect>
                    <CFormFeedback invalid>{{ typeErrorMessage }}</CFormFeedback>
                  </CCol>
                  <CCol md="3">
                    <CFormLabel for="selectedUnit">หน่วย</CFormLabel>
                    <CFormSelect v-model="selectedUnit" id="selectedUnit" required :class="{ 'is-invalid': isUnitInvalid }">
                      <option value="">กรุณาเลือกหน่วย</option>
                      <option 
                      v-for="unit in units" 
                      :key="unit.ID" 
                      :value="unit.ID">
                      {{ unit.Name }}</option>
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
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

export default {
  name: "EditStockView",
  setup() {
    const route = useRoute();
    const stockID = ref(route.query.id || ""); // Assuming stock ID comes from query
    const name = ref("");
    const quantity = ref(1);
    const selectedType = ref("");
    const selectedUnit = ref("");
    const toasts = ref([]);
    
    const units = ref([]);
    const types = ref([]);

    // Validation flags
    const isStockInvalid = computed(() => !name.value.trim());
    const isQuantityInvalid = computed(() => quantity.value <= 0);
    const isTypeInvalid = computed(() => !selectedType.value);
    const isUnitInvalid = computed(() => !selectedUnit.value);

    // Error messages
    const nameErrorMessage = "กรุณากรอกชื่อวัสดุ";
    const quantityErrorMessage = "กรุณากรอกจำนวน (ต้องมากกว่า 0)";
    const typeErrorMessage = "กรุณาเลือกประเภท";
    const unitErrorMessage = "กรุณาเลือกหน่วย";

    const handleSubmitStock = async (event) => {
      event.preventDefault(); // Prevent default form submission

      if (isStockInvalid.value || isQuantityInvalid.value || isTypeInvalid.value || isUnitInvalid.value) {
        return; // Stop if validation fails
      }

      try {
        const payload = {
          newName: name.value,
          quantity: quantity.value,
          stock_unit_id: selectedUnit.value,
          stock_type_stock_ID: selectedType.value,
        };
        await axios.put(`/api/auth/updateStock?ID=${stockID.value}`, payload);
        toasts.value.push({
          title: "สำเร็จ",
          content: "ข้อมูลสต็อกถูกบันทึกเรียบร้อยแล้ว",
        });
        setTimeout(() => {
          this.$router.push("/ViewStockView"); 
        }, 1000);
      } catch (error) {
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        });
      }
    };

    const fetchStockByID = async (id) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getStockByID", {
          params: { ID: id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const stockData = response.data;
        name.value = stockData.name || "";
        quantity.value = stockData.quantity || 1; // Default to 1 if quantity is not set
        selectedType.value = stockData.stock_type_stock_ID || ""; // Assuming typeID is returned
        selectedUnit.value = stockData.stock_unit_id || ""; // Assuming unitID is returned
      } catch (error) {
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "ไม่สามารถดึงข้อมูลสต็อกได้",
        });
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
      fetchStockByID(stockID.value);
      fetchUnits();
      fetchStockTypes();
    });

    return {
      stockID,
      name,
      quantity,
      selectedType,
      selectedUnit,
      toasts,
      handleSubmitStock,
      units,
      types,
      isStockInvalid,
      isQuantityInvalid,
      isTypeInvalid,
      isUnitInvalid,
      nameErrorMessage,
      quantityErrorMessage,
      typeErrorMessage,
      unitErrorMessage,
    };
  },
};
</script>
