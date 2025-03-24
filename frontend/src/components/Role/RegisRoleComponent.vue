<template>
  <div>
    <WidgetsStatsD class="mb-4" />
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>จัดการบทบาท</CCardHeader>
          <CCardBody>
            <CForm class="row g-2 needs-validation" novalidate @submit="handleSubmitRole">
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="2">
                    <CFormLabel for="roleID">รหัสบทบาท</CFormLabel>
                    <CFormInput v-model="autoID" type="text" id="roleID" disabled />
                  </CCol>
                  <CCol md="5">
                    <CFormLabel for="roleName">ชื่อบทบาท</CFormLabel>
                    <CFormInput
                      v-model="roleName"
                      type="text"
                      id="roleName"
                      required
                      :class="{ 'is-invalid': isRoleInvalid }"
                    />
                    <CFormFeedback invalid>
                      {{ roleErrorMessage }}
                    </CFormFeedback>
                  </CCol>
                </CRow>

                <!-- แสดงสิทธิ์แบบหมวดหมู่ -->
                <CRow class="mb-3">
                  <CCol md="12">
                    <CFormLabel>กำหนดสิทธิ์:</CFormLabel>

                    <template v-for="(category, categoryIndex) in permissionsCategories" :key="categoryIndex">
                      <h6 class="mt-3">{{ category.name }}</h6>
                      <CRow>
                        <template v-for="(permission, index) in category.permissions" :key="index">
                          <CCol md="3">
                            <CFormCheck
                              :id="'permission' + permission.index"
                              :value="permission.index"
                              v-model="selectedPermissions"
                            />
                            <CFormLabel :for="'permission' + permission.index">{{ permission.label }}</CFormLabel>
                          </CCol>
                        </template>
                      </CRow>
                    </template>
                  </CCol>
                </CRow>

                <CButton type="submit" color="primary">บันทึก</CButton>
              </CCol>
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
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";

export default {
  name: "RegisRoleComponent",
  setup() {
    const autoID = ref("");
    const roleName = ref("");
    const validatedTooltip = ref(false);
    const toasts = ref([]);
    const selectedPermissions = ref([]);
    const permissionsBinary = ref("");

    const permissionsCategories = ref([
      // {
      //   name: "การเข้าถึงระบบ",
      //   permissions: [
      //     { index: 0, label: " ล็อคเอาท์" },
      //     { index: 1, label: " หน้าจอหลัก" }
      //   ]
      // },
      {
        name: "การแสดงผล",
        permissions: [
          { index: 2, label: " หน้าแสดงผลผู้ใช้" },
          { index: 3, label: " หน้าแสดงผลแอดมิน" },
          { index: 4, label: " หน้าแสดงผลช่าง" },
          { index: 5, label: " หน้าแสดงผลนิติ" },
        ]
      },
      {
        name: "การแจ้งซ่อมและการซ่อมบำรุง",
        permissions: [
          { index: 6, label: " ประวัติการแจ้งซ่อม" },
          { index: 7, label: " ส่งคำร้องแจ้งซ่อม" },
          { index: 8, label: " คำขอร้องแจ้งซ่อม" },
          { index: 9, label: " รับคำขอร้องแจ้งซ่อม" },
          { index: 10, label: " การเบิกวัสดุ" },
          { index: 11, label: " นัดเวลาเข้าซ่อม" }
        ]
      },
      {
        name: "การจัดการผู้ใช้งาน",
        permissions: [
          { index: 12, label: " จัดการผู้ใช้งาน" },
          { index: 13, label: " เพิ่มผู้ใช้งาน" },
          { index: 14, label: " แก้ไขผู้ใช้งาน" },
        ]
      },
      {
        name: "การจัดการห้องพัก",
        permissions: [
          { index: 15, label: " จัดการห้องพัก" },
          { index: 16, label: " เพิ่มห้องพัก" },
          { index: 17, label: " แก้ไขห้องพัก" },
        ]
      },
      {
        name: "การจัดการคลัง",
        permissions: [
          { index: 18, label: " จัดการคลังวัสดุ" },
          { index: 19, label: " เพิ่มคลังวัสดุ" },
          { index: 20, label: " แก้ไขคลังวัสดุ" },
        ]
      },
      {
        name: "การจัดการคลัง",
        permissions: [
          { index: 21, label: " จัดการประเภทวัสดุ" },
          { index: 22, label: " เพิ่มประเภทวัสดุ" },
          { index: 23, label: " แก้ไขประเภทวัสดุ" },
        ]
      },
      // {
      //   name: "การจัดการคลัง",
      //   permissions: [
      //     { index: 24, label: "จัดการประเภทวัสดุ" },
      //     { index: 25, label: "เพิ่มประเภทวัสดุ" },
      //     { index: 26, label: "แก้ไขประเภทวัสดุ" },
      //   ]
      // },
      {
        name: "การจัดการหน่วย",
        permissions: [
          { index: 30, label: " จัดการหน่วย" },
          { index: 31, label: " เพิ่มหน่วย" },
          { index: 32, label: " แก้ไขหน่วย" },
        ]
      },
      {
        name: "การจัดการตำแหน่ง",
        permissions: [
          { index: 33, label: " จัดการตำแหน่ง" },
          { index: 34, label: " เพิ่มจัดการตำแหน่ง" },
          { index: 35, label: " แก้ไขจัดการตำแหน่ง" },
        ]
      },
      {
        name: "การจัดการเช่า",
        permissions: [
          { index: 36, label: " การเช่า" },
          { index: 37, label: " เพิ่มการเช่า" },
        ]
      },
      {
        name: "การจัดการประเภทคำร้อง",
        permissions: [
          { index: 38, label: " จัดการประเภทคำร้อง" },
          { index: 39, label: " เพิ่มประเภทคำร้อง" },
          { index: 40, label: " แก้ไขประเภทคำร้อง" },
        ]
      },
    ]);

    const isRoleInvalid = computed(() => validatedTooltip.value && roleName.value.trim() === "");
    const roleErrorMessage = computed(() => (roleName.value.trim() === "" ? "กรุณากรอกชื่อบทบาท" : ""));

    const handleSubmitRole = (event) => {
      validatedTooltip.value = true;
      if (isRoleInvalid.value) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        handleSubmit();
      }
    };

    const handleSubmit = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "/api/auth/registerRole",
          {
            role_Name: roleName.value,
            permission_name: permissionsBinary.value
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        createToast("Success", response.data.message);
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        let errorMessage = "เกิดข้อผิดพลาดในการลงทะเบียนบทบาท";
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        }
        createToast("Error", errorMessage);
      }
    };

    const fetchAutoID = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getAutoRoleID", {
          headers: { Authorization: `Bearer ${token}` },
        });
        autoID.value = response.data;
      } catch (error) {
        handleFetchError(error, "ดึงข้อมูล ID เกิดข้อผิดพลาด:");
      }
    };

    const createToast = (title, content) => {
      toasts.value.push({ title, content });
      setTimeout(() => {
        toasts.value.shift();
      }, 5000);
    };

    const updatePermissions = () => {
      let binary = Array(41).fill(0);
      selectedPermissions.value.forEach((index) => {
        binary[index] = 1;
      });
      binary[0] = 1;
      binary[1] = 1;
      permissionsBinary.value = binary.join("");
    };

    onMounted(() => {
      fetchAutoID();
      updatePermissions();
    });

    watch(selectedPermissions, updatePermissions);

    return {
      autoID,
      roleName,
      validatedTooltip,
      handleSubmitRole,
      isRoleInvalid,
      roleErrorMessage,
      toasts,
      permissionsCategories,
      selectedPermissions,
      permissionsBinary,
      updatePermissions
    };
  }
};
</script>
