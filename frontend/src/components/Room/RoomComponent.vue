<template>
  <div>
    <WidgetsStatsD class="mb-4" />
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>จัดการห้องพัก</CCardHeader>
          <CCardBody>
            <CForm class="row g-2 needs-validation" novalidate @submit="handleSubmitTooltip01">
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="2">
                    <CFormLabel for="resRoomID">รหัสห้องพัก</CFormLabel>
                    <CFormInput v-model="autoID" type="text" id="resRoomID" disabled />
                  </CCol>
                  <CCol md="2">
                    <CFormLabel for="roomfloor">ชั้นห้องพัก</CFormLabel>
                    <CFormSelect v-model="roomfloor" id="roomfloor" required :class="{ 'is-invalid': isfloorInvalid }">
                      <option value>กรุณาเลือกชั้นห้องพัก</option>
                      <option v-for="floor in floors" :key="floor.floor_ID" :value="floor.floor_ID">
                        {{ floor.floor_name }}
                      </option>
                    </CFormSelect>
                    <CFormFeedback invalid>{{ FloorErrorMessage }}</CFormFeedback>
                  </CCol>
                  <CCol md="5">
                    <CFormLabel for="resRoom_Number">เลขห้อง</CFormLabel>
                    <CFormInput
                      v-model="resRoom_Number"
                      type="text"
                      id="resRoom_Number"
                      required
                      :class="{ 'is-invalid': isRoomInvalid }"
                    />
                    <CFormFeedback invalid>
                      {{ RoomErrorMessage }}
                    </CFormFeedback>
                  </CCol>
                </CRow>
                <CFormInput v-if="visable" v-model="token" type="text" id="token" />
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
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'RoomComponent',
  setup() {
    const autoID = ref('')
    const resRoom_Number = ref('')
    const validatedTooltip01 = ref(false)
    const toasts = ref([])
    const roomfloor = ref('')
    const floors = ref([])

    const isRoomInvalid = computed(() => {
      return validatedTooltip01.value && (resRoom_Number.value.trim() === '' || !/^\d{2}$/.test(resRoom_Number.value))
    })

    const isfloorInvalid = computed(() => {
      return validatedTooltip01.value && (roomfloor.value === '' || roomfloor.value == null)
    })

    const RoomErrorMessage = computed(() => {
      if (resRoom_Number.value.trim() === '') {
        return 'กรุณากรอกเลขห้อง'
      } else if (!/^\d{2}$/.test(resRoom_Number.value)) {
        return 'กรุณากรอกเลขห้องให้ถูกต้อง (2 หลัก)'
      }
      return ''
    })

    const FloorErrorMessage = computed(() => 'กรุณาเลือกชั้นห้องพัก')

    const handleSubmitTooltip01 = (event) => {
      validatedTooltip01.value = true

      if (isRoomInvalid.value || isfloorInvalid.value) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        handleSubmit()
      }
    }

    const handleSubmit = async () => {
      try {
        const response = await axios.post('/api/auth/registerRoom', {
          roomnumber: resRoom_Number.value,
          roomfloor: roomfloor.value,
        })
        createToast('Success', response.data.message)
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } catch (error) {
        let errorMessage = 'เกิดข้อผิดพลาดในการลงทะเบียนห้องพัก'
        if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error
        }
        createToast('Error', errorMessage)
        console.error('Error:', error)
      }
    }

    const createToast = (title, content) => {
      toasts.value.push({ title, content })
      setTimeout(() => {
        toasts.value.shift()
      }, 5000)
    }

    const fetchAutoID = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('/api/auth/getAutotidRoom', {
          headers: { Authorization: `Bearer ${token}` },
        })
        autoID.value = response.data
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการทำ Auto id:', error)
      }
    }

    const fetchFloor = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('/api/auth/getFloor', {
          headers: { Authorization: `Bearer ${token}` },
        })
        floors.value = response.data
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลชั้น:', error)
      }
    }

    onMounted(() => {
      fetchAutoID()
      fetchFloor()
    })

    return {
      autoID,
      resRoom_Number,
      validatedTooltip01,
      handleSubmitTooltip01,
      isRoomInvalid,
      isfloorInvalid,
      RoomErrorMessage,
      toasts,
      roomfloor,
      floors,
      FloorErrorMessage,
    }
  },
}
</script>
