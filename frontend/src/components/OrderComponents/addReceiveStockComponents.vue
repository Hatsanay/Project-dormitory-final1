<template>
  <div>
    <CRow>
      <CCol :md="8">
        <CCard class="mb-4">
          <CCardHeader>รับวัสดุเข้าคลัง</CCardHeader>
          <CCardBody>
            <CForm class="row g-3" @submit.prevent="">
              <CCol :md="12">
                <div class="card mb-4">
                  <div class="card-body table-responsive p-0">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>ลำดับ</th>
                          <th>ชื่อ</th>
                          <th>จำนวน</th>
                          <th>หน่วย</th>
                          <th>สถานะ</th>
                          <th>เลือก</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-if="orders.length === 0">
                          <td colspan="5" class="text-center">
                            ไม่มีข้อมูลที่ตรงกับการค้นหา
                          </td>
                        </tr>
                        <tr v-for="order in orders" :key="order.orderlist_stock_ID">
                          <td>{{ order.number }}</td>
                          <td>{{ order.stockname }}</td>
                          <td>{{ order.quantity }}</td>
                          <td>{{ order.unit }}</td>
                          <td>{{ order.statusID }}</td>
                          <td>
                            <button
                              v-if="order.statusID === 'SOD000007'"
                              class="btn btn-primary btn-sm"
                              @click="selectOrder(order)"
                            >
                              เลือก
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CCol>

              <CCol :md="12" class="mt-4">
                <CRows>
                  <CCol :md="8"></CCol>
                  <CCol :md="4" style="margin-bottom: 10px">
                    <CButton @click="successReceiveStock()" color="success"
                      >ปิดรับเข้าใบสั่งซื้อ</CButton
                    >
                  </CCol>
                </CRows>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol :md="4">
        <CCard class="mb-4">
          <CCardHeader>วัสดุที่ต้องการเข้าคลัง</CCardHeader>
          <CCardBody>
            <CForm @submit.prevent="saveReceiveStock">
              <div class="card mb-4">
                <div class="card-body table-responsive p-0">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>ลำดับ</th>
                        <th>ชื่อ</th>
                        <th>จำนวน</th>
                        <th>หน่วย</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="selected in selectedOrders"
                        :key="selected.orderlist_stock_ID"
                      >
                        <td>{{ selected.number }}</td>
                        <td>{{ selected.stockname }}</td>
                        <td>{{ selected.quantity }}</td>
                        <td>{{ selected.unit }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <CButton type="submit" color="primary">บันทึกการรับเข้าวัสดุ</CButton>
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "addReceiveStock",
  setup() {
    const userId = ref(localStorage.getItem("userID"));
    const toasts = ref([]);
    const order_ID = ref("");
    const route = useRoute();
    order_ID.value = route.query.id;

    const orders = ref([]);
    const selectedOrders = ref([]);

    const getOrderReceiveByID = async (ID) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getOrdersForSelectForReceive", {
          params: { OrderID: ID },
          headers: { Authorization: `Bearer ${token}` },
        });
        orders.value = response.data;
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const saveReceiveStock = async () => {
      Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณไม่ต้องการบันทึกรับเข้าใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // เรียกใช้ handleSubmit เพื่อบันทึกข้อมูล
            const response = await axios.post("/api/auth/saveReceiveStock", {
              selectedOrders: selectedOrders.value, // รายการที่ผู้ใช้เลือก
            });
            if (response && response.status === 200) {
              Swal.fire({
                icon: "success",
                title: "บันทึกสำเร็จ",
                text: "การรบันทึกรับเข้าของคุณถูกบันทึกแล้ว",
              }).then(() => {
                window.location.reload();
              });
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: "ไม่สามารถบันทึกข้อมูลได้",
            });
          }
        }
      });
    };

    // ฟังก์ชันที่ใช้ในการเลือกวัสดุ (ไม่มีการตรวจสอบสถานะ)
    const selectOrder = (order) => {
      if (!selectedOrders.value.find((item) => item.number === order.number)) {
        selectedOrders.value.push(order); // เพิ่มรายการวัสดุที่เลือก
      } else {
        Swal.fire({
          icon: "warning",
          title: "ไม่สามารถเลือกได้",
          text: "คุณเลือกรายการนี้ไปแล้ว",
        });
      }
    };

    const successReceiveStock = async () => {
      // เรียกฟังก์ชันตรวจสอบจำนวนรายการที่ยังค้างอยู่
      const cOrder = await countForSuccess(order_ID.value);

      // หากมีจำนวนรายการที่ยังค้างอยู่ในสถานะ SOD000007
      console.log(cOrder);
      if (cOrder > 0) {
        Swal.fire({
          icon: "warning",
          title: "ยังมีรายการที่ยังไม่เสร็จสิ้น",
          text: "กรุณารับวัสดุทั้งหมดก่อนที่จะปิดการรับเข้า",
        });
        return; // หยุดการทำงานหากยังมีรายการที่ค้างอยู่
      }

      // ถ้าไม่มีรายการค้างให้ทำการเสร็จสิ้นการรับเข้า
      saveForsuccessReceiveStock(order_ID.value);
    };

    const countForSuccess = async (orderID) => {
      try {
        const response = await axios.get("/api/auth/countForSuccess", {
          params: { id: orderID },
        });
        return response.data.cOrder; // ส่งกลับจำนวนรายการที่ยังอยู่ในสถานะ SOD000007
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการตรวจสอบสถานะรายการ:", error);
        return 0; // หากเกิดข้อผิดพลาดให้ถือว่าไม่มีรายการค้าง
      }
    };

    const saveForsuccessReceiveStock = async (ID) => {
      Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณไม่ต้องการเสร็จสิ้นการรับเข้าใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            console.log("saveForsuccessReceiveStock: " + ID);
            const token = localStorage.getItem("token");
            const response = await axios.put("/api/auth/updateOrderForSuccess", null, {
              params: { orderID: ID },
              headers: { Authorization: `Bearer ${token}` },
            });

            if (response && response.status === 200) {
              Swal.fire({
                icon: "success",
                title: "บันทึกสำเร็จ",
                text: "การเสร็จสิ้นการรับเข้าของคุณถูกบันทึกแล้ว",
              }).then(() => {
                window.location.reload();
              });
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: "ไม่สามารถบันทึกข้อมูลได้",
            });
          }
        }
      });
    };

    onMounted(() => {
      if (order_ID.value) {
        getOrderReceiveByID(order_ID.value);
      }
    });

    return {
      orders,
      selectedOrders,
      saveReceiveStock,
      selectOrder,
      saveForsuccessReceiveStock,
      successReceiveStock,
      toasts,
    };
  },
};
</script>

<style scoped>
.list-unstyled {
  padding-left: 0;
  list-style: none;
}
</style>
