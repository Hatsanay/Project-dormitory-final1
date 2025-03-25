<template>
  <div>
    <CRow>
      <CCol :md="8">
        <CCard class="mb-4">
          <CCardHeader>แก้ไขใบสั่งซื้อ</CCardHeader>
          <CCardBody>
            <CForm class="row g-3" @submit.prevent="confirmhandleSubmit">
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
                    v-for="product in filteredStockList"
                    :key="product.stockid"
                    :value="product.stockname"
                  >
                    {{ product.stockname }} ({{ product.typestockname }})
                  </option>
                </datalist>
              </CCol>

              <CCol :md="12">
                <CFormLabel>รายการสินค้า</CFormLabel>
                <CInputGroup
                  v-for="(item, index) in order.items"
                  :key="index"
                  class="mb-3"
                >
                  <!-- <CFormInput
                    v-model="item.orderlist_stock_ID"
                    placeholder="รหัส"
                    :readonly="!item.isCustom"
                    required
                  /> -->
                  <CFormInput
                    v-model="item.stockname"
                    placeholder="ชื่อสินค้า"
                    :readonly="!item.isCustom"
                    required
                  />
                  <CFormInput
                    v-model="item.quantity"
                    type="number"
                    placeholder="จำนวน"
                    min="1"
                    required
                  />

                  <CFormInput v-model="item.unit" placeholder="หน่วย" required />
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

              <CCol :md="12" class="mt-4">
                <CButton type="submit" color="primary">บันทึกการแก้ไขใบสั่งซื้อ</CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

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
                  {{ item.stockname }} - {{ item.quantity }} {{ item.unit }} -
                  {{ formatCurrency(item.price * item.quantity) }} -
                  <span>{{ item.orderlist_type_stock || "ประเภทไม่ระบุ" }}</span>
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
  name: "OrderEdit",
  setup() {
    const order = ref({
      items: [],
    });

    const userId = ref(localStorage.getItem("userID"));
    const fullName = ref("");
    const stockList = ref([]);
    const selectedProductName = ref("");
    const orderId = ref("");
    const toasts = ref([]);

    const route = useRoute();
    orderId.value = route.query.id;

    const fetchStock = async () => {
      try {
        const response = await axios.get("/api/auth/getStock");
        stockList.value = response.data;
      } catch (error) {
        console.error("Error fetching stock data:", error);
        toasts.value.push({
          title: "Error",
          content: "Unable to fetch stock data.",
        });
      }
    };

    const getUserByIdfromReq = async (uid) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getUserByIdfromReq", {
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

    const fetchOrderDetails = async (id) => {
      try {
        const response = await axios.get(`/api/auth/selectOrderbyID?order_ID=${id}`);
        order.value = response.data;
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    const onProductChange = () => {
      if (selectedProductName.value) {
        const selectedProduct = stockList.value.find(
          (product) => product.stockname === selectedProductName.value
        );

        if (selectedProduct) {
          order.value.items.push({
            stockname: selectedProduct.stockname,
            quantity: 1,
            unit: selectedProduct.unitname,
            price: 0,
            orderlist_stock_ID: selectedProduct.stockid,
            orderlist_type_stock: selectedProduct.typestockname || "ไม่ระบุ", // ใช้ "ไม่ระบุ" หากไม่มีประเภทสินค้า
            isCustom: false,
          });
        } else {
          order.value.items.push({
            stockname: selectedProductName.value,
            quantity: 1,
            unit: "", // กรณีสินค้าสั่งทำไม่มีหน่วย
            price: 0,
            orderlist_stock_ID: null,
            orderlist_type_stock: "", // ประเภทสินค้า
            isCustom: true, // สินค้าสั่งทำ
          });
        }

        selectedProductName.value = "";
      }
    };

    const addItem = () => {
      order.value.items.push({
        stockname: "",
        quantity: 1,
        unit: "", // กรณีสินค้าสั่งทำไม่มีหน่วย
        price: 0,
        orderlist_type_stock: "ไม่ระบุ", // ให้ค่าเริ่มต้น "ไม่ระบุ"
        isCustom: true, // สินค้าสั่งทำ
      });
    };

    const removeItem = (index) => {
      order.value.items.splice(index, 1); // ลบรายการสินค้า
    };

    const totalAmount = computed(() => {
      return order.value.items.reduce((total, item) => {
        return total + item.quantity * item.price; // คำนวณตามจำนวนและราคา
      }, 0);
    });

    const formatCurrency = (value) => {
      return new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB",
      }).format(value);
    };

    const handleEditSubmit = async () => {
      try {
        const token = localStorage.getItem("token");
        const orderData = {
          order_ID: orderId.value,
          order_user_ID: userId.value,
          date: new Date().toISOString().split("T")[0],
          order_stat_ID: 1,
          total: totalAmount.value,
          items: order.value.items.map((item) => ({
            orderlist_stock_ID: item.orderlist_stock_ID,
            stockname: item.stockname,
            quantity: item.quantity,
            unit: item.unit,
            price: item.price,
            totalprice: item.quantity * item.price,
            orderlist_type_stock: item.orderlist_type_stock || "ไม่ระบุ", // ให้ค่าเริ่มต้น "ไม่ระบุ"
          })),
        };

        const response = await axios.put(`/api/auth/editOrder`, orderData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "แก้ไขสำเร็จ",
            text: "ใบสั่งซื้อของคุณถูกแก้ไขแล้ว",
          }).then(() => {
            window.location.reload();
          });
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถแก้ไขข้อมูลได้",
        });
      }
    };

    const confirmhandleSubmit = async () => {
      Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณต้องการแก้ไขใบสั่งซื้อใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await handleEditSubmit();
        }
      });
    };

    const filteredStockList = computed(() => {
      // คืนค่ารายการสินค้าใหม่ที่ไม่ซ้ำกับสินค้าที่มีในรายการ
      return stockList.value.filter((product) => {
        return !order.value.items.some((item) => item.stockname === product.stockname);
      });
    });

    onMounted(() => {
      if (userId.value) {
        getUserByIdfromReq(userId.value);
      }
      fetchStock();
      fetchOrderDetails(orderId.value);
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
      handleEditSubmit,
      confirmhandleSubmit,
      filteredStockList,
    };
  },
};
</script>
