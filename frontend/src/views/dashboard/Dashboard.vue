<template>
  <div>
    <ul class="nav nav-tabs">
      <li v-if="showTab1" class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === '1' }"
          @click.prevent="switchTab('1')"
          href="#"
        >
          Dashboard
        </a>
      </li>
      <li v-if="showTab2" class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === '2' }"
          @click.prevent="switchTab('2')"
          href="#"
        >
          Dashboard
        </a>
      </li>
      <li v-if="showTab3" class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === '3' }"
          @click.prevent="switchTab('3')"
          href="#"
        >
          Dashboard
        </a>
      </li>
      <li v-if="showTab4" class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === '4' }"
          @click.prevent="switchTab('4')"
          href="#"
        >
          Dashboard
        </a>
      </li>
    </ul>

    <div class="tab-content mt-3">
      <div v-if="showTab1 && activeTab === '1'" class="tab-pane active">
        <CRow>
          <CCol :md="3">
            <CCard color="primary" class="text-white mb-4">
              <CCardBody>
                <div class="text-value">{{ items.InprogressCount || 0 }}</div>
                <div>จำนวนการแจ้งซ่อมที่กำลังดำเนินการ</div>
                <small class="text-white-50">({{ items.inprogressPercent || 0 }}%)</small>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol :md="3">
            <CCard color="info" class="text-white mb-4">
              <CCardBody>
                <div class="text-value">{{ items.ScheduledCount || 0 }}</div>
                <div>จำนวนการแจ้งซ่อมที่นัดแล้ว</div>
                <small class="text-white-50">({{ items.scheduledPercent || 0 }}%)</small>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol :md="3">
            <CCard color="warning" class="text-white mb-4">
              <CCardBody>
                <div class="text-value">{{ items.CompletedCount || 0 }}</div>
                <div>จำนวนการแจ้งซ่อมที่เสร็จสิ้น</div>
                <small class="text-white-50">({{ items.completedPercent || 0 }}%)</small>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol :md="3">
            <CCard color="danger" class="text-white mb-4">
              <CCardBody>
                <div class="text-value">{{ items.TotalCount || 0 }}</div>
                <div>จำนวนการแจ้งซ่อมทั้งหมด</div>
                <small class="text-white-50">(100%)</small>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CRow>
          <CCol :md="12">
            <CCard>
              <CCardBody>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h4 id="traffic" class="card-title mb-0">จำนวนการแจ้งซ่อม</h4>
                  </div>
                  <CButtonGroup class="float-end">
                    <CButton
                      color="secondary"
                      @click="setTimeRange('day')"
                      :active="timeRange === 'day'"
                      >วัน</CButton
                    >
                    <CButton
                      color="secondary"
                      @click="setTimeRange('month')"
                      :active="timeRange === 'month'"
                      >เดือน</CButton
                    >
                    <CButton
                      color="secondary"
                      @click="setTimeRange('year')"
                      :active="timeRange === 'year'"
                      >ปี</CButton
                    >
                  </CButtonGroup>
                </div>
                <CChartLine
                  :data="lineChartData"
                  :options="lineChartOptions"
                  style="height: 300px; max-height: 300px; margin-top: 20px"
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>

      <div v-if="showTab2 && activeTab === '2'" class="tab-pane active">
        <CRow
          class="d-flex justify-content-center align-items-center"
          style="height: 300px"
        >
          <CCol :md="12" class="text-center"> Dashboard นิติ ---กำลังพัฒนา--- 
            <CButton
            color="primary"
            class="w-80"
            block
            style="margin: 100px"
            @click="$router.push('/StaffMgnReqView')"
            >ไปหน้ารับคำร้องขอแจ้งซ่อม</CButton
          >
          </CCol>
        </CRow>
      </div>

      <div v-if="showTab3 && activeTab === '3'" class="tab-pane active">
        <CRow
          class="d-flex justify-content-center align-items-center"
          style="height: 300px"
        >
          <CCol :md="12" class="text-center"> Dashboard ช่าง ---กำลังพัฒนา--- 
            <CButton
            color="primary"
            class="w-80"
            block
            style="margin: 100px"
            @click="$router.push('/macMgnReqView')"
            >ไปหน้าคำร้องขอแจ้งซ่อม</CButton
          >
          </CCol>
        </CRow>
      </div>

      <div v-if="showTab4 && activeTab === '4'" class="tab-pane active">
        <CRow
          class="d-flex justify-content-center align-items-center"
          style="height: 300px"
        >
          <CCol :md="12" class="text-center"> Dashboard ผู้จัดการ ---กำลังพัฒนา--- 
            <CButton
            color="primary"
            class="w-80"
            block
            style="margin: 100px"
            @click="$router.push('/StaffMgnReqView')"
            >ไปหน้ารับคำร้องขอแจ้งซ่อม</CButton
          >
          </CCol>
        </CRow>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { CRow, CCol, CCard, CCardBody, CButtonGroup, CButton } from "@coreui/vue";
import { CChartLine } from "@coreui/vue-chartjs";
import axios from "axios";

export default {
  name: "Dashboard",
  components: { CRow, CCol, CCard, CCardBody, CChartLine, CButtonGroup, CButton },
  setup() {
    const permissions = localStorage.getItem("permissions") || "0000000000000000";
    const showTab1 = permissions.charAt(2) === "1";
    const showTab2 = permissions.charAt(3) === "1";
    const showTab3 = permissions.charAt(4) === "1";
    const showTab4 = permissions.charAt(5) === "1";
    const activeTab = ref(null);

    const items = ref({
      InprogressCount: 0,
      ScheduledCount: 0,
      CompletedCount: 0,
      TotalCount: 0,
      inprogressPercent: 0,
      scheduledPercent: 0,
      completedPercent: 0,
    });

    const timeRange = ref("month");
    const lineChartData = ref({
      labels: [],
      datasets: [
        {
          label: "จำนวนแจ้งซ่อมแจ้งซ่อม",
          backgroundColor: "rgba(0,123,255,0.1)",
          borderColor: "rgba(0,123,255,1)",
          pointBackgroundColor: "rgba(0,123,255,1)",
          pointBorderColor: "#fff",
          data: [],
        },
      ],
    });

    const lineChartOptions = ref({
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: { position: "top" },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
        },
      },
    });

    const switchTab = (tab) => {
      activeTab.value = tab;
    };

    const setTimeRange = (range) => {
      timeRange.value = range;
      fetchRequestsByTimeRange();
    };

    const fetchRequestsByTimeRange = async () => {
      const userId = localStorage.getItem("userID");
      try {
        const response = await axios.get(`/api/auth/getreqTimeLine?id=${userId}`);
        const requests = response.data;

        if (timeRange.value === "day") {
          const dailyCounts = {};
          requests.forEach((request) => {
            const date = new Date(request.date).toLocaleDateString();
            dailyCounts[date] = (dailyCounts[date] || 0) + 1;
          });
          lineChartData.value.labels = Object.keys(dailyCounts);
          lineChartData.value.datasets[0].data = Object.values(dailyCounts);
        } else if (timeRange.value === "month") {
          const monthlyCounts = new Array(12).fill(0);
          requests.forEach((request) => {
            const month = new Date(request.date).getMonth();
            monthlyCounts[month]++;
          });
          lineChartData.value.labels = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          lineChartData.value.datasets[0].data = monthlyCounts;
        } else if (timeRange.value === "year") {
          const yearlyCounts = {};
          requests.forEach((request) => {
            const year = new Date(request.date).getFullYear();
            yearlyCounts[year] = (yearlyCounts[year] || 0) + 1;
          });
          lineChartData.value.labels = Object.keys(yearlyCounts);
          lineChartData.value.datasets[0].data = Object.values(yearlyCounts);
        }

        lineChartData.value = { ...lineChartData.value };
      } catch (error) {
        console.error("Error fetching requests by time range:", error);
      }
    };

    const getInprogressCount = async () => {
      const userId = localStorage.getItem("userID");
      try {
        const response = await axios.get(`/api/auth/getInprogressCount?id=${userId}`);
        items.value = {
          InprogressCount: response.data.InprogressCount || 0,
          ScheduledCount: response.data.ScheduledCount || 0,
          CompletedCount: response.data.CompletedCount || 0,
          TotalCount: response.data.TotalCount || 0,
          inprogressPercent: response.data.inprogressPercent || 0,
          scheduledPercent: response.data.scheduledPercent || 0,
          completedPercent: response.data.completedPercent || 0,
        };
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    onMounted(() => {
      fetchRequestsByTimeRange();
      getInprogressCount();
      activeTab.value = showTab1
        ? "1"
        : showTab2
        ? "2"
        : showTab3
        ? "3"
        : showTab4
        ? "4"
        : null;
    });

    return {
      activeTab,
      switchTab,
      permissions,
      showTab1,
      showTab2,
      showTab3,
      showTab4,
      items,
      lineChartData,
      lineChartOptions,
      timeRange,
      setTimeRange,
    };
  },
};
</script>

<style scoped>
.text-value {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
