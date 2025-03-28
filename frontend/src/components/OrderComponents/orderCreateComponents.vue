<template>
  <div>
    <CRow>
      <CCol :md="8">
        <CCard class="mb-4">
          <CCardHeader>รายละเอียดใบสั่งซื้อ</CCardHeader>
          <CCardBody>
            <CForm class="row g-3" @submit.prevent="confirmhandleSubmit">
              <!-- เลือกหรือพิมพ์ชื่อสินค้า -->
              <CCol :md="12">
                <CFormLabel>เลือกหรือพิมพ์ชื่อสินค้า</CFormLabel>
                <input
                  list="stockList"
                  v-model="selectedProductName"
                  @change="onProductChange"
                  class="form-control"
                  placeholder="พิมพ์หรือเลือกสินค้า"
                />
                <datalist id="stockList">
                  <option
                    v-for="product in stockList"
                    :key="product.stockid"
                    :value="product.stockname"
                    :disabled="isProductInOrder(product.stockname)"
                  >
                    {{ product.stockname }} ({{ product.typestockname }})
                  </option>
                </datalist>
              </CCol>

              <!-- รายการสินค้า -->
              <CCol :md="12">
                <CFormLabel>รายการสินค้า</CFormLabel>
                <CInputGroup
                  v-for="(item, index) in order.items"
                  :key="index"
                  class="mb-3"
                >
                  <CFormInput
                    v-model="item.name"
                    placeholder="ชื่อสินค้า"
                    :readonly="!item.isCustom"
                    required
                  />
                  <CFormInput
                    v-model="item.remaining_quantity"
                    type="number"
                    placeholder="จำนวน"
                    min="1"
                    required
                  />
                  <CFormInput v-model="item.unitname" placeholder="หน่วย" required />
                  <CFormInput
                    v-model="item.price"
                    type="number"
                    placeholder="ราคาต่อหน่วย"
                    min="0"
                  />
                  <CFormInput
                    v-model="item.orderlist_type_stock"
                    :placeholder="
                      item.orderlist_stock_ID ? 'ประเภทสินค้า' : 'กรุณากรอกประเภทสินค้า'
                    "
                    :readonly="item.orderlist_stock_ID ? true : false"
                    required
                  />

                  <CButton color="danger" @click="removeItem(index)"> ลบ </CButton>
                </CInputGroup>
                <CButton color="success" @click="addItem"> เพิ่มรายการสินค้า </CButton>
              </CCol>

              <!-- ปุ่มบันทึก -->
              <CCol :md="12" class="mt-4">
                <CButton type="submit" color="primary">บันทึกใบสั่งซื้อ</CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      <!-- ส่วนพรีวิวใบสั่งซื้อ -->
      <CCol :md="4">
        <CCard class="mb-4">
          <CCardHeader>พรีวิวใบสั่งซื้อ</CCardHeader>
          <CCardBody>
            <div v-if="fullName">
              <h5>ผู้ออกใบสั่งซื้อ: {{ fullName }}</h5>
              <hr />
              <h6>รายการสินค้า:</h6>
              <ul class="list-unstyled">
                <li v-for="(item, index) in order.items" :key="index" class="mb-2">
                  {{ item.name }} - {{ item.remaining_quantity }} {{ item.unitname }} -
                  {{ formatCurrency(item.price * item.remaining_quantity) }} -
                  <span>{{ item.typestockname || "ประเภทไม่ระบุ" }}</span>
                </li>
              </ul>
              <hr />
              <h6>รวมทั้งหมด: {{ formatCurrency(totalAmount) }}</h6>
            </div>
            <div v-else>
              <p class="text-muted">กรุณากรอกข้อมูลเพื่อดูพรีวิว</p>
            </div>
          </CCardBody>
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
  name: "OrderCreate",
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

    const fetchStock = async () => {
      try {
        const response = await axios.get("/api/auth/getStock"); // ใช้ endpoint สำหรับดึงข้อมูล stock
        stockList.value = response.data; // ใส่ข้อมูลสินค้าที่ดึงมาใน stockList
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสต็อก:", error);
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "ไม่สามารถดึงข้อมูลสต็อกได้",
        });
      }
    };

    // ดึงข้อมูลผู้ใช้จาก API
    const getUserByIdfromOrder = async (uid) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getUserByIdfromOrder", {
          params: { id: uid },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data;
        fullName.value = userData.fullname || "";
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    // ในฟังก์ชัน onProductChange
    const onProductChange = async () => {
      if (selectedProductName.value) {
        const productExists = order.value.items.some(
          (item) => item.name === selectedProductName.value
        );

        if (productExists) {
          Swal.fire({
            icon: "error",
            title: "สินค้านี้ถูกเลือกแล้ว",
            text: "กรุณาเลือกสินค้าที่แตกต่างจากรายการที่มีอยู่แล้ว",
          });
          selectedProductName.value = ""; // เคลียร์ input หลังจากแจ้งเตือน
          return;
        }

        const selectedProduct = stockList.value.find(
          (product) => product.stockname === selectedProductName.value
        );

        if (selectedProduct) {
          const remainingQuantity = await fetchRemainingQuantity(
            selectedProduct.remaining_quantity
          );

          order.value.items.push({
            name: selectedProduct.stockname,
            quantity: 1,
            unit: selectedProduct.unitname,
            price: 0,
            orderlist_stock_ID: selectedProduct.stockid,
            unitname: selectedProduct.unitname,
            remaining_quantity: remainingQuantity,
            typestockname: selectedProduct.typestockname, // เพิ่มประเภทสินค้า
            orderlist_type_stock: selectedProduct.typestockname, // ส่งค่าประเภทสินค้าที่กรอกไป
            isCustom: false,
          });
        } else {
          order.value.items.push({
            name: selectedProductName.value,
            quantity: 1,
            unit: "", // ถ้าเป็นสินค้า custom ไม่มี unit
            price: 0,
            orderlist_stock_ID: null,
            typestockname: "", // กรณี custom จะไม่มีกำหนดประเภท
            orderlist_type_stock: selectedProductName.value, // ส่งค่าที่กรอกไปเป็นประเภทสินค้า
            isCustom: true, // สินค้าสั่งทำ
          });
        }

        selectedProductName.value = ""; // เคลียร์ input หลังจากเลือกสินค้า
      }
    };

    const addItem = () => {
      order.value.items.push({
        name: "",
        quantity: 1,
        unit: "",
        price: 0,
        orderlist_stock_ID: null,
        typestockname: "", // เพิ่มประเภทสินค้าเป็นค่าว่าง
        isCustom: true, // สามารถแก้ไขชื่อได้
      });
    };

    // กรณีที่มี reqrId ส่งมาและต้องการดึงข้อมูลสินค้าจาก requisition
    const getUserByIdReq = async (id) => {
      try {
        const response = await axios.get(`/api/auth/selectOrderByReq_ID?Req_ID=${id}`);
        const items = response.data.items;

        // ใส่ข้อมูลสินค้าที่ดึงมาจาก API
        order.value.items = items.map((item) => {
          return {
            ...item,
            // กรณีที่ item ไม่มี orderlist_stock_ID ให้ใช้ reqlist_stock_ID
            orderlist_stock_ID: item.reqlist_stock_ID ? item.reqlist_stock_ID : null,
            unitname: item.unitname || "", // ตรวจสอบหน่วยสินค้า
            orderlist_type_stock: item.orderlist_type_stock || "", // ตรวจสอบหน่วยสินค้า
            price: 0, // ราคาคิดเป็น 0 หากไม่ได้ระบุราคา
            remaining_quantity: item.remaining_quantity || 0, // กำหนด remaining_quantity ถ้ามี
            isCustom: false, // กรณีนี้เป็นสินค้าจาก requisition list
          };
        });
        console.log("Response data:", response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    // Fetch remaining quantity
    const fetchRemainingQuantity = async (stockId) => {
      try {
        const response = await axios.get("/api/auth/getRemainingQuantity", {
          params: { stockId },
        });
        return response.data.remaining_quantity; // assuming this field comes from the response
      } catch (error) {
        console.error("Error fetching remaining quantity:", error);
        return 0; // Default to 0 if error occurs
      }
    };

    const removeItem = (index) => {
      order.value.items.splice(index, 1); // ลบรายการสินค้าที่เลือก
    };

    const totalAmount = computed(() => {
      return order.value.items.reduce((total, item) => {
        return total + item.remaining_quantity * item.price;
      }, 0);
    });

    // จัดรูปแบบเงิน
    const formatCurrency = (value) => {
      return new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB",
      }).format(value);
    };
    const handleSubmit = async () => {
      try {
        const token = localStorage.getItem("token");
        const orderData = {
          order_user_ID: userId.value,
          date: new Date().toISOString().split("T")[0],
          order_stat_ID: 1,
          total: totalAmount.value,
          items: order.value.items.map((item) => {
            // ตรวจสอบและตั้งค่า orderlist_type_stock ในกรณีที่ไม่ได้กรอก
            const orderlist_type_stock =
              item.orderlist_type_stock && item.orderlist_type_stock.trim() !== ""
                ? item.orderlist_type_stock
                : "ไม่ระบุ"; // ถ้าไม่มีค่าให้กรอกคำว่า "ไม่ระบุ"

            let orderlist_stock_ID = item.orderlist_stock_ID;
            let stockname = item.name; // เริ่มต้นด้วยชื่อที่กรอก

            if (item.orderlist_stock_ID === null) {
              // ถ้าเป็นสินค้าสั่งทำ ให้ใช้ชื่อสินค้าที่กรอกแทน
              orderlist_stock_ID = null; // หมายความว่าสินค้าสั่งทำ
              stockname = item.name || "ไม่ระบุ"; // ถ้าไม่มีชื่อสินค้าให้ใช้คำว่า "ไม่ระบุ"
            }

            return {
              orderlist_stock_ID: orderlist_stock_ID,
              stockname: stockname, // ชื่อที่กรอกสำหรับสินค้าสั่งทำ
              quantity: item.remaining_quantity,
              unit: item.unitname, // unitname ถูกส่งไปที่นี่
              price: item.price,
              totalprice: item.remaining_quantity * item.price,
              orderlist_type_stock: orderlist_type_stock, // บันทึกประเภทสินค้าหากเป็นสินค้าสั่งทำ
            };
          }),
        };

        // ตรวจสอบข้อมูลก่อนส่ง
        console.log(orderData);

        // ส่งข้อมูลไปยัง API
        const response = await axios.post("/api/auth/createOrder", orderData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // เช็คสถานะของการบันทึก
        if (response.status === 201) {
          return response; // ส่งข้อมูลกลับเพื่อให้ confirmhandleSubmit ทราบว่าเสร็จสิ้น
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", error);
        throw new Error("ไม่สามารถบันทึกข้อมูลได้");
      }
    };

    const confirmhandleSubmit = async () => {
      // ตรวจสอบว่ามีรายการสินค้าที่ price = 0 หรือไม่
      const invalidItem = order.value.items.find((item) => item.price === 0);

      if (invalidItem) {
        Swal.fire({
          icon: "error",
          title: "ข้อผิดพลาด",
          text: `กรุณากรอกราคาให้ครบถ้วนสำหรับสินค้า: ${invalidItem.name}`,
        });
        return; // หยุดการดำเนินการหากพบสินค้าที่ไม่มีราคา
      }

      Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณไม่ต้องการเบิกใช่หรือไม่?",
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
            const response = await handleSubmit();
            if (response && response.status === 201) {
              Swal.fire({
                icon: "success",
                title: "บันทึกสำเร็จ",
                text: "การใบสั่งซื้อของคุณถูกบันทึกแล้ว",
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

    const isProductInOrder = (stockname) => {
      return order.value.items.some((item) => item.name === stockname);
    };

    onMounted(() => {
      console.log(userId.value);

      if (userId.value) {
        getUserByIdfromOrder(userId.value); // ดึงข้อมูลผู้ใช้งานจาก ID
      }

      // ตรวจสอบว่า reqrId มีค่าหรือไม่
      if (reqrId.value) {
        console.log("กำลังดึงข้อมูลจาก Req_ID:", reqrId.value);
        getUserByIdReq(reqrId.value); // ดึงข้อมูลสินค้าตาม reqrId
      }
      fetchStock(); // ดึงข้อมูลสต็อกแบบปกติ
    });

    return {
      order,
      fullName,
      stockList,
      selectedProductName,
      toasts,
      onProductChange,
      addItem,
      removeItem,
      totalAmount,
      formatCurrency,
      handleSubmit,
      confirmhandleSubmit,
      getUserByIdReq,
      isProductInOrder,
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
