<template>
  <div>
    <CRow>
      <!-- <CCol :md="12" class="text-center mb-4">
        <h3 class="fw-bold text-dark">รายงาน</h3>
        <p class="text-muted">เลือกดูรายงานต่างๆ ตามความต้องการ</p>
      </CCol> -->
    </CRow>

    <!-- การจัดเรียงการ์ด 3 อันต่อแถว -->
    <CRow class="g-4">
      <CCol md="4" v-for="(report, index) in reports" :key="index">
        <CButton
          @click="goToReport(report.link)"
          class="d-block rounded-3 shadow-lg w-100 h-100 p-0 border-0"
        >
          <CCard
            :style="{
              background: `linear-gradient(145deg, ${report.bgStart}, ${report.bgEnd})`,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '20px',
              height: '350px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }"
            class="card-custom"
          >
            <div
              class="icon-background"
              :style="{
                fontSize: '12rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 0,
                opacity: 0.1,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
              }"
            >
              <i :class="report.icon" class="opacity-30"></i>
            </div>

            <CCardBody
              class="p-4 text-center text-white position-relative z-index-1 d-flex flex-column justify-content-center"
              style="height: 100%"
            >
              <CCardTitle class="w-100 mb-1">
                <!-- ลด margin-bottom ตรงนี้ -->
                <h5
                  class="fw-bold"
                  style="
                    font-size: 1.4rem;
                    line-height: 1.3;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    min-height: 3em;
                  "
                >
                  {{ report.title }}
                </h5>
              </CCardTitle>
              <CCardText
                class="w-100 mt-1"
                style="
                  font-size: 0.95rem;
                  line-height: 1.4;
                  display: flex;
                  align-items: flex-start;
                  justify-content: center;
                  min-height: 3.5em;
                "
              >
                {{ report.description }}
              </CCardText>
            </CCardBody>
          </CCard>
        </CButton>
      </CCol>
    </CRow>

    <!-- Toast สำหรับการแสดงข้อความ -->
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
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "ReportComponenst",
  setup() {
    const router = useRouter();
    const toasts = ref([]);
    const reports = ref([
      {
        title: "รายงานข้อมูลการแจ้งซ่อมตามช่วงเวลา",
        description: "ดูข้อมูลการแจ้งซ่อมตามช่วงเวลาที่เลือก",
        link: "/UserAddReqView",
        bgStart: "#007bff",
        bgEnd: "#3300CC",
        icon: "fas fa-clock",
      },
      {
        title: "รายงานข้อมูลการแจ้งซ่อมที่ยังไม่ได้รับการซ่อม",
        description: "ดูข้อมูลการแจ้งซ่อมที่ยังไม่ได้รับการซ่อม",
        link: "/report/unsolved-repairs",
        bgStart: "#28a745",
        bgEnd: "#007bff",
        icon: "fas fa-wrench",
      },
      {
        title: "รายงานการสั่งซื้อวัสดุและอุปกรณ์ตามช่วงเวลา",
        description: "ดูข้อมูลการสั่งซื้อวัสดุและอุปกรณ์ในช่วงเวลาที่เลือก",
        link: "/report/material-order-time-range",
        bgStart: "#ffc107",
        bgEnd: "#17a2b8",
        icon: "fas fa-shopping-cart",
      },
      {
        title: "รายงานการเบิกวัสดุและอุปกรณ์ตามช่วงเวลา",
        description: "ดูข้อมูลการเบิกวัสดุและอุปกรณ์ตามช่วงเวลาที่เลือก",
        link: "/report/material-usage-time-range",
        bgStart: "#17a2b8",
        bgEnd: "#ffc107",
        icon: "fas fa-tint",
      },
      {
        title: "รายงานสรุปรายจ่ายตามช่วงเวลา",
        description: "ดูข้อมูลสรุปรายจ่ายในช่วงเวลาที่เลือก",
        link: "/report/expense-summary-time-range",
        bgStart: "#fd7e14",
        bgEnd: "#e65c00",
        icon: "fas fa-money-bill-wave",
      },
    ]);

    // ฟังก์ชันในการเปลี่ยนเส้นทางไปยังหน้าที่กำหนด
    const goToReport = (link) => {
      router.push(link);
    };

    return {
      toasts,
      reports,
      goToReport,
    };
  },
};
</script>

<style scoped>
.card-custom {
  height: 350px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-custom:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.icon-background {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12rem;
  color: white;
  opacity: 0.1;
  z-index: 0;
}

.card-custom h5 {
  font-weight: bold;
  color: white;
}
</style>
