<template>
  <div>
    <h2>กำหนดวันหยุดประจำสัปดาห์</h2>

    <div class="form-group">
      <label>เลือกพนักงาน:</label>
      <CFormSelect v-model="selectedUser" @change="loadUserHolidays">
        <option value="">เลือกพนักงาน</option>
        <option v-for="user in users" :key="user.user_ID" :value="user.user_ID">
          {{ user.fullname }}
        </option>
      </CFormSelect>
    </div>

    <div class="form-group">
      <label>เลือกวันหยุด (เลือกได้ 2 วัน):</label>
      <div class="day-checkboxes">
        <label v-for="day in weekDays" :key="day.value">
          <input
            type="checkbox"
            :value="day.value"
            v-model="selectedDays"
            :disabled="selectedDays.length === 2 && !selectedDays.includes(day.value)"
          />
          {{ day.label }}
        </label>
      </div>
    </div>

    <CButton color="primary" @click="saveWeeklyHoliday">บันทึก</CButton>

    <h3 class="mt-4">รายชื่อพนักงานและวันหยุด</h3>
    <table class="table">
      <thead>
        <tr>
          <th>ชื่อพนักงาน</th>
          <th>วันหยุด</th>
          <!-- <th>จัดการ</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in holidays" :key="entry.user_ID">
          <td>{{ entry.fullname }}</td>
          <td>{{ formatDays(entry.days_off) }}</td>
          <!-- <td>
            <CButton color="warning" @click="editHoliday(entry)">แก้ไข</CButton>
            <CButton color="danger" @click="deleteHoliday(entry.user_ID)">ลบ</CButton>
          </td> -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { CFormSelect, CButton } from '@coreui/vue'

export default {
  name: 'WeeklyHoliday',
  components: { CFormSelect, CButton },
  setup() {
    const selectedUser = ref('')
    const selectedDays = ref([])
    const users = ref([])
    const holidays = ref([])

    const weekDays = [
      { label: 'จันทร์', value: 'Monday' },
      { label: 'อังคาร', value: 'Tuesday' },
      { label: 'พุธ', value: 'Wednesday' },
      { label: 'พฤหัสบดี', value: 'Thursday' },
      { label: 'ศุกร์', value: 'Friday' },
      { label: 'เสาร์', value: 'Saturday' },
      { label: 'อาทิตย์', value: 'Sunday' },
    ]

    // ตรวจสอบว่า checkbox ควรจะ disable หรือไม่
    const isDayDisabled = computed(() => {
      return (dayValue) => selectedDays.value.length === 2 && !selectedDays.value.includes(dayValue)
    })

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('/api/auth/getUserForHoliday', {
          headers: { Authorization: `Bearer ${token}` },
        })
        users.value = response.data
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    const fetchHolidays = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.error('No token found')
          return
        }

        const response = await axios.get('/api/auth/getWeeklyHolidays', {
          headers: { Authorization: `Bearer ${token}` },
        })

        console.log('Holidays Data:', response.data) // ✅ ตรวจสอบค่าที่ API ส่งกลับมา
        holidays.value = response.data
      } catch (error) {
        console.error('Error fetching holidays:', error.response?.data || error.message)
      }
    }

    const saveWeeklyHoliday = async () => {
      if (!selectedUser.value || selectedDays.value.length !== 2) {
        Swal.fire({
          icon: 'warning',
          title: 'กรุณาเลือกพนักงานและกำหนดวันหยุด 2 วัน',
          confirmButtonText: 'ตกลง',
        })
        return
      }

      try {
        await axios.post(
          '/api/auth/setWeeklyHoliday',
          {
            user_ID: selectedUser.value,
            days_off: selectedDays.value,
          },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
        )

        Swal.fire({
          icon: 'success',
          title: 'บันทึกวันหยุดสำเร็จ',
          confirmButtonText: 'ตกลง',
        })
        window.location.reload();
        selectedUser.value = ''
        selectedDays.value = []
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: error.response?.data?.error || 'ไม่สามารถบันทึกวันหยุดได้',
          confirmButtonText: 'ตกลง',
        })
      }
    }
    const formatDays = (days) => {
  if (!days) return '-' // ถ้าไม่มีข้อมูลให้คืนค่า '-'
  
  let daysArray
  try {
    daysArray = typeof days === 'string' ? JSON.parse(days) : days
  } catch (error) {
    console.error('Error parsing days_off:', days)
    return '-'
  }

  if (!Array.isArray(daysArray)) return '-' // ✅ ป้องกัน Error ถ้า daysArray ไม่ใช่ Array

  return daysArray
    .map((day) => weekDays.find((d) => d.value === day)?.label || day)
    .join(', ')
}

    onMounted(() => {
      fetchUsers()
      fetchHolidays()
    })

    return {
      selectedUser,
      selectedDays,
      users,
      holidays,
      weekDays,
      isDayDisabled,
      saveWeeklyHoliday,
      formatDays,
    }
  },
}
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}
.day-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.day-checkboxes label {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
