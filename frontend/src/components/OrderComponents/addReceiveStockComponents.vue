<template>
  <div>
    <CRow>
      <CCol :md="8">
        <CCard class="mb-4">
          <CCardHeader>รับวัสดุเข้าคลัง</CCardHeader>
          <CCardBody>
            <CForm class="row g-3" @submit.prevent="saveReceiveStock">
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
                          <td>{{ order.statusName }}</td>
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
                <CButton type="submit" color="primary">บันทึกการรับเข้าวัสดุ</CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol :md="4">
        <CCard class="mb-4">
          <CCardHeader>วัสดุที่ต้องการเข้าคลัง</CCardHeader>
          <CCardBody>
            <div class="card mb-4">
              <div class="card-body table-responsive p-0">
                <table class="table">
                  <thead>
                    <tr>
                      <th>ลำดับ</th>
                      <th>เลขที่</th>
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
                      <td>{{ selected.orderlist_stock_ID }}</td>
                      <td>{{ selected.stockname }}</td>
                      <td>{{ selected.quantity }}</td>
                      <td>{{ selected.unit }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
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
          params: {
            OrderID: ID,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        orders.value = response.data;
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const selectOrder = (order) => {
      if (!selectedOrders.value.find((item) => item.number === order.number)) {
        selectedOrders.value.push(order);
      } else {
        Swal.fire({
          icon: "warning",
          title: "ไม่สามารถเลือกได้",
          text: "คุณเลือกรายการนี้ไปแล้ว",
        });
      }
    };

    const saveReceiveStock = () => {};

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
