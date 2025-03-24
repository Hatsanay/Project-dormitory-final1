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
              @submit="handleSubmitStock"
            >
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="3">
                    <CFormLabel for="typestock_Id">รหัสวัสดุ</CFormLabel>
                    <CFormInput v-model="typestock_ID" type="text" id="typestock_Id" disabled />
                  </CCol>
                  <CCol md="9">
                    <CFormLabel for="stocksta">สถานะรายการ</CFormLabel>
                    <CFormSelect v-model="stocksta" id="stocksta" required>
                      <option value="">กรุณาเลือกสถานะ</option>
                      <option
                        v-for="stock in stocks"
                        :key="stock.StaUse_ID"
                        :value="String(stock.StaUse_ID)"
                      >
                        {{ stock.StaUse_Name }}
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
  name: "DeleteStockComponent",
  props: {
    selectedTypeStock: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const typestock_ID = ref(props.selectedTypeStock?.ID || "");
    const stocksta = ref(props.selectedTypeStock?.status || "");
    const stocks = ref([]);
    const toasts = ref([]);

    watch(
      () => props.selectedTypeStock,
      (newStock) => {
        typestock_ID.value = newStock?.ID || "";
        stocksta.value = newStock?.status || "";
      },
      { immediate: true }
    );

    const fetchStocks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getDeletableTypeStock", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        stocks.value = response.data;
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };
    
    const handleSubmitStock = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          ID: typestock_ID.value,
          status: stocksta.value,
        };

        await axios.put("/api/auth/updateStatusTypeStock", payload);
        toasts.value.push({
          title: "สำเร็จ",
          content: "ข้อมูลสต็อกวัสดุถูกอัปเดตเรียบร้อยแล้ว",
        });
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        });
        console.error("Error updating stock:", error);
      }
    };

    onMounted(() => {
      fetchStocks();
    });

    return {
      typestock_ID,
      stocksta,
      stocks,
      toasts,
      handleSubmitStock,
    };
  },
};
</script>
