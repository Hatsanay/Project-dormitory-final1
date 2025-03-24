<template>
  <div>
    <WidgetsStatsD class="mb-4" />
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>แก้ไขข้อมูลบทบาท</CCardHeader>
          <CCardBody>
            <CForm class="row g-3 needs-validation" novalidate @submit="handleSubmitRole">
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="2">
                    <CFormLabel for="role_ID">รหัสบทบาท</CFormLabel>
                    <CFormInput v-model="role_ID" type="text" id="role_ID" disabled />
                  </CCol>
                  <CCol md="3" class="position-relative">
                    <CFormLabel for="role_Name">ชื่อบทบาท</CFormLabel>
                    <CFormInput
                      v-model="role_Name"
                      type="text"
                      id="role_Name"
                      required
                      :class="{ 'is-invalid': isRoleNameInvalid }"
                    />
                    <CFormFeedback invalid>{{ roleErrorMessage }}</CFormFeedback>
                  </CCol>
                </CRow>
              </CCol>

              <CRow class="mb-3">
                <CCol md="12">
                  <CFormLabel>กำหนดสิทธิ์:</CFormLabel>
                  <template
                    v-for="(category, catIndex) in permissionsCategories"
                    :key="catIndex"
                  >
                    <h6 class="mt-3">{{ category.name }}</h6>
                    <CRow>
                      <template
                        v-for="(permission, index) in category.permissions"
                        :key="index"
                      >
                        <CCol md="3">
                          <CFormCheck
                            :id="'permission' + permission.index"
                            :value="1"
                            :checked="selectedPermissions[permission.index] === 1"
                            @change="togglePermission(permission.index)"
                            :disabled="permission.index < 2"
                          />
                          <CFormLabel :for="'permission' + permission.index">{{
                            permission.label
                          }}</CFormLabel>
                        </CCol>
                      </template>
                    </CRow>
                  </template>
                </CCol>
              </CRow>
              <CButton type="submit" color="primary" :disabled="isRoleNameInvalid"
                >บันทึก</CButton
              >
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
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "EditRoleComponent",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const role_ID = ref(route.query.id || "");
    const permissionname = ref("");
    const role_Name = ref("");
    const selectedPermissions = ref(Array(41).fill(0));
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
        ],
      },
      {
        name: "การแจ้งซ่อมและการซ่อมบำรุง",
        permissions: [
          { index: 6, label: " ประวัติการแจ้งซ่อม" },
          { index: 7, label: " ส่งคำร้องแจ้งซ่อม" },
          { index: 8, label: " คำขอร้องแจ้งซ่อม" },
          { index: 9, label: " รับคำขอร้องแจ้งซ่อม" },
          { index: 10, label: " การเบิกวัสดุ" },
          { index: 11, label: " นัดเวลาเข้าซ่อม" },
        ],
      },
      {
        name: "การจัดการผู้ใช้งาน",
        permissions: [
          { index: 12, label: " จัดการผู้ใช้งาน" },
          { index: 13, label: " เพิ่มผู้ใช้งาน" },
          { index: 14, label: " แก้ไขผู้ใช้งาน" },
        ],
      },
      {
        name: "การจัดการห้องพัก",
        permissions: [
          { index: 15, label: " จัดการห้องพัก" },
          { index: 16, label: " เพิ่มห้องพัก" },
          { index: 17, label: " แก้ไขห้องพัก" },
        ],
      },
      {
        name: "การจัดการคลัง",
        permissions: [
          { index: 18, label: " จัดการคลังวัสดุ" },
          { index: 19, label: " เพิ่มคลังวัสดุ" },
          { index: 20, label: " แก้ไขคลังวัสดุ" },
        ],
      },
      {
        name: "การจัดการคลัง",
        permissions: [
          { index: 21, label: " จัดการประเภทวัสดุ" },
          { index: 22, label: " เพิ่มประเภทวัสดุ" },
          { index: 23, label: " แก้ไขประเภทวัสดุ" },
        ],
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
        ],
      },
      {
        name: "การจัดการตำแหน่ง",
        permissions: [
          { index: 33, label: " จัดการตำแหน่ง" },
          { index: 34, label: " เพิ่มจัดการตำแหน่ง" },
          { index: 35, label: " แก้ไขจัดการตำแหน่ง" },
        ],
      },
      {
        name: "การจัดการเช่า",
        permissions: [
          { index: 36, label: " การเช่า" },
          { index: 37, label: " เพิ่มการเช่า" },
        ],
      },
      {
        name: "การจัดการประเภทคำร้อง",
        permissions: [
          { index: 38, label: " จัดการประเภทคำร้อง" },
          { index: 39, label: " เพิ่มประเภทคำร้อง" },
          { index: 40, label: " แก้ไขประเภทคำร้อง" },
        ],
      },
    ]);

    const isRoleNameInvalid = computed(() => role_Name.value.trim() === "");
    const roleErrorMessage = computed(() =>
      role_Name.value.trim() === "" ? "กรุณากรอกชื่อบทบาท" : ""
    );

    const handleSubmitRole = async (event) => {
      event.preventDefault();
      if (isRoleNameInvalid.value) return;

      try {
        const payload = {
          role_name: role_Name.value,
          permission_name: selectedPermissions.value.join(""),
        };
        await axios.put(
          `/api/auth/updateRole?role_ID=${role_ID.value}&permission_ID=${permissionname.value}`,
          payload
        );
        toasts.value.push({ title: "สำเร็จ", content: "ข้อมูลถูกบันทึกเรียบร้อยแล้ว" });
        setTimeout(() => router.push("ViewRoleView"), 1000);
      } catch (error) {
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        });
      }
    };

    const fetchRoleByID = async (rid) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getRoleByID", {
          params: { ID: rid },
          headers: { Authorization: `Bearer ${token}` },
        });
        const roleData = response.data;
        role_Name.value = roleData.role_Name || "";
        permissionname.value = roleData.role_permissions || "";
        selectedPermissions.value = roleData.permission_name
          .split("")
          .map((bit) => parseInt(bit));
      } catch (error) {
        toasts.value.push({ title: "ข้อผิดพลาด", content: "ไม่สามารถดึงข้อมูลบทบาทได้" });
      }
    };

    const togglePermission = (index) => {
      if (index < 2) return; // ล็อค index 0 และ 1 ให้อยู่เสมอ
      selectedPermissions.value[index] = selectedPermissions.value[index] === 1 ? 0 : 1;
    };

    onMounted(() => {
      fetchRoleByID(role_ID.value);
      selectedPermissions.value[0] = 1;
      selectedPermissions.value[1] = 1;
    });

    return {
      role_ID,
      role_Name,
      permissionsCategories,
      selectedPermissions,
      toasts,
      handleSubmitRole,
      isRoleNameInvalid,
      roleErrorMessage,
      togglePermission,
      permissionname,
    };
  },
};
</script>
