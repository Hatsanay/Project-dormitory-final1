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
                          <th>เลขที่</th>
                          <th>ชื่อ</th>
                          <th>จำนวนที่สั่ง</th>
                          <th>หน่วย</th>
                          <th>สถานะ</th>
                          <th>เลือก</th>
                        </tr>
                      </thead>
                      <tbody>
                        <!-- <tr v-if="orders.length === 0">
                          <td colspan="7" class="text-center">
                            ไม่มีข้อมูลที่ตรงกับการค้นหา
                          </td>
                        </tr> -->
                      </tbody>
                    </table>
                  </div>
                </div>
              </CCol>

              <!-- ปุ่มบันทึก -->
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
          <CCardBody> </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Toast สำหรับแสดงข้อความแจ้งเตือน -->
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
import { useRoute } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "addReceiveStock",
  setup() {
    const order = ref({
      items: [],
    });

    const userId = ref(localStorage.getItem("userID"));
    const fullName = ref("");
    const stockList = ref([]); // เก็บข้อมูลสต็อกจาก API
    const selectedProductName = ref(""); // ชื่อสินค้าที่เลือกหรือพิมพ์
    const toasts = ref([]);
    const reqrId = ref("");
    const route = useRoute();
    reqrId.value = route.query.id;

    const getOrderReceiveByID = async (orderID) => {
      let datalelength;
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/", {
          params: {
            OrderID: orderID,
          },
          headers: {
            Authorization: `Bearer ${token}`,
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

    onMounted(() => {
      if (reqrId.value) {
        console.log("กำลังดึงข้อมูลจาก Req_ID:", reqrId.value);
        getOrderReceiveByID(reqrId.value);
      }
    });

    return {
      order,
      fullName,
      stockList,
      selectedProductName,
      toasts,
      getOrderReceiveByID,
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
