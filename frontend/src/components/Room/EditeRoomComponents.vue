<template>
  <div>
    <WidgetsStatsD class="mb-4" />
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader>แก้ไขข้อมูลห้องพักอาศัย</CCardHeader>
          <CCardBody>
            <CForm class="row g-3 needs-validation" novalidate @submit="handleSubmitTooltip01">
              <CCol md="12">
                <CRow class="mb-3">
                  <CCol md="2">
                    <CFormLabel for="roomId">รหัส</CFormLabel>
                    <CFormInput v-model="roomID" type="text" id="roomId" disabled />
                  </CCol>
                  <CCol md="3">
                    <CFormLabel for="floor">ชั้น</CFormLabel>
                    <CFormInput v-model="floor" type="text" id="floor" disabled />
                  </CCol>
                  <CCol md="3" class="position-relative">
                    <CFormLabel for="roomName">เลขห้อง</CFormLabel>
                    <CFormInput
                      v-model="roomName"
                      type="text"
                      id="roomName"
                      required
                      :class="{ 'is-invalid': isRoomnameInvalid }"
                    />
                    <CFormFeedback invalid>{{ roomErrorMessage }}</CFormFeedback>
                  </CCol>
                </CRow>
              </CCol>
              <CButton type="submit" color="primary" :disabled="isRoomnameInvalid">บันทึก</CButton>
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
import '@vuepic/vue-datepicker/dist/main.css'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

export default {
  name: 'EditRoomView',
  setup() {
    const route = useRoute()
    const roomID = ref(route.query.id || '') // assuming ID comes from the query
    const roomName = ref('')
    const status = ref([])
    const staRoom = ref('')
    const floor = ref('') // Changed to ref to hold string value
    const toasts = ref([])
    const types = ref([]) // Room types
    const airs = ref([]) // Air conditioners
    const roomfloor = ref([])
    const roomtype = ref('')
    const selectAir = ref('')

    const isRoomnameInvalid = computed(() => {
      return roomName.value.trim() === '' || !/^\d{2}$/.test(roomName.value)
    })

    const roomErrorMessage = computed(() => {
      if (roomName.value.trim() === '') {
        return 'กรุณากรอกเลขห้อง'
      } else if (!/^\d{2}$/.test(roomName.value)) {
        return 'กรุณากรอกเลขห้องให้ถูกต้อง (2 หลัก)'
      }
      return ''
    })

    const handleSubmitTooltip01 = async (event) => {
      event.preventDefault() // Prevent default form submission
      if (isRoomnameInvalid.value) {
        return // Stop if validation fails
      } else {
        try {
          const payload = {
            roomnumber: roomName.value,
            roomtype: roomtype.value,
            roomfloor:roomfloor.value
          }
          await axios.put(`/api/auth/updateRoom?ID=${roomID.value}`, payload)
          toasts.value.push({
            title: 'สำเร็จ',
            content: 'ข้อมูลถูกบันทึกเรียบร้อยแล้ว',
          })
          setTimeout(() => {
            this.$router.push('ViewRoomView')
          }, 1000)
        } catch (error) {
          toasts.value.push({
            title: 'ข้อผิดพลาด',
            content: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
          })
        }
      }
    }

    const fetchRoomByID = async (rid) => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('/api/auth/getRoomByNumber', {
          params: { ID: rid },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const roomData = response.data
        roomName.value = (roomData.room_Number || '').slice(1);
        floor.value = roomData.floor_name || '' // Set floor name
        roomfloor.value = roomData.room_floor || ''
      } catch (error) {
        console.error('Error fetching room data:', error)
        toasts.value.push({
          title: 'ข้อผิดพลาด',
          content: 'ไม่สามารถดึงข้อมูลห้องได้',
        })
      }
    }



    onMounted(async () => {
      await fetchRoomByID(roomID.value)
    })

    return {
      roomID,
      roomName,
      status,
      staRoom,
      toasts,
      handleSubmitTooltip01,
      isRoomnameInvalid,
      roomErrorMessage,
      roomtype,
      selectAir,
      types,
      airs,
      floor,
      roomfloor
    }
  },
}
</script>
