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
              @submit="handleSubmitTooltip01"
            >
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="2">
                    <CFormLabel for="resId">รหัส</CFormLabel>
                    <CFormInput v-model="autoID" type="text" id="resId" disabled />
                  </CCol>
                  <CCol md="5" class="position-relative">
                    <CFormLabel for="resFname">ชื่อ</CFormLabel>
                    <CFormInput v-model="resFname" type="text" id="resFname" disabled />
                  </CCol>
                  <CCol md="5">
                    <CFormLabel for="resLname">นามสกุล</CFormLabel>
                    <CFormInput v-model="resLname" type="text" id="resLname" disabled />
                  </CCol>
                  <CCol md="7">
                    <CFormLabel for="resEmail">อีเมล์</CFormLabel>
                    <CFormInput v-model="resEmail" type="email" id="resEmail" disabled />
                  </CCol>
                  <CCol md="5">
                    <CFormLabel for="resPhone">เบอร์โทร</CFormLabel>
                    <CFormInput v-model="resPhone" type="text" id="resPhone" disabled />
                  </CCol>
                  <CCol md="6">
                    <CFormLabel for="resName">Username</CFormLabel>
                    <CFormInput v-model="resName" type="text" id="resName" disabled />
                  </CCol>
                  <CCol md="6">
                    <!-- <CFormLabel for="resPassword">Password</CFormLabel>
                    <CFormInput
                      v-model="resPassword"
                      type="password"
                      id="resPassword"
                      disabled
                    /> -->
                  </CCol>

                  <CCol md="2">
                    <CFormLabel for="resHnumber">เลขที่</CFormLabel>
                    <CFormInput
                      v-model="resHnumber"
                      type="text"
                      id="resHnumber"
                      disabled
                    />
                  </CCol>
                  <CCol md="2">
                    <CFormLabel for="resGroup">หมู่</CFormLabel>
                    <CFormInput v-model="resGroup" type="text" id="resGroup" disabled />
                  </CCol>
                  <CCol md="4">
                    <CFormLabel for="resAlley">ซอย</CFormLabel>
                    <CFormInput v-model="resAlley" type="text" id="resAlley" disabled />
                  </CCol>
                  <CCol md="4">
                    <CFormLabel for="resRoad">ถนน</CFormLabel>
                    <CFormInput v-model="resRoad" type="text" id="resRoad" disabled />
                  </CCol>

                  <CCol md="3">
                    <CFormLabel for="resProvinces">จังหวัด</CFormLabel>
                    <CFormInput
                      v-model="resProvinces"
                      type="text"
                      id="resProvinces"
                      disabled
                    />
                  </CCol>
                  <CCol md="3">
                    <CFormLabel for="resAmphures">อำเภอ/เขต</CFormLabel>
                    <CFormInput
                      v-model="resAmphures"
                      type="text"
                      id="resAmphures"
                      disabled
                    />
                  </CCol>
                  <CCol md="3">
                    <CFormLabel for="resTambons">ตำบล/แขวง</CFormLabel>
                    <CFormInput
                      v-model="resTambons"
                      type="text"
                      id="resTambons"
                      disabled
                    />
                  </CCol>

                  <CCol md="3">
                    <CFormLabel for="resPost">รหัสไปรษณีย์</CFormLabel>
                    <CFormInput v-model="resPost" type="text" id="resPost" disabled />
                    <CFormFeedback invalid>
                      {{ resPostErrorMessage }}
                    </CFormFeedback>
                  </CCol>

                  <CCol md="6">
                    <CFormLabel for="resBdate">เลือกวันที่</CFormLabel>
                    <Datepicker
                      v-model="resBdate"
                      :type="'date'"
                      :format="'yyyy-MM-dd'"
                      id="resBdate"
                      disabled
                    />
                  </CCol>
                  <CCol md="3">
                    <CFormLabel for="resRole">ตำแหน่ง</CFormLabel>
                    <CFormInput v-model="resRole" type="text" id="resRole" disabled />
                  </CCol>
                  <CCol md="3">
                    <CFormLabel for="resStatus">สถานะ</CFormLabel>
                    <CFormInput v-model="resStatus" type="text" id="resStatus" disabled />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel for="resAddDate">วันที่เพิ่ม</CFormLabel>
                    <Datepicker
                      v-model="resAddDate"
                      :type="'date'"
                      :format="'yyyy-MM-dd'"
                      id="resAddDate"
                      disabled
                    />
                  </CCol>
                  <CCol md="3">
                    <CFormLabel for="resEditDate">วันที่แก้ไขล่าสุด</CFormLabel>
                    <Datepicker
                      v-model="resEditDate"
                      :type="'date'"
                      :format="'yyyy-MM-dd'"
                      id="resEditDate"
                      disabled
                    />
                  </CCol>
                  
                </CRow>
              </CCol>
              <!-- <CButton type="submit" color="primary" disabled>บันทึก</CButton> -->
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

export default {
  name: "modelViewRegisComponents",
  components: {
    Datepicker,
  },
  props: {
    selectedUser: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const selectedDate = ref(props.selectedUser?.birthdate || null);
    const autoID = ref(props.selectedUser?.user_ID || "");
    const resFname = ref(props.selectedUser?.user_Fname || "");
    const resLname = ref(props.selectedUser?.user_Lname || "");
    const resEmail = ref(props.selectedUser?.user_Email || "");
    const resPhone = ref(props.selectedUser?.user_Phone || "");
    const resName = ref(props.selectedUser?.user_Name || "");
    const resPassword = ref(props.selectedUser?.user_Password || "");
    const resBdate = ref(props.selectedUser?.user_Bdate || "");
    const resHnumber = ref(props.selectedUser?.user_Hnumber || "");
    const resGroup = ref(props.selectedUser?.user_Group || "");
    const resAlley = ref(props.selectedUser?.user_Alley || "");
    const resRoad = ref(props.selectedUser?.user_Road || "");
    const resProvinces = ref(props.selectedUser?.user_Provinces || "");
    const resAmphures = ref(props.selectedUser?.user_Amphures || "");
    const resTambons = ref(props.selectedUser?.user_Tambons || "");
    const resPost = ref(props.selectedUser?.user_Zipcode || "");
    const resRole = ref(props.selectedUser?.roleName || "");
    const resStatus = ref(props.selectedUser?.stat_Name || "");
    const resAddDate = ref(props.selectedUser?.user_DateAdd || "");
    const resEditDate = ref(props.selectedUser?.user_DateEdit || "");

    watch(
      () => props.selectedUser,
      (newUser) => {
        console.log("New selectedUser:", newUser);
        selectedDate.value = newUser?.birthdate || null;
        autoID.value = newUser?.user_ID || "";
        resFname.value = newUser?.user_Fname || "";
        resLname.value = newUser?.user_Lname || "";
        resEmail.value = newUser?.user_Email || "";
        resPhone.value = newUser?.user_Phone || "";
        resName.value = newUser?.user_Name || "";
        resPassword.value = newUser?.user_Password || "";
        resBdate.value = newUser?.user_Bdate || "";
        resHnumber.value = newUser?.user_Hnumber || "";
        resGroup.value = newUser?.user_Group || "";
        resAlley.value = newUser?.user_Alley || "";
        resRoad.value = newUser?.user_Road || "";
        resProvinces.value = newUser?.user_Provinces || "";
        resAmphures.value = newUser?.user_Amphures || "";
        resTambons.value = newUser?.user_Tambons || "";
        resPost.value = newUser?.user_Zipcode || "";
        resRole.value = newUser?.roleName || "";
        resStatus.value = newUser?.stat_Name || "";
        resAddDate.value = newUser?.user_DateAdd || "";
        resEditDate.value = newUser?.user_DateEdit || "";
      },
      { immediate: true }
    );

    return {
      selectedDate,
      autoID,
      resFname,
      resLname,
      resEmail,
      resPhone,
      resName,
      resPassword,
      resBdate,
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
      resAddDate,
      resEditDate,
    };
  },
};
</script>
