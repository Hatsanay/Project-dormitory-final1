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
              @submit="handleSubmitRole"
            >
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="3">
                    <CFormLabel for="role_ID">รหัสบทบาท</CFormLabel>
                    <CFormInput v-model="role_ID" type="text" id="role_ID" disabled />
                  </CCol>
                  <CCol md="9">
                    <CFormLabel for="roleSta">สถานะบทบาท</CFormLabel>
                    <CFormSelect v-model="roleSta" id="roleSta" required>
                      <option value="">กรุณาเลือกสถานะ</option>
                      <option
                        v-for="role in roles"
                        :key="role.StaUse_ID"
                        :value="String(role.StaUse_ID)"
                      >
                        {{ role.StaUse_Name }}
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
import { ref, onMounted, watch } from "vue";
import axios from "axios";

export default {
  name: "DeleteRoleComponent",
  props: {
    selectedRole: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const role_ID = ref(props.selectedRole?.role_ID || "");
    const roleSta = ref(props.selectedRole?.role_Status_ID || "");
    const roles = ref([]);
    const toasts = ref([]);

    watch(
      () => props.selectedRole,
      (newRole) => {
        role_ID.value = newRole?.role_ID || "";
        roleSta.value = newRole?.role_Status_ID || "";
      },
      { immediate: true }
    );

    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getDeletableRole", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        roles.value = response.data;
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    
    const handleSubmitRole = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          role_ID: role_ID.value,
          role_stat_ID: roleSta.value,
        };

        await axios.put("/api/auth/updateStatusRole", payload);
        toasts.value.push({
          title: "สำเร็จ",
          content: "ข้อมูลบทบาทถูกอัปเดตเรียบร้อยแล้ว",
        });
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        toasts.value.push({
          title: "ข้อผิดพลาด",
          content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        });
        console.error("Error updating role:", error);
      }
    };

    onMounted(() => {
      fetchRoles();
    });

    return {
      role_ID,
      roleSta,
      roles,
      toasts,
      handleSubmitRole,
    };
  },
};
</script>
