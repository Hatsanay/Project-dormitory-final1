<template>
  <div>
    <WidgetsStatsD class="mb-4" />
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>ข้อมูลบทบาท</CCardHeader>
          <CCardBody>
            <CForm class="row g-3 needs-validation" novalidate>
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="3">
                    <CFormLabel for="role_ID">รหัสบทบาท</CFormLabel>
                    <CFormInput v-model="role_ID" type="text" id="role_ID" disabled />
                  </CCol>
                  <CCol md="5" class="position-relative">
                    <CFormLabel for="role_Name">ชื่อบทบาท</CFormLabel>
                    <CFormInput
                      v-model="role_Name"
                      type="text"
                      id="role_Name"
                      required
                      :class="{ 'is-invalid': isRoleNameInvalid }"
                      disabled
                    />
                    <CFormFeedback invalid>{{ roleErrorMessage }}</CFormFeedback>
                  </CCol>
                </CRow>
              </CCol>
              <CRow class="mb-3">
                <CCol md="12">
                  <CFormLabel>กำหนดสิทธิ์:</CFormLabel>
                  <template v-for="(category, catIndex) in permissionsCategories" :key="catIndex">
                    <h6 class="mt-3">{{ category.name }}</h6>
                    <CRow>
                      <template v-for="(permission, index) in category.permissions" :key="index" >
                        <CCol md="3" > 
                          <CFormCheck disabled
                            :id="'permission' + permission.index"
                            :value="1"
                            :checked="selectedPermissions[permission.index] === 1"
                            @change="togglePermission(permission.index)"
                          />
                          <CFormLabel :for="'permission' + permission.index">{{ permission.label }}</CFormLabel>
                        </CCol>
                      </template>
                    </CRow>
                  </template>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Notifications -->
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
import { useRoute } from "vue-router";

export default {
  name: "ModelViewRoleComponents",
  props: {
    selectedRole: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const route = useRoute();
    const role_ID = ref(props.selectedRole?.role_ID || "");
    const role_Name = ref(props.selectedRole?.role_Name || "");
    const permission_ID = ref(props.selectedRole?.permission_ID || "");
    const selectedPermissions = ref(new Array(41).fill(0));
    const toasts = ref([]);
    const permissionsCategories = ref([
      // {
      //   name: "การเข้าถึงระบบ",
      //   permissions: [
      //     { index: 0, label: "ล็อคเอาท์" },
      //     { index: 1, label: "หน้าจอหลัก" }
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

    const isRoleNameInvalid = computed(() => role_Name.value.trim() === "");
    const roleErrorMessage = computed(() => {
      return role_Name.value.trim() === "" ? "กรุณากรอกชื่อบทบาท" : "";
    });

    const fetchRoleByID = async (rid) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getRoleByID", {
          params: { ID: rid },
          headers: { Authorization: `Bearer ${token}` },
        });
        const roleData = response.data;
        role_Name.value = roleData.role_Name || "";
        permission_ID.value = roleData.role_permissions || "";
        selectedPermissions.value = roleData.permission_name.split("").map((bit) => parseInt(bit));
      } catch (error) {
        console.error("Error fetching role data:", error);
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "ไม่สามารถดึงข้อมูลบทบาทได้",
        });
      }
    };

    onMounted(() => {
      fetchRoleByID(role_ID.value);
    });

    watch(
      () => props.selectedRole,
      (newRole) => {
        role_ID.value = newRole?.role_ID || "";
        role_Name.value = newRole?.role_Name || "";
        permission_ID.value = newRole?.permission_ID || "";
      },
      { immediate: true }
    );

    return {
      role_ID,
      role_Name,
      permissionsCategories,
      selectedPermissions,
      toasts,
      isRoleNameInvalid,
      roleErrorMessage,
      permission_ID,
    };
  },
};
</script>
