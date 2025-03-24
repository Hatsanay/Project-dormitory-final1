<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>แก้ไขข้อมูลผู้ใช้งาน</CCardHeader>
          <CCardBody>
            <CForm
              class="row g-3 needs-validation"
              novalidate
              @submit="handleSubmitTooltip01"
            >
              <CCol md="2">
                <CFormLabel for="resId">รหัส</CFormLabel>
                <CFormInput v-model="userId" type="text" id="resId" disabled />
              </CCol>

              <CCol md="5">
                <CFormLabel for="resFname">ชื่อ</CFormLabel>
                <CFormInput
                  v-model="resFname"
                  type="text"
                  id="resFname"
                  required
                  :class="{ 'is-invalid': isFnameInvalid }"
                />
                <CFormFeedback invalid>
                  {{ fnameErrorMessage }}
                </CFormFeedback>
              </CCol>

              <CCol md="5">
                <CFormLabel for="resLname">นามสกุล</CFormLabel>
                <CFormInput
                  v-model="resLname"
                  type="text"
                  id="resLname"
                  required
                  :class="{ 'is-invalid': isLnameInvalid }"
                />
                <CFormFeedback invalid>
                  {{ lnameErrorMessage }}
                </CFormFeedback>
              </CCol>

              <CCol md="7">
                <CFormLabel for="resEmail">อีเมล์</CFormLabel>
                <CFormInput
                  v-model="resEmail"
                  type="email"
                  id="resEmail"
                  required
                  :class="{ 'is-invalid': isEmailInvalid }"
                />
                <CFormFeedback invalid>
                  {{ emailErrorMessage }}
                </CFormFeedback>
              </CCol>

              <CCol md="5">
                <CFormLabel for="resPhone">เบอร์โทร</CFormLabel>
                <CFormInput
                  v-model="resPhone"
                  type="text"
                  id="resPhone"
                  required
                  :class="{ 'is-invalid': isPhoneInvalid }"
                />
                <CFormFeedback invalid>
                  {{ phoneErrorMessage }}
                </CFormFeedback>
              </CCol>

              <!-- <CCol md="6">
                <CFormLabel for="resName">Username</CFormLabel>
                <CFormInput
                  v-model="resName"
                  type="text"
                  id="resName"
                  required
                  :class="{ 'is-invalid': isNameInvalid }"
                />
                <CFormFeedback invalid>
                  {{ nameErrorMessage }}
                </CFormFeedback>
              </CCol> -->

              <CCol md="6">
                <CFormLabel for="resName">Username</CFormLabel>
                <CInputGroup class="mb-3">
                  <CFormInput
                    v-model="resName"
                    type="text"
                    id="resName"
                    :disabled="!isUsernameEditable"
                    aria-describedby="resName"
                  />
                  <CButton @click="toggleUsernameEditable" color="primary">
                    {{ isUsernameEditable ? "ปิดการแก้ไข" : "แก้ไข" }}
                  </CButton>
                </CInputGroup>
              </CCol>

              <CCol md="6">
                <CFormLabel for="resPassword">Password</CFormLabel>
                <CInputGroup class="mb-3">
                  <CFormInput
                    v-model="resPassword"
                    type="password"
                    id="resPassword"
                    :disabled="!isPasswordEditable"
                    aria-describedby="resPassword"
                  />
                  <CButton @click="togglePasswordEditable" color="primary">
                    {{ isPasswordEditable ? "ปิดการแก้ไข" : "แก้ไข" }}
                  </CButton>
                </CInputGroup>
              </CCol>

              <CCol md="2">
                <CFormLabel for="resHnumber">เลขที่</CFormLabel>
                <CFormInput
                  v-model="resHnumber"
                  type="text"
                  id="resHnumber"
                  required
                  :class="{ 'is-invalid': isHnumberInvalid }"
                />
                <CFormFeedback invalid>
                  {{ HnumberErrorMessage }}
                </CFormFeedback>
              </CCol>

              <CCol md="2">
                <CFormLabel for="resGroup">หมู่</CFormLabel>
                <CFormInput
                  v-model="resGroup"
                  type="text"
                  id="resGroup"
                  required
                  :class="{ 'is-invalid': isGroupInvalid }"
                />
                <CFormFeedback invalid>
                  {{ groupErrorMessage }}
                </CFormFeedback>
              </CCol>

              <CCol md="4">
                <CFormLabel for="resAlley">ซอย</CFormLabel>
                <CFormInput
                  v-model="resAlley"
                  type="text"
                  id="resAlley"
                  required
                  :class="{ 'is-invalid': isAlleyInvalid }"
                />
                <CFormFeedback invalid>
                  {{ alleyErrorMessage }}
                </CFormFeedback>
              </CCol>

              <CCol md="4">
                <CFormLabel for="resRoad">ถนน</CFormLabel>
                <CFormInput
                  v-model="resRoad"
                  type="text"
                  id="resRoad"
                  required
                  :class="{ 'is-invalid': isRoadInvalid }"
                />
                <CFormFeedback invalid>
                  {{ roadErrorMessage }}
                </CFormFeedback>
              </CCol>

              <CCol md="3">
                <CFormLabel for="resProvinces">จังหวัด</CFormLabel>
                <CFormSelect v-model="resProvinces" id="resProvinces" required>
                  <option value="">กรุณาเลือกจังหวัด</option>
                  <option
                    v-for="province in provinces"
                    :key="province.id"
                    :value="String(province.id)"
                  >
                    {{ province.name_th }}
                  </option>
                </CFormSelect>
              </CCol>

              <CCol md="3">
                <CFormLabel for="resAmphures">อำเภอ/เขต</CFormLabel>
                <CFormSelect v-model="resAmphures" id="resAmphures" required>
                  <option disabled value="">กรุณาเลือกอำเภอ/เขต</option>
                  <option
                    v-for="amphure in amphures"
                    :key="amphure.id"
                    :value="String(amphure.id)"
                  >
                    {{ amphure.name_th }}
                  </option>
                </CFormSelect>
              </CCol>

              <CCol md="3">
                <CFormLabel for="resTambons">ตำบล/แขวง</CFormLabel>
                <CFormSelect v-model="resTambons" id="resTambons" required>
                  <option disabled value="">กรุณาเลือกตำบล/แขวง</option>
                  <option
                    v-for="Tambon in Tambons"
                    :key="Tambon.id"
                    :value="String(Tambon.id)"
                  >
                    {{ Tambon.name_th }}
                  </option>
                </CFormSelect>
              </CCol>

              <CCol md="3">
                <CFormLabel for="resPost">รหัสไปรษณีย์</CFormLabel>
                <CFormInput
                  v-model="resPost"
                  type="text"
                  id="resPost"
                  required
                  :class="{ 'is-invalid': isPostInvalid }"
                />
                <CFormFeedback invalid>
                  {{ postErrorMessage }}
                </CFormFeedback>
              </CCol>

              <CCol md="6">
                <CFormLabel for="resBdate">วันเกิด</CFormLabel>
                <Datepicker
                  v-model="selectedDate"
                  :type="'date'"
                  :format="'yyyy-MM-dd'"
                  id="resBdate"
                  required
                />
              </CCol>

              <CCol md="3">
                <CFormLabel for="resRole">ตำแหน่ง</CFormLabel>
                <CFormSelect v-model="resRole" id="resRole" required>
                  <option value="">กรุณาเลือกตำแหน่ง</option>
                  <option
                    v-for="role in roles"
                    :key="role.role_id"
                    :value="String(role.role_id)"
                  >
                    {{ role.role_Name }}
                  </option>
                </CFormSelect>
              </CCol>
              <CButton type="submit" color="primary">บันทึก</CButton>
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
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

export default {
  name: "EditResView",
  components: {
    Datepicker,
  },

  setup() {
    const selectedDate = ref(null);
    const resFname = ref("");
    const resLname = ref("");
    const resEmail = ref("");
    const resPhone = ref("");
    const resName = ref("");
    const resPassword = ref("");
    const resHnumber = ref("");
    const resGroup = ref("");
    const resAlley = ref("");
    const resRoad = ref("");
    const resProvinces = ref("");
    const resAmphures = ref("");
    const resTambons = ref("");
    const resPost = ref("");
    const resRole = ref("");
    const resStatus = ref("");
    const validatedTooltip01 = ref(false);
    const toasts = ref([]);

    const provinces = ref([]);
    const amphures = ref([]);
    const Tambons = ref([]);
    const roles = ref([]);

    const route = useRoute();
    const userId = ref(route.query.id || "");
    const isPasswordEditable = ref(false);
    const isUsernameEditable = ref(false);

    const notEditUsername = ref("");

    const isFnameInvalid = computed(() => {
      return (
        validatedTooltip01.value &&
        (resFname.value.trim() === "" ||
          resFname.value.length < 2 ||
          resFname.value.length > 50)
      );
    });

    const fnameErrorMessage = computed(() => {
      if (resFname.value.trim() === "") {
        return "กรุณากรอกชื่อ";
      } else if (resFname.value.length < 2 || resFname.value.length > 50) {
        return "ชื่อควรมีความยาวระหว่าง 2 ถึง 50 ตัวอักษร";
      }
      return "";
    });

    const isLnameInvalid = computed(() => {
      return (
        validatedTooltip01.value &&
        (resLname.value.trim() === "" ||
          resLname.value.length < 2 ||
          resLname.value.length > 50)
      );
    });

    const lnameErrorMessage = computed(() => {
      if (resLname.value.trim() === "") {
        return "กรุณากรอกนามสกุล";
      } else if (resLname.value.length < 2 || resLname.value.length > 50) {
        return "นามสกุลควรมีความยาวระหว่าง 2 ถึง 50 ตัวอักษร";
      }
      return "";
    });

    const isEmailInvalid = computed(() => {
      return (
        validatedTooltip01.value &&
        (resEmail.value.trim() === "" ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resEmail.value))
      );
    });

    const emailErrorMessage = computed(() => {
      if (resEmail.value.trim() === "") {
        return "กรุณากรอกอีเมล์";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resEmail.value)) {
        return "กรุณากรอกอีเมล์ให้ถูกต้อง";
      } else if (resEmail.value.length < 2 || resEmail.value.length > 50) {
        return "อีเมล์ควรมีความยาวระหว่าง 2 ถึง 50 ตัวอักษร";
      }
      return "";
    });

    const isPhoneInvalid = computed(() => {
      return (
        validatedTooltip01.value &&
        (resPhone.value.trim() === "" || !/^\d{10}$/.test(resPhone.value))
      );
    });

    const phoneErrorMessage = computed(() => {
      if (resPhone.value.trim() === "") {
        return "กรุณากรอกเบอร์โทร";
      } else if (!/^\d{10}$/.test(resPhone.value)) {
        return "กรุณากรอกเบอร์โทรให้ถูกต้อง (10 หลัก)";
      }
      return "";
    });

    const isNameInvalid = computed(() => {
      return (
        validatedTooltip01.value &&
        (resName.value.trim() === "" ||
          resName.value.length < 3 ||
          resName.value.length > 30)
      );
    });

    const nameErrorMessage = computed(() => {
      if (resName.value.trim() === "") {
        return "กรุณากรอกชื่อผู้ใช้";
      } else if (resName.value.length < 3 || resName.value.length > 30) {
        return "ชื่อผู้ใช้ควรมีความยาวระหว่าง 3 ถึง 30 ตัวอักษร";
      }
      return "";
    });

    const isPasswordInvalid = computed(() => {
      return (
        validatedTooltip01.value &&
        resPassword.value.trim() !== "" &&
        resPassword.value.length < 6
      );
    });

    const passwordErrorMessage = computed(() => {
      if (resPassword.value.trim() !== "" && resPassword.value.length < 6) {
        return "รหัสผ่านควรมีความยาวอย่างน้อย 6 ตัวอักษร";
      }
      return "";
    });

    const isHnumberInvalid = computed(() => {
      return validatedTooltip01.value && resHnumber.value.trim() === "";
    });
    const HnumberErrorMessage = computed(() => {
      if (resHnumber.value.trim() === "") {
        return "กรุณากรอกเลขที่";
      }
      return "";
    });

    const isGroupInvalid = computed(() => {
      return validatedTooltip01.value && resGroup.value.trim() === "";
    });
    const groupErrorMessage = computed(() => {
      if (resGroup.value.trim() === "") {
        return "กรุณากรอกหมู่";
      }
      return "";
    });

    const isAlleyInvalid = computed(() => {
      return validatedTooltip01.value && resAlley.value.trim() === "";
    });
    const alleyErrorMessage = computed(() => {
      if (resAlley.value.trim() === "") {
        return "กรุณากรอกซอย";
      }
      return "";
    });

    const isRoadInvalid = computed(() => {
      return validatedTooltip01.value && resRoad.value.trim() === "";
    });
    const roadErrorMessage = computed(() => {
      if (resRoad.value.trim() === "") {
        return "กรุณากรอกถนน";
      }
      return "";
    });

    const isPostInvalid = computed(() => {
      return (
        validatedTooltip01.value &&
        typeof resPost.value === "string" &&
        resPost.value.trim() === ""
      );
    });

    const postErrorMessage = computed(() => {
      if (typeof resPost.value === "string" && resPost.value.trim() === "") {
        return "กรุณากรอกรหัสไปรษณีย์";
      }
      return "";
    });

    const handleSubmitTooltip01 = async (event) => {
      validatedTooltip01.value = true;
      if (
        isFnameInvalid.value ||
        isLnameInvalid.value ||
        isEmailInvalid.value ||
        isPhoneInvalid.value ||
        isNameInvalid.value ||
        isHnumberInvalid.value ||
        isGroupInvalid.value ||
        isAlleyInvalid.value ||
        isRoadInvalid.value ||
        isPostInvalid.value ||
        isPasswordInvalid.value
      ) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        try {
          const payload = {
            userFname: resFname.value,
            userLname: resLname.value,
            userEmail: resEmail.value,
            userPhone: resPhone.value,
            userHnumber: resHnumber.value,
            userGroup: resGroup.value,
            userAlley: resAlley.value,
            userRoad: resRoad.value,
            user_ProvincesID: resProvinces.value,
            user_AmphuresID: resAmphures.value,
            user_TambonsID: resTambons.value,
            userPost: resPost.value,
            userBdate: selectedDate.value,
            userRole_ID: resRole.value,
            userStatus_ID: resStatus.value,
            username: resName.value,
          };

          // if (resName.value.trim() !== "") {
          //   payload.username = resName.value;
          // }
          if (resName.value == notEditUsername.value) {
            payload.username = notEditUsername.value;
          }
          if (resPassword.value.trim() !== "") {
            payload.password = resPassword.value;
          }

          await axios.put(`/api/auth/updateUser?userID=${userId.value}`, payload);
          toasts.value.push({
            title: "สำเร็จ",
            content: "ข้อมูลถูกบันทึกเรียบร้อยแล้ว",
          });
          setTimeout(() => {
            this.$router.push("/ViewResident");
          }, 1000);
        } catch (error) {
          toasts.value.push({
            title: "ข้อผิดพลาด",
            content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
          });
        }
      }
    };

    const fetchUserById = async (uid) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getUserById", {
          params: { id: uid },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data;
        resFname.value = userData.user_Fname || "";
        resLname.value = userData.user_Lname || "";
        resEmail.value = userData.user_Email || "";
        resPhone.value = userData.user_Phone || "";
        resName.value = userData.user_Name || "";
        resPassword.value = "";
        resHnumber.value = userData.user_Hnumber || "";
        resGroup.value = userData.user_Group || "";
        resAlley.value = userData.user_Alley || "";
        resRoad.value = userData.user_Road || "";
        resProvinces.value = userData.user_Provinces_ID || "";
        resAmphures.value = userData.user_Amphures_ID || "";
        resTambons.value = userData.user_Tambons_ID || "";
        resPost.value = String(response.data.zip_code || "");
        resStatus.value = userData.user_Status_ID || "";
        selectedDate.value = userData.user_Bdate ? new Date(userData.user_Bdate) : null;
        notEditUsername.value = userData.user_Name || "";
        await fetchRole();
        resRole.value = userData.user_Role_ID || "";

        if (resProvinces.value) {
          await fetchAmphures();
        }
        if (resAmphures.value) {
          await fetchTambons();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const togglePasswordEditable = () => {
      isPasswordEditable.value = !isPasswordEditable.value;
    };

    const toggleUsernameEditable = () => {
      isUsernameEditable.value = !isUsernameEditable.value;
    };

    const fetchZipcode = async (tambonsId) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getZipcode", {
          params: { tambonId: tambonsId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resPost.value = response.data.zip_code || "";
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงรหัสไปรษณีย์:", error);
        resPost.value = "";
      }
    };

    const fetchProvince = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getProvince", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        provinces.value = response.data;
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลจังหวัด:", error);
      }
    };

    const fetchAmphures = async () => {
      if (!resProvinces.value) return;

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getAmphures", {
          params: { provinceId: resProvinces.value },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        amphures.value = response.data;
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลอำเภอ/เขต:", error);
      }
    };

    const fetchTambons = async () => {
      if (!resAmphures.value) return;

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getTambons", {
          params: { amphureId: resAmphures.value },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Tambons.value = response.data;
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลตำบล/แขวง:", error);
      }
    };

    const fetchRole = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getRole", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        roles.value = response.data;
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    // const fetchUserById = async (uid) => {
    //   try {
    //     const token = localStorage.getItem("token");
    //     const response = await axios.get("/api/auth/getUserById", {
    //       params: { id: uid },
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });

    //     const userData = response.data;
    //     resFname.value = userData.user_Fname || "";
    //     resLname.value = userData.user_Lname || "";
    //     resEmail.value = userData.user_Email || "";
    //     resPhone.value = userData.user_Phone || "";
    //     resName.value = userData.user_Name || "";
    //     resPassword.value = ""; // Clear password field
    //     resHnumber.value = userData.user_Hnumber || "";
    //     resGroup.value = userData.user_Group || "";
    //     resAlley.value = userData.user_Alley || "";
    //     resRoad.value = userData.user_Road || "";
    //     resProvinces.value = userData.user_Provinces_ID || "";
    //     resAmphures.value = userData.user_Amphures_ID || "";
    //     resTambons.value = userData.user_Tambons_ID || "";
    //     resPost.value = String(response.data.zip_code || "");
    //     selectedDate.value = userData.user_Bdate ? new Date(userData.user_Bdate) : null;
    //     await fetchRole();
    //     resRole.value = userData.user_Role_ID || "";

    //     if (resProvinces.value) {
    //       await fetchAmphures();
    //     }
    //     if (resAmphures.value) {
    //       await fetchTambons();
    //     }
    //   } catch (error) {
    //     console.error("Error fetching user data:", error);
    //   }
    // };

    onMounted(() => {
      fetchProvince();
      fetchRole();
      fetchUserById(userId.value);
    });

    watch(resProvinces, () => {
      fetchAmphures();
    });

    watch(resAmphures, () => {
      fetchTambons();
    });

    watch(resTambons, async () => {
      if (resTambons.value) {
        await fetchZipcode(resTambons.value);
      }
    });

    return {
      selectedDate,
      resFname,
      resLname,
      resEmail,
      resPhone,
      resName,
      resPassword,
      resHnumber,
      resGroup,
      resAlley,
      resRoad,
      resProvinces,
      resAmphures,
      resTambons,
      resPost,
      resRole,
      resStatus,
      roles,
      toasts,
      validatedTooltip01,
      handleSubmitTooltip01,
      provinces,
      amphures,
      Tambons,
      isFnameInvalid,
      fnameErrorMessage,
      isLnameInvalid,
      lnameErrorMessage,
      isEmailInvalid,
      emailErrorMessage,
      isPhoneInvalid,
      phoneErrorMessage,
      isNameInvalid,
      nameErrorMessage,
      isPasswordInvalid,
      passwordErrorMessage,
      isHnumberInvalid,
      HnumberErrorMessage,
      isGroupInvalid,
      groupErrorMessage,
      isAlleyInvalid,
      alleyErrorMessage,
      isRoadInvalid,
      roadErrorMessage,
      isPostInvalid,
      postErrorMessage,
      fetchAmphures,
      fetchTambons,
      fetchRole,
      userId,
      isUsernameEditable,
      toggleUsernameEditable,
      isPasswordEditable,
      togglePasswordEditable,
      notEditUsername,
    };
  },
};
</script>
