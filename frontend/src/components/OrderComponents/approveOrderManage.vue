<template>
  <div>
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === '1' }"
          @click.prevent="setActiveTab('1')"
          href="#"
        >
          <i class="fa-solid fa-cart-plus"></i>
          อนุมัติใบสั่งซื้อ
        </a>
      </li>
      <!-- <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === '2' }"
          @click.prevent="setActiveTab('2')"
          href="#"
        >
          <i class="fa-solid fa-cart-shopping"></i>
          ประวัติใบสั่งซื้อ
        </a>
      </li> -->
    </ul>

    <div class="tab-content mt-3">
      <div v-if="activeTab === '1'" class="tab-pane active">
        <CRow style="margin-bottom: 10px">
          <CCol :md="9"></CCol>
          <CCol :md="3" style="margin-bottom: 10px">
            <CInputGroup>
              <CFormInput
                placeholder="ค้นหา..."
                v-model="searchQuery"
                @input="fetchOrders"
              />
              <CInputGroupText>
                <CIcon name="cil-magnifying-glass" />
              </CInputGroupText>
            </CInputGroup>
          </CCol>
        </CRow>

        <div class="row">
          <div class="col-md-12">
            <div class="card mb-4">
              <div class="card-header">ตารางใบสั่งซื้อ</div>
              <div class="card-body table-responsive p-0">
                <table class="table">
                  <thead>
                    <tr>
                      <th>เลขที่ใบสั่งซื้อ</th>
                      <th>ชิ่่อผู้ออกใบสั่งซื้อ</th>
                      <th>วันที่ล่าสุด</th>
                      <th>ราคารวม</th>
                      <th>สถานะ</th>
                      <th>อนุมัติ</th>
                      <th>ใบสั่งซื้อ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="orders.length === 0">
                      <td colspan="7" class="text-center">
                        ไม่มีข้อมูลที่ตรงกับการค้นหา
                      </td>
                    </tr>
                    <tr v-for="order in orders" :key="order.order_ID">
                      <td>{{ order.order_ID }}</td>
                      <td>{{ order.fullname }}</td>
                      <td>{{ order.date }}</td>
                      <td>{{ order.total }}</td>
                      <td>{{ order.status }}</td>
                      <td>
                        <button
                          v-if="order.status == 'รออนุมัติ'"
                          class="btn btn-success btn-sm"
                          @click="approve(order.order_ID)"
                          style="margin-right: 5px"
                        >
                          <i class="fa-solid fa-check"> อนุมัติ</i>
                        </button>

                        <button
                          v-if="order.status == 'รออนุมัติ'"
                          class="btn btn-danger btn-sm"
                          @click="notApproveOrder(order.order_ID)"
                        >
                          <i class="fa-solid fa-xmark"> ไม่อนุมัติ</i>
                        </button>
                      </td>

                      <td>
                        <button
                          class="btn btn-info btn-sm fontwhite"
                          @click="viewInvoicePDF(order.order_ID)"
                        >
                          <i class="fa-solid fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="card-footer">
                <div class="row">
                  <div class="col-md-4">
                    <div class="d-flex align-items-center">
                      <span>Show</span>
                      <select
                        v-model="rowsPerPage"
                        class="form-select mx-2"
                        style="width: auto"
                        @change="fetchOrders"
                      >
                        <option :value="5">5</option>
                        <option :value="10">10</option>
                        <option :value="20">20</option>
                        <option :value="50">50</option>
                        <option :value="100">100</option>
                      </select>
                      <span>entries</span>
                    </div>
                  </div>
                  <div class="col-md-8 d-flex justify-content-end">
                    <button
                      class="btn btn-secondary"
                      :disabled="currentPage === 1"
                      @click="currentPage--"
                    >
                      Previous
                    </button>
                    <button
                      v-for="page in totalPages"
                      :key="page"
                      @click="setPage(page)"
                      :class="
                        page === currentPage
                          ? 'btn btn-primary mx-1'
                          : 'btn btn-secondary mx-1'
                      "
                    >
                      {{ page }}
                    </button>
                    <button
                      class="btn btn-secondary"
                      :disabled="currentPage === totalPages"
                      @click="currentPage++"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === '2'" class="tab-pane active"></div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "orderManage",
  setup() {
    const userId = ref(localStorage.getItem("userID"));
    const activeTab = ref("1");
    const searchQuery = ref("");
    const rowsPerPage = ref(10);
    const currentPage = ref(1);
    const orders = ref([]);
    const totalPages = computed(() => Math.ceil(orders.value.length / rowsPerPage.value));

    const setActiveTab = (tab) => {
      activeTab.value = tab;
    };

    const fetchOrders = async () => {
      const offset = (currentPage.value - 1) * rowsPerPage.value;
      let datalelength;
      try {
        const token = localStorage.getItem("token"); // ดึง token จาก localStorage
        const response = await axios.get("/api/auth/getPendingOrdersForApprove", {
          params: {
            limit: rowsPerPage.value,
            offset: offset,
            search: searchQuery.value,
          },
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ไปกับ request
          },
        });
        orders.value = response.data;
        datalelength = 1;
      } catch (error) {
        console.error("Error fetching orders:", error);
        datalelength = 0;
        // Swal.fire({
        //   icon: "error",
        //   title: "เกิดข้อผิดพลาด",
        //   text: "ไม่สามารถดึงข้อมูลใบสั่งซื้อได้",
        // });
      }
    };

    const setPage = (page) => {
      currentPage.value = page;
      fetchOrders();
    };

    const viewInvoicePDF = async (orderID) => {
      const token = localStorage.getItem("token"); // รับ token จาก localStorage

      try {
        // ใช้ window.open() เพื่อเปิด URL ในแท็บใหม่
        const response = await axios.get(`/api/auth/orders/${orderID}/pdf`, {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ใน header
          },
          responseType: "arraybuffer", // รับข้อมูลแบบ arraybuffer เพื่อจัดการไฟล์
        });

        const fileURL = URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        window.open(fileURL, "_blank"); // เปิด PDF ในแท็บใหม่
      } catch (error) {
        console.error("Error opening PDF:", error);
      }
    };

    const approve = async (orderID) => {
      Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณต้องการอนุมัติใบสั่งซื้อใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log(orderID);
          const token = localStorage.getItem("token");
          try {
            await axios.put(
              `/api/auth/approveOrder`,
              {
                orderID: orderID,
                userId: userId.value,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            Swal.fire({
              title: "อนุมัติใบสั่งซื้อ",
              text: "อนุมัติใบสั่งซื้อเรียบร้อย!",
              icon: "success",
            }).then(() => {
              window.location.reload();
            });
          } catch (error) {
            console.error("เกิดข้อผิดพลาดในการอนุมัติใบสั่งซื้อ:", error);
            Swal.fire({
              title: "เกิดข้อผิดพลาด!",
              text: "ไม่สามารถอนุมัติใบสั่งซื้อได้.",
              icon: "error",
            });
          }
        }
      });
    };

    const notApproveOrder = async (orderID) => {
      Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณไม่ต้องการอนุมัติใบสั่งซื้อใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log(orderID);
          const token = localStorage.getItem("token");
          try {
            await axios.put(
              `/api/auth/notApproveOrder`,
              {
                orderID: orderID,
                userId: userId.value,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            Swal.fire({
              title: "ปฎิเสธการอนุมัติใบสั่งซื้อ",
              text: "ปฎิเสธการอนุมัติใบสั่งซื้อเรียบร้อย!",
              icon: "success",
            }).then(() => {
              window.location.reload();
            });
          } catch (error) {
            console.error("เกิดข้อผิดพลาดในการปฎิเสธการอนุมัติใบสั่งซื้อ:", error);
            Swal.fire({
              title: "เกิดข้อผิดพลาด!",
              text: "ไม่สามารถปฎิเสธการอนุมัติใบสั่งซื้อได้.",
              icon: "error",
            });
          }
        }
      });
    };

    onMounted(() => {
      fetchOrders();
    });

    watch([searchQuery, rowsPerPage], fetchOrders);

    return {
      userId,
      activeTab,
      searchQuery,
      rowsPerPage,
      currentPage,
      orders,
      totalPages,
      setActiveTab,
      setPage,
      fetchOrders,
      viewInvoicePDF,
      approve,
      notApproveOrder,
    };
  },
};
</script>

<style scoped>
/* .nav-tabs .nav-link.active {
  background-color: #5856d6;
  color: white;
}

.nav-tabs .nav-link {
  color: #007bff;
} */

/* .modern-button {
  background-color: #5856d6;
  border: none;
  color: white;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
} */

.modern-button:hover {
  background-color: #0056b3;
}

.fontwhite {
  color: white;
}
</style>
