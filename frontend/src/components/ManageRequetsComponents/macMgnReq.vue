<template>
  <div>
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === '1' }"
          @click.prevent="setActiveTab('1')"
          href="#"
        >
          <i class="fa-solid fa-screwdriver-wrench"></i>
          รับเรื่องแจ้งซ่อมบำรุง
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === '2' }"
          @click.prevent="setActiveTab('2')"
          href="#"
        >
          <i class="fa-solid fa-cart-plus"></i>
          แจ้งเบิกวัสดุ
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === '3' }"
          @click.prevent="setActiveTab('3')"
          href="#"
        >
          <i class="fa-solid fa-list-check"></i>
          กำลังดำเนินการซ่อม
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === '4' }"
          @click.prevent="setActiveTab('4')"
          href="#"
        >
          <i class="fa-solid fa-calendar-check"></i>
          ปฎิทินตารางเวลานัดหมาย
        </a>
      </li>
    </ul>

    <div class="tab-content mt-3">
      <!-- Tab 1 -->
      <div v-if="activeTab === '1'" class="tab-pane active">
        <CRow style="margin-bottom: 10px">
          <CCol :md="9"></CCol>
          <CCol :md="3" style="margin-bottom: 10px">
            <CInputGroup>
              <CFormInput placeholder="ค้นหา..." v-model="searchQueryTab1" />
              <CInputGroupText>
                <CIcon name="cil-magnifying-glass" />
              </CInputGroupText>
            </CInputGroup>
          </CCol>
        </CRow>

        <CRow>
          <CCol
            v-for="item in paginatedItemsTab1"
            :key="item.mainr_ID"
            md="12"
            class="mb-4"
          >
            <CCard class="card-modern" @click="showModalTab1(item)">
              <CCardHeader
                class="card-header-modern"
                v-if="item.status_ID === 'STC000002' && item.asp_detail === ''"
                :class="{ 'bg-warning text-dark': item.status_ID === 'STC000002' }"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="m-0 card-title-modern">
                    <i class="fa-solid fa-circle-user"></i> ผู้แจ้ง: {{ item.fullname }}
                  </h5>
                  <span class="date-modern">{{ item.mainr_Date }}</span>
                </div>
              </CCardHeader>
              <CCardHeader
                class="card-header-modern"
                v-else
                :class="{ 'bg-secondary': item.asp_detail !== '' }"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="m-0 card-title-modern">
                    <i class="fa-solid fa-circle-user"></i> ผู้แจ้ง: {{ item.fullname }}
                  </h5>
                  <span class="date-modern">{{ item.mainr_Date }}</span>
                </div>
              </CCardHeader>
              <CCardBody>
                <div class="d-flex flex-column">
                  <p>
                    <strong><i class="fa-regular fa-id-card"></i> รหัส: </strong>
                    {{ item.mainr_ID }}
                  </p>
                  <p>
                    <strong><i class="fa-solid fa-igloo"></i> ห้อง:</strong>
                    {{ item.roomNumber }}
                  </p>
                  <p>
                    <strong><i class="fa-regular fa-newspaper"></i> หัวเรื่อง:</strong>
                    {{ item.mainr_ProblemTitle }}
                  </p>
                  <p>
                    <strong
                      ><i class="fa-solid fa-screwdriver-wrench"></i> ประเภท:</strong
                    >
                    {{ item.Type }}
                  </p>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <p></p>
                  <p v-if="item.status_ID != 'STC000009' && item.status_ID != 'STC000010'" class="status-modern mb-0">
                    <div
                  v-if="item.scheduleTime"
                  class="d-flex justify-content-betwedivalign-items-center"
                >
                  <p></p>
                  <p v-if="item.status_ID != 'STC000003'" class="status-modern mb-0">
                    <strong>เวลานัด:</strong> {{ item.scheduleTime }}
                  </p>
                </div >
                <div v-if="item.status_ID === 'STC000002' && item.asp_detail === ''">
                  <strong>สถานะ:</strong> {{ item.status }}
                </div>
                <div v-if="item.status_ID === 'STC000002' && item.asp_detail !== ''">
                  <strong>สถานะ:</strong> {{ item.status }} (ทำต่อที่หน้าแจ้งเบิกวัสดุ)
                </div>

                <div v-if="item.scheduleTime">
                  <strong>สถานะ:</strong> {{ item.status }} 
                  <!-- (ทำต่อที่หน้ากำลังดำเนินการซ่อม) -->
                </div>
                
                  </p>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <p></p>
                  <p v-if="item.status_ID == 'STC000009'" class="status-modern mb-0">
                    <strong>สถานะ:</strong> {{ item.status }} (รอรับเรื่องเบิก)
                  </p>
                  
                </div>
                
                <div class="d-flex justify-content-between align-items-center">
                  <p></p>
                  <div v-if="item.status_ID === 'STC000010' && item.asp_detail !== ''" class="status-modern mb-0">
                  <strong>สถานะ:</strong> {{ item.status }} (ทำต่อที่หน้าแจ้งเบิกวัสดุ)
                </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <div class="card-footer-modern">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <CButton
              class="btn-modern"
              :disabled="currentPageTab1 === 1"
              @click="currentPageTab1--"
            >
              Previous
            </CButton>

            <div>
              <span>Showing page {{ currentPageTab1 }} of {{ totalPagesTab1 }}</span>
            </div>

            <CButton
              class="btn-modern"
              :disabled="currentPageTab1 === totalPagesTab1"
              @click="currentPageTab1++"
            >
              Next
            </CButton>
          </div>

          <div class="d-flex align-items-center">
            <span>Show</span>
            <select
              v-model="rowsPerPageTab1"
              class="form-select-modern mx-2"
              style="width: auto"
            >
              <option :value="3">3</option>
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            <span>entries</span>
          </div>
        </div>

        <CModal
          alignment="center"
          :visible="visibleModelDetailRequestTab1"
          @close="closeModelDetailRequestTab1"
          aria-labelledby="VerticallyCenteredExample"
          size="xl"
          backdrop="static"
        >
          <CModalHeader>
            <CModalTitle id="ModelDetailRequest">
              <i class="fa-solid fa-screwdriver-wrench"></i>
              รายละเอียดการแจ้งซ่อม ID: {{ selectedUserTab1.mainr_ID }}
              <span>วันที่: {{ selectedUserTab1.mainr_Date }}</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody style="max-height: 400px; overflow-y: auto">
            <p><strong>ผู้แจ้ง: </strong> {{ selectedUserTab1.fullname }}</p>
            <p><strong>ห้อง:</strong> {{ selectedUserTab1.roomNumber }}</p>
            <p><strong>หัวเรื่อง:</strong> {{ selectedUserTab1.mainr_ProblemTitle }}</p>
            <p>
              <strong>รายละเอียด:</strong> {{ selectedUserTab1.mainr_ProblemDescription }}
            </p>
            <p><strong>ประเภท:</strong> {{ selectedUserTab1.Type }}</p>
            <p><strong>สถานะ:</strong> {{ selectedUserTab1.status }}</p>

            <div v-if="imageUrls.length > 0" class="mt-3">
              <div
                style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center"
              >
                <img
                  v-for="(url, index) in imageUrls"
                  :key="index"
                  :src="getImageUrl(url)"
                  alt="รูปภาพแจ้งซ่อม"
                  style="
                    max-width: 500px;
                    max-height: 500px;
                    object-fit: cover;
                    cursor: pointer;
                  "
                  @click="openImageModal(index)"
                />
              </div>
            </div>
          </CModalBody>

          <CModalFooter>
            <CButton color="secondary" @click="closeModelDetailRequestTab1">ปิด</CButton>
            <CButton
              v-if="
                selectedUserTab1.status_ID == 'STC000002' &&
                selectedUserTab1.asp_detail == ''
              "
              color="primary"
              @click="assessProblemReqTab1(selectedUserTab1)"
            >
              <i class="fa-solid fa-check"></i>
              รับเรื่องการแจ้งซ่อม
            </CButton>

            <!-- <CButton
              v-if="
                selectedUserTab1.status_ID == 'STC000002' &&
                selectedUserTab1.asp_detail != ''
              "
              color="success text-light"
              @click="setActiveTab('2')"
            >
              <i class="fa-solid fa-check"></i>
              ไปหน้าแจ้งเบิก
            </CButton> -->
          </CModalFooter>
        </CModal>

        <vue-easy-lightbox
          :visible="visibleImageModal"
          :imgs="imageUrls.map((url) => getImageUrl(url))"
          :index="currentImageIndex"
          @hide="closeImageModalOnly"
          @prev="handlePreviousImage"
          @next="handleNextImage"
        />
      </div>

      <!-- Tab 2 -->
      <div v-if="activeTab === '2'" class="tab-pane active">
        <CRow style="margin-bottom: 10px">
          <CCol :md="9"></CCol>
          <CCol :md="3" style="margin-bottom: 10px">
            <CInputGroup>
              <CFormInput placeholder="ค้นหา..." v-model="searchQueryTab2" />
              <CInputGroupText>
                <CIcon name="cil-magnifying-glass" />
              </CInputGroupText>
            </CInputGroup>
          </CCol>
        </CRow>

        <CRow>
          <CCol
            v-for="item in paginatedWithdrawItems"
            :key="item.mainr_ID"
            md="12"
            class="mb-4"
          >
            <CCard class="card-modern" @click="showModalTab2(item)">
              <CCardHeader class="card-header-modern">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="m-0 card-title-modern">
                    <i class="fa-solid fa-circle-user"></i> ผู้แจ้ง: {{ item.fullname }}
                  </h5>
                  <span class="date-modern">{{ item.mainr_Date }}</span>
                </div>
              </CCardHeader>
              <CCardBody>
                <div class="d-flex flex-column">
                  <p>
                    <strong><i class="fa-regular fa-id-card"></i> รหัส: </strong>
                    {{ item.mainr_ID }}
                  </p>
                  <p>
                    <strong><i class="fa-solid fa-igloo"></i> ห้อง:</strong>
                    {{ item.roomNumber }}
                  </p>
                  <p>
                    <strong><i class="fa-regular fa-newspaper"></i> หัวเรื่อง:</strong>
                    {{ item.mainr_ProblemTitle }}
                  </p>
                  <p>
                    <strong
                      ><i class="fa-solid fa-screwdriver-wrench"></i> ประเภท:</strong
                    >
                    {{ item.Type }}
                  </p>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <p></p>
                  <p class="status-modern mb-0">
                    <strong>สถานะ:</strong> {{ item.status }}
                  </p>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <div class="card-footer-modern">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <CButton
              class="btn-modern"
              :disabled="currentPageWithdraw === 1"
              @click="currentPageWithdraw--"
            >
              Previous
            </CButton>

            <div>
              <span
                >Showing page {{ currentPageWithdraw }} of {{ totalWithdrawPages }}</span
              >
            </div>

            <CButton
              class="btn-modern"
              :disabled="currentPageWithdraw === totalWithdrawPages"
              @click="currentPageWithdraw++"
            >
              Next
            </CButton>
          </div>

          <div class="d-flex align-items-center">
            <span>Show</span>
            <select
              v-model="rowsPerPageWithdraw"
              class="form-select-modern mx-2"
              style="width: auto"
            >
              <option :value="3">3</option>
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            <span>entries</span>
          </div>
        </div>

        <CModal
          alignment="center"
          :visible="visibleModelDetailRequestTab2"
          @close="closeModelDetailRequestTab2"
          aria-labelledby="VerticallyCenteredExample"
          size="xl"
          backdrop="static"
          fullscreen
        >
          <CModalHeader>
            <CModalTitle id="ModelDetailRequest">
              <i class="fa-solid fa-screwdriver-wrench"></i>
              รายละเอียดการแจ้งซ่อม ID: {{ selectedUserTab2.mainr_ID }}
              <span>วันที่: {{ selectedUserTab2.mainr_Date }}</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody style="display: flex; flex-direction: column; height: 100%">
            <CRow style="flex-grow: 1">
              <CCol :md="7" style="flex-grow: 1; max-height: 800px; overflow-y: auto">
                <CCard style="flex-grow: 1">
                  <CCardHeader>
                    <h7>รายละเอียด</h7>
                  </CCardHeader>
                  <CModalBody style="flex-grow: 1; overflow-y: auto">
                    <p><strong>ผู้แจ้ง: </strong> {{ selectedUserTab2.fullname }}</p>
                    <p><strong>ห้อง:</strong> {{ selectedUserTab2.roomNumber }}</p>
                    <p>
                      <strong>หัวเรื่อง:</strong>
                      {{ selectedUserTab2.mainr_ProblemTitle }}
                    </p>
                    <p>
                      <strong>รายละเอียด:</strong>
                      {{ selectedUserTab2.mainr_ProblemDescription }}
                    </p>
                    <p><strong>ประเภท:</strong> {{ selectedUserTab2.Type }}</p>
                    <p><strong>สถานะ:</strong> {{ selectedUserTab2.status }}</p>

                    <div v-if="imageUrls.length > 0" class="mt-3">
                      <div
                        style="
                          display: flex;
                          flex-wrap: wrap;
                          gap: 10px;
                          justify-content: center;
                        "
                      >
                        <img
                          v-for="(url, index) in imageUrls"
                          :key="index"
                          :src="getImageUrl(url)"
                          alt="รูปภาพแจ้งซ่อม"
                          style="
                            max-width: 500px;
                            max-height: 500px;
                            object-fit: cover;
                            cursor: pointer;
                          "
                          @click="openImageModal(index)"
                        />
                      </div>
                    </div>
                  </CModalBody>
                </CCard>
              </CCol>

              <!-- การ์ดขวา -->
              <CCol :md="5" style="display: flex; flex-direction: column; height: 100%">
                <CCard style="flex-grow: 1">
                  <CCardHeader>
                    <h7>การประเมินงานซ่อมเบื้องต้น</h7>
                  </CCardHeader>
                  <CModalBody style="flex-grow: 1; overflow-y: auto">
                    <CRow>
                      <label for="" class="form-label">ประเมินงานซ่อมเบื้องต้น</label>
                      <div class="form-floating">
                        <textarea
                          class="form-control"
                          placeholder="กรอกประเมินงานซ่อมเบื้องต้น"
                          style="height: 100px"
                          v-model="selectedUserTab2.detail"
                          disabled
                        ></textarea>
                      </div>
                    </CRow>

                    <CRow class="mt-3">
                      <CCol :md="10">
                        <label for="" class="form-label">วัสดุ</label>
                      </CCol>
                      <CCol :md="2">
                        <CButton
                          class="btnAdd"
                          color="primary"
                          @click="showModelStockWithdraw()"
                        >
                          <i class="fa-solid fa-plus"></i>
                          เพิ่ม</CButton
                        >
                      </CCol>
                    </CRow>

                    <CRow>
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th>รหัส</th>
                            <th>ชื่อวัสดุ</th>
                            <th>คงเหลือ</th>
                            <th>จำนวนที่ต้องการเบิก</th>
                            <th>สถานะ</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, index) in selectedStockItems" :key="index">
                            <td>{{ item.stockid }}</td>
                            <td>{{ item.stockname }}</td>
                            <td>{{ item.stockquantity }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>{{ item.status }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </CRow>
                  </CModalBody>
                </CCard>
              </CCol>
            </CRow>
          </CModalBody>

          <CModalFooter>
            <CButton color="secondary" @click="closeModelDetailRequestTab2">ปิด</CButton>

            <CButton color="warning" @click="confirmUpdateNotwith()">
              ไม่เบิกวัสดุ
            </CButton>
            <CButton color="primary" @click="submitRequisition">
              บันทึกการแจ้งเบิก
            </CButton>
          </CModalFooter>
        </CModal>
      </div>

      <vue-easy-lightbox
        :visible="visibleImageModal"
        :imgs="imageUrls.map((url) => getImageUrl(url))"
        :index="currentImageIndex"
        @hide="closeImageModalOnly"
        @prev="handlePreviousImage"
        @next="handleNextImage"
      />
    </div>

    <CModal
      alignment="center"
      :visible="visibleModelStockWithdraw"
      @close="closeModelStockWithdraw"
      aria-labelledby="VerticallyCenteredExample"
      size="xl"
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle id="ModelStockWithdraw">เพิ่มวัสดุ</CModalTitle>
      </CModalHeader>

      <CModalBody style="max-height: 400px; overflow-y: auto">
        <CInputGroup style="margin-bottom: 10px">
          <CFormInput placeholder="ค้นหาวัสดุ..." v-model="searchQueryStock" />
          <CInputGroupText>
            <CIcon name="cil-magnifying-glass" />
          </CInputGroupText>
        </CInputGroup>

        <table class="table table-bordered">
          <thead>
            <tr>
              <th>รหัสสต็อก</th>
              <th>ชื่อวัสดุ</th>
              <th>จำนวนคงเหลือ</th>
              <th>หน่วย</th>
              <th>ประเภทวัสดุ</th>
              <th>เลือก</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(stock, index) in paginatedStockItems" :key="index">
              <td>{{ stock.stockid }}</td>
              <td>{{ stock.stockname }}</td>
              <td>{{ stock.stockquantity }}</td>
              <td>{{ stock.unitname }}</td>
              <td>{{ stock.typestockname }}</td>
              <td>
                <CButton color="primary" @click="addSelectedStock(stock)">เลือก</CButton>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="d-flex justify-content-between align-items-center">
          <CButton
            :disabled="currentPageStock === 1"
            @click="currentPageStock--"
            class="btn btn-secondary"
          >
            Previous
          </CButton>

          <span>Showing page {{ currentPageStock }} of {{ totalPagesStock }}</span>

          <CButton
            :disabled="currentPageStock === totalPagesStock"
            @click="currentPageStock++"
            class="btn btn-secondary"
          >
            Next
          </CButton>
        </div>

        <div class="d-flex align-items-center mt-3">
          <span>Show</span>
          <select
            v-model="rowsPerPageStock"
            class="form-select-modern mx-2"
            style="width: auto"
          >
            <option :value="3">3</option>
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span>entries</span>
        </div>

        <CRow>
          <h5>รายการวัสดุที่เลือก</h5>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>รหัส</th>
                <th>ชื่อวัสดุ</th>
                <th>คงเหลือ</th>
                <th>จำนวนที่ต้องการเบิก</th>
                <th>สถานะ</th>
                <th>การจัดการ</th>
                <!-- เพิ่มหัวตารางสำหรับปุ่มจัดการ -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in selectedStockItems" :key="index">
                <td>{{ item.stockid }}</td>
                <td>{{ item.stockname }}</td>
                <td>{{ item.stockquantity }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.status }}</td>
                <td>
                  <!-- ปุ่มแก้ไขจำนวน -->
                  <CButton color="warning" class="me-2" @click="editSelectedStock(index)">
                    แก้ไข
                  </CButton>
                  <!-- ปุ่มลบวัสดุ -->
                  <CButton color="danger" @click="removeSelectedStock(index)">
                    ลบ
                  </CButton>
                </td>
              </tr>
            </tbody>
          </table>
        </CRow>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" @click="closeModelStockWithdraw">ปิด</CButton>
      </CModalFooter>
    </CModal>

    <CModal
      alignment="center"
      :visible="visibleModelStockAmount"
      @close="closeModelStockAmount"
      aria-labelledby="VerticallyCenteredExample"
      size="xl"
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle id="ModelStockAmount">กรอกจำนวนวัสดุที่ต้องการเบิก</CModalTitle>
      </CModalHeader>

      <CModalBody style="max-height: 400px; overflow-y: auto">
        <CRow>
          <CCol>
            <CFormInput
              type="number"
              placeholder="กรอกจำนวน"
              v-model="selectedStockAmount"
              min="1"
            />
          </CCol>
        </CRow>
      </CModalBody>

      <CModalFooter>
        <CButton color="primary" @click="submitAmountSelection">ยืนยัน</CButton>
      </CModalFooter>
    </CModal>

    <div v-if="activeTab === '3'" class="tab-pane active">
      <CRow style="margin-bottom: 10px">
        <CCol :md="9"></CCol>
        <CCol :md="3" style="margin-bottom: 10px">
          <CInputGroup>
            <CFormInput placeholder="ค้นหา..." v-model="searchQueryTab3" />
            <CInputGroupText>
              <CIcon name="cil-magnifying-glass" />
            </CInputGroupText>
          </CInputGroup>
        </CCol>
      </CRow>

      <CRow>
        <CCol
          v-for="item in paginatedItemsTab3"
          :key="item.mainr_ID"
          md="12"
          class="mb-4"
        >
          <CCard class="card-modern" @click="showModalTab3(item)">
            <CCardHeader class="card-header-modern">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="m-0 card-title-modern">
                  <i class="fa-solid fa-circle-user"></i> ผู้แจ้ง: {{ item.fullname }}
                </h5>
                <span class="date-modern">{{ item.mainr_Date }}</span>
              </div>
            </CCardHeader>
            <CCardBody>
              <div class="d-flex flex-column">
                <p>
                  <strong><i class="fa-regular fa-id-card"></i> รหัส: </strong>
                  {{ item.mainr_ID }}
                </p>
                <p>
                  <strong><i class="fa-solid fa-igloo"></i> ห้อง:</strong>
                  {{ item.roomNumber }}
                </p>
                <p>
                  <strong><i class="fa-regular fa-newspaper"></i> หัวเรื่อง:</strong>
                  {{ item.mainr_ProblemTitle }}
                </p>
                <p>
                  <strong><i class="fa-solid fa-screwdriver-wrench"></i> ประเภท:</strong>
                  {{ item.Type }}
                </p>
              </div>
              <div
                v-if="item.scheduleTime"
                class="d-flex justify-content-between align-items-center"
              >
                <p></p>
                <p class="status-modern mb-0">
                  <strong>เวลานัด:</strong> {{ item.scheduleTime }}
                </p>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <p></p>
                <p class="status-modern mb-0">
                  <strong>สถานะ:</strong> {{ item.status }}
                </p>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <div class="card-footer-modern">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <CButton
            class="btn-modern"
            :disabled="currentPageTab3 === 1"
            @click="currentPageTab3--"
          >
            Previous
          </CButton>

          <div>
            <span>Showing page {{ currentPageTab3 }} of {{ totalPagesTab3 }}</span>
          </div>

          <CButton
            class="btn-modern"
            :disabled="currentPageTab3 === totalPagesTab3"
            @click="currentPageTab3++"
          >
            Next
          </CButton>
        </div>

        <div class="d-flex align-items-center">
          <span>Show</span>
          <select
            v-model="rowsPerPageTab3"
            class="form-select-modern mx-2"
            style="width: auto"
          >
            <option :value="3">3</option>
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span>entries</span>
        </div>
      </div>

      <CModal
        alignment="center"
        :visible="visibleModelDetailRequestTab3"
        @close="closeModelDetailRequestTab3"
        aria-labelledby="VerticallyCenteredExample"
        size="xl"
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle id="ModelDetailRequest">
            <i class="fa-solid fa-screwdriver-wrench"></i>
            รายละเอียดการแจ้งซ่อม ID: {{ selectedUserTab3.mainr_ID }}
            <span>วันที่: {{ selectedUserTab3.mainr_Date }}</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody style="max-height: 400px; overflow-y: auto">
          <p><strong>ผู้แจ้ง: </strong> {{ selectedUserTab3.fullname }}</p>
          <p><strong>ห้อง:</strong> {{ selectedUserTab3.roomNumber }}</p>
          <p><strong>หัวเรื่อง:</strong> {{ selectedUserTab3.mainr_ProblemTitle }}</p>
          <p>
            <strong>รายละเอียด:</strong> {{ selectedUserTab3.mainr_ProblemDescription }}
          </p>
          <p><strong>ประเภท:</strong> {{ selectedUserTab3.Type }}</p>
          <p><strong>เวลานัด:</strong> {{ selectedUserTab3.scheduleTime }}</p>
          <!-- <p><strong>สถานะการเบิก:</strong> {{ selectedUserTab3.statusrequi }}</p> -->
          <p><strong>สถานะ:</strong> {{ selectedUserTab3.status }}</p>

          <div v-if="imageUrls.length > 0" class="mt-3">
            <div
              style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center"
            >
              <img
                v-for="(url, index) in imageUrls"
                :key="index"
                :src="getImageUrl(url)"
                alt="รูปภาพแจ้งซ่อม"
                style="
                  max-width: 500px;
                  max-height: 500px;
                  object-fit: cover;
                  cursor: pointer;
                "
                @click="openImageModal(index)"
              />
            </div>
          </div>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" @click="closeModelDetailRequestTab3">ปิด</CButton>
          <CButton color="warning" @click="confirmUpdateNotsuccess()">
            <i class="fa-solid fa-paper-plane"></i>
            การซ่อมไม่แล้วเสร็จ
          </CButton>
          <CButton color="primary" @click="showStatusModal()">
            <i class="fa-solid fa-check"></i>
            ปรับสถานะ
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        alignment="center"
        :visible="visibleStatusModal"
        @close="closeStatusModal"
        aria-labelledby="VerticallyCenteredExample"
        size="lg"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample">เลือกสถา่นะ</CModalTitle>
        </CModalHeader>
        <CModalBody>
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
                        <CCol md="3">
                          <CFormLabel for="resId">รหัส</CFormLabel>
                          <CFormInput
                            :value="selectedUserTab3.mainr_ID"
                            type="text"
                            id="resId"
                            disabled
                          />
                        </CCol>
                        <CCol md="9">
                          <CFormLabel for="resStatus">สถานะ</CFormLabel>
                          <CFormSelect
                            v-model="resStatus"
                            id="resStatus"
                            required
                            @change="() => console.log('Status selected:', resStatus)"
                          >
                            <option value="">กรุณาเลือกสถานะ</option>
                            <option
                              v-for="status in statusUser"
                              :key="status.StaCase_ID"
                              :value="status.StaCase_ID"
                            >
                              {{ status.StaCase_Name }}
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
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" @click="closeDeleteModal">ปิด</CButton>
        </CModalFooter>
      </CModal>
    </div>
    <div v-if="activeTab === '4'" class="tab-pane active">
      <div align="center">ฟีเจอร์กำลังพัฒนา</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import VueEasyLightbox from "vue-easy-lightbox";
import Swal from "sweetalert2";

export default {
  name: "macMgnReq",
  components: {
    VueEasyLightbox,
  },
  setup() {
    const activeTab = ref("1");
    const searchQueryTab1 = ref("");
    const searchQueryTab2 = ref("");
    const searchQueryTab3 = ref("");
    const searchQueryStock = ref("");
    const itemsTab1 = ref([]);
    const itemsTab3 = ref([]);
    const statusUser = ref([]);
    const withdrawItems = ref([]);
    const stockItems = ref([]);
    const selectedStockItems = ref([]);
    const rowsPerPageTab1 = ref(3);
    const rowsPerPageTab3 = ref(3);
    const rowsPerPageWithdraw = ref(3);
    const rowsPerPageStock = ref(5);
    const currentPageTab1 = ref(1);
    const currentPageTab3 = ref(1);
    const currentPageWithdraw = ref(1);
    const currentPageStock = ref(1);
    const visibleModelDetailRequestTab1 = ref(false);
    const visibleModelDetailRequestTab2 = ref(false);
    const visibleModelDetailRequestTab3 = ref(false);
    const visibleModelStockWithdraw = ref(false);
    const visibleModelStockAmount = ref(false);
    const visibleImageModal = ref(false);
    const selectedUserTab1 = ref({});
    const selectedUserTab2 = ref({});
    const selectedUserTab3 = ref({});
    const imageUrls = ref([]);
    const currentImageIndex = ref(0);
    const selectedStockAmount = ref(1);
    const selectedStockToEdit = ref(null);
    const visibleStatusModal = ref(false);
    const selectedStatus = ref("");
    const resStatus = ref("");

    const handleSubmitTooltip01 = (event) => {
      console.log("สถานะ", resStatus.value);
      event.preventDefault();
      if (resStatus.value) {
        updateStatus();
      } else {
        Swal.fire({
          icon: "warning",
          title: "โปรดเลือกสถานะ",
          text: "กรุณาเลือกสถานะก่อนบันทึก",
        });
      }
    };

    const updateStatus = async () => {
      if (!selectedUserTab3.value.mainr_ID) {
        console.error("mainr_ID is missing in selectedUserTab3:", selectedUserTab3.value);
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถปรับปรุงสถานะ",
          text: "ข้อมูล mainr_ID ไม่ถูกต้อง",
        });
        return;
      }

      try {
        const response = await axios.put(`/api/auth/updateStatusReq`, {
          mainr_ID: selectedUserTab3.value.mainr_ID,
          mainrstatus_ID: resStatus.value,
        });

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "สถานะถูกปรับปรุงเรียบร้อย",
            text: "สถานะใหม่ได้ถูกบันทึกแล้ว",
          });
          closeStatusModal();
          fetchRequestsTab3();
        } else {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถปรับปรุงสถานะได้",
          });
        }
      } catch (error) {
        console.error("Error updating status:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถปรับปรุงสถานะได้",
        });
      }
    };

    const updateNotsuccess = async () => {
      if (!selectedUserTab3.value.mainr_ID) {
        console.error("mainr_ID is missing in selectedUserTab3:", selectedUserTab3.value);
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถปรับปรุงสถานะ",
          text: "ข้อมูล mainr_ID ไม่ถูกต้อง",
        });
        return;
      }

      try {
        const response = await axios.put(`/api/auth/updateStatusNotsuccess`, {
          mainr_ID: selectedUserTab3.value.mainr_ID,
        });

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "เรียบร้อย",
            text: "การซ่อมไม่แล้วเสร็จได้ถูกบันทึกแล้ว",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถบันทึกได้",
          });
        }
      } catch (error) {
        console.error("Error updating status:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการเรียกใช้ API",
          text: "ไม่สามารถบันทึกได้",
        });
      }
    };

    const confirmUpdateNotsuccess = (index) => {
      Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณต้องการเปลี่ยนการซ่อมไม่แล้วเสร็จหรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then((result) => {
        if (result.isConfirmed) {
          updateNotsuccess();
          window.location.reload();
        }
      });
    };

    const filteredItemsTab1 = computed(() => {
      return itemsTab1.value.filter((item) => {
        return (
          item.mainr_ID.toLowerCase().includes(searchQueryTab1.value.toLowerCase()) ||
          item.fullname.toLowerCase().includes(searchQueryTab1.value.toLowerCase()) ||
          item.roomNumber?.toLowerCase().includes(searchQueryTab1.value.toLowerCase()) ||
          item.mainr_ProblemTitle
            ?.toLowerCase()
            .includes(searchQueryTab1.value.toLowerCase())
        );
      });
    });

    const filteredItemsTab3 = computed(() => {
      return itemsTab3.value.filter((item) => {
        return (
          item.mainr_ID.toLowerCase().includes(searchQueryTab3.value.toLowerCase()) ||
          item.fullname.toLowerCase().includes(searchQueryTab3.value.toLowerCase()) ||
          item.roomNumber?.toLowerCase().includes(searchQueryTab3.value.toLowerCase()) ||
          item.mainr_ProblemTitle
            ?.toLowerCase()
            .includes(searchQueryTab3.value.toLowerCase())
        );
      });
    });

    const filteredWithdrawItems = computed(() => {
      return withdrawItems.value.filter((item) => {
        return (
          item.mainr_ID.toLowerCase().includes(searchQueryTab2.value.toLowerCase()) ||
          item.fullname.toLowerCase().includes(searchQueryTab2.value.toLowerCase()) ||
          item.roomNumber?.toLowerCase().includes(searchQueryTab2.value.toLowerCase()) ||
          item.status.toLowerCase().includes(searchQueryTab2.value.toLowerCase()) ||
          item.mainr_ProblemTitle
            ?.toLowerCase()
            .includes(searchQueryTab2.value.toLowerCase())
        );
      });
    });

    const filteredStockItems = computed(() => {
      return stockItems.value.filter((stock) => {
        return (
          stock.stockname.toLowerCase().includes(searchQueryStock.value.toLowerCase()) ||
          stock.stockid?.toLowerCase().includes(searchQueryStock.value.toLowerCase()) ||
          stock.typestockname
            ?.toLowerCase()
            .includes(searchQueryStock.value.toLowerCase())
        );
      });
    });

    const paginatedStockItems = computed(() => {
      const start = (currentPageStock.value - 1) * rowsPerPageStock.value;
      const end = start + rowsPerPageStock.value;
      return filteredStockItems.value.slice(start, end);
    });

    const totalPagesStock = computed(() => {
      return Math.ceil(filteredStockItems.value.length / rowsPerPageStock.value);
    });

    const fetchRequestsTab1 = async () => {
      const userId = localStorage.getItem("userID");
      try {
        const response = await axios.get(`/api/auth/getMacReq`);
        itemsTab1.value = response.data;

        // จัดเรียงสถานะให้ "STC000001" ขึ้นมาก่อน
        itemsTab1.value.sort((a, b) => {
          if (
            a.mainr_Stat_ID === "STC000002" &&
            b.mainr_Stat_ID !== "STC000002"
            // &&
            // a.asp_detail === "" &&
            // b.asp_detail !== ""
          ) {
            return 1;
          } else if (
            a.mainr_Stat_ID !== "STC000002" &&
            b.mainr_Stat_ID === "STC000002"
            // &&
            // a.asp_detail !== "" &&
            // b.asp_detail === ""
          ) {
            return 2;
          }
          return 0;
        });
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการแจ้งซ่อม:", error);
      }
    };

    const fetchRequestsTab3 = async () => {
      const userId = localStorage.getItem("userID");
      try {
        const response = await axios.get(`/api/auth/getSuccessReq?id=${userId}`);
        itemsTab3.value = response.data;
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการแจ้งซ่อม:", error);
      }
    };

    const fetchgetStatusReq = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/getStatusReq", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        statusUser.value = response.data;
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    const fetchWithdrawRequestsTab2 = async () => {
      try {
        const userId = localStorage.getItem("userID");
        const response = await axios.get(`/api/auth/getMacReqById?id=${userId}`);
        withdrawItems.value = response.data;
      } catch (error) {
        console.error("Error fetching withdraw requests:", error);
      }
    };

    const fetchStockData = async () => {
      try {
        const response = await axios.get(`/api/auth/getStock`);
        stockItems.value = response.data;
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    const setActiveTab = (tab) => {
      activeTab.value = tab;
      if (tab === "2") {
        fetchWithdrawRequestsTab2();
      } else if (tab === "3") {
        fetchRequestsTab3();
      } else if (tab === "4") {
      }
    };

    const paginatedItemsTab1 = computed(() => {
      const start = (currentPageTab1.value - 1) * rowsPerPageTab1.value;
      const end = start + rowsPerPageTab1.value;
      return filteredItemsTab1.value.slice(start, end);
    });

    const totalPagesTab1 = computed(() => {
      return Math.ceil(filteredItemsTab1.value.length / rowsPerPageTab1.value);
    });

    const paginatedItemsTab3 = computed(() => {
      const start = (currentPageTab3.value - 1) * rowsPerPageTab3.value;
      const end = start + rowsPerPageTab3.value;
      return filteredItemsTab3.value.slice(start, end);
    });

    const totalPagesTab3 = computed(() => {
      return Math.ceil(filteredItemsTab3.value.length / rowsPerPageTab3.value);
    });

    const paginatedWithdrawItems = computed(() => {
      const start = (currentPageWithdraw.value - 1) * rowsPerPageWithdraw.value;
      const end = start + rowsPerPageWithdraw.value;
      return filteredWithdrawItems.value.slice(start, end);
    });

    const totalWithdrawPages = computed(() => {
      return Math.ceil(filteredWithdrawItems.value.length / rowsPerPageWithdraw.value);
    });

    const showModalTab1 = (item) => {
      selectedUserTab1.value = item;
      fetchImages(item.mainr_ID);
      visibleModelDetailRequestTab1.value = true;
    };

    const showModalTab2 = (item) => {
      selectedUserTab2.value = item;
      fetchImages(item.mainr_ID);
      visibleModelDetailRequestTab2.value = true;
    };

    const showModalTab3 = (item) => {
      selectedUserTab3.value = { ...item };
      fetchImages(item.mainr_ID);
      visibleModelDetailRequestTab3.value = true;
    };

    const showModelStockWithdraw = () => {
      fetchStockData();
      visibleModelStockWithdraw.value = true;
    };

    const showModelStockAmount = () => {
      visibleModelStockAmount.value = true;
    };
    const showStatusModal = () => {
      visibleStatusModal.value = true;
    };

    const closeModelDetailRequestTab1 = () => {
      visibleModelDetailRequestTab1.value = false;
      selectedUserTab1.value = {};
      imageUrls.value = [];
    };

    const closeModelDetailRequestTab2 = () => {
      visibleModelDetailRequestTab2.value = false;
      selectedUserTab2.value = {};
      imageUrls.value = [];
    };
    const closeModelDetailRequestTab3 = () => {
      visibleModelDetailRequestTab3.value = false;
      selectedUserTab3.value = {};
      imageUrls.value = [];
    };

    const closeModelStockWithdraw = () => {
      visibleModelStockWithdraw.value = false;
    };

    const closeModelStockAmount = () => {
      visibleModelStockAmount.value = false;
      selectedStockToEdit.value = null;
    };
    const closeStatusModal = () => {
      visibleStatusModal.value = false;
    };

    const fetchImages = async (mainr_ID) => {
      try {
        const response = await axios.get(`/api/auth/getImgById?id=${mainr_ID}`);
        imageUrls.value = response.data.map((img) => img.imges_Path);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงรูปภาพ:", error);
        imageUrls.value = [];
      }
    };

    const getImageUrl = (path) => {
      // return `http://localhost:3030/uploads/${path}`; //local
      return `http://localhost:3030/uploads/${path}`; //hosting
    };

    const openImageModal = (index) => {
      currentImageIndex.value = index;
      visibleImageModal.value = true;
    };

    const closeImageModalOnly = () => {
      visibleImageModal.value = false;
    };

    const handlePreviousImage = () => {
      if (currentImageIndex.value > 0) {
        currentImageIndex.value -= 1;
      }
    };

    const handleNextImage = () => {
      if (currentImageIndex.value < imageUrls.value.length - 1) {
        currentImageIndex.value += 1;
      }
    };

    const addSelectedStock = (stock) => {
      // ตรวจสอบว่าวัสดุนี้ถูกเลือกแล้วหรือไม่
      const existingStock = selectedStockItems.value.find(
        (item) => item.stockid === stock.stockid
      );

      if (existingStock) {
        // หากวัสดุถูกเลือกแล้ว ให้เปิด modal สำหรับแก้ไขจำนวน
        selectedStockToEdit.value = existingStock;
        selectedStockAmount.value = existingStock.quantity;
        Swal.fire({
          title: "วัสดุซ้ำ",
          text: "วัสดุนี้ถูกเลือกแล้ว คุณต้องการแก้ไขจำนวนหรือไม่?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "แก้ไขจำนวน",
          cancelButtonText: "ยกเลิก",
        }).then((result) => {
          if (result.isConfirmed) {
            showModelStockAmount();
          }
        });
      } else {
        selectedStockToEdit.value = { ...stock }; // ตั้งค่าวัสดุที่เลือก
        selectedStockAmount.value = 1; // ตั้งค่าเริ่มต้นให้ 1
        showModelStockAmount();
      }
    };

    const submitAmountSelection = () => {
      if (selectedStockAmount.value <= 0) {
        Swal.fire({
          title: "จำนวนไม่ถูกต้อง",
          text: "กรุณากรอกจำนวนวัสดุที่มากกว่า 0",
          icon: "error",
        });
        return;
      }

      const quantityOrders = Math.max(
        selectedStockAmount.value - selectedStockToEdit.value.stockquantity,
        0
      );

      if (!selectedStockItems.value.includes(selectedStockToEdit.value)) {
        selectedStockItems.value.push({
          ...selectedStockToEdit.value,
          quantity: selectedStockAmount.value,
          quantity_orders: quantityOrders,
          status:
            quantityOrders > 0
              ? `ต้องสั่งซื้อเพิ่ม ${quantityOrders} หน่วย`
              : "จำนวนคงเหลือเพียงพอ",
        });
      } else {
        selectedStockToEdit.value.quantity = selectedStockAmount.value;
        selectedStockToEdit.value.quantity_orders = quantityOrders;
        selectedStockToEdit.value.status =
          quantityOrders > 0
            ? `ต้องสั่งซื้อเพิ่ม ${quantityOrders} หน่วย`
            : "จำนวนคงเหลือเพียงพอ";
      }

      Swal.fire({
        title: "เพิ่มรายการสำเร็จ!",
        text: "วัสดุถูกเพิ่มลงในรายการเรียบร้อยแล้ว",
        icon: "success",
      });

      closeModelStockAmount();
    };

    const editSelectedStock = (index) => {
      selectedStockToEdit.value = selectedStockItems.value[index];
      selectedStockAmount.value = selectedStockToEdit.value.quantity;

      showModelStockAmount();
    };

    const removeSelectedStock = (index) => {
      Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณต้องการลบวัสดุนี้ออกจากรายการหรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ลบ",
        cancelButtonText: "ยกเลิก",
      }).then((result) => {
        if (result.isConfirmed) {
          // ลบวัสดุออกจากรายการ selectedStockItems
          selectedStockItems.value.splice(index, 1);
          Swal.fire("ลบแล้ว!", "วัสดุถูกลบออกจากรายการเรียบร้อย", "success");
        }
      });
    };

    const submitStockSelection = () => {
      closeModelStockWithdraw();
    };

    const assessProblemReqTab1 = async (selectedUser) => {
      const { value: text } = await Swal.fire({
        input: "textarea",
        inputLabel: "ประเมิณปัญหาเบื้องต้น",
        inputPlaceholder: "พิมพ์ข้อความของคุณที่นี่...",
        inputAttributes: {
          "aria-label": "พิมพ์ข้อความของคุณที่นี่",
        },
        showCancelButton: true,
      });

      if (text) {
        Swal.fire({
          title: "คุณแน่ใจหรือไม่ที่จะส่งการประเมิณปัญหา?",
          text: "การประเมิณนี้ไม่สามารถย้อนกลับได้!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "ยืนยันส่งการประเมิณปัญหา",
          cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const userId = localStorage.getItem("userID");
              await axios.post(`/api/auth/sendAssessProblemReq`, {
                mainr_ID: selectedUser.mainr_ID,
                assessProblemText: text,
                userID: userId,
              });

              Swal.fire({
                title: "ส่งการประเมิณปัญหาเรียบร้อย!",
                text: "บันทึกเรียบร้อย.",
                icon: "success",
              }).then(() => {
                window.location.reload();
              });

              closeModelDetailRequestTab1();
              fetchRequestsTab1();
            } catch (error) {
              console.error("เกิดข้อผิดพลาดในการส่งการประเมิณปัญหา:", error);
              Swal.fire({
                title: "เกิดข้อผิดพลาด!",
                text: "ไม่สามารถส่งการประเมิณปัญหาได้.",
                icon: "error",
              });
            }
          }
        });
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: "กรุณากรอกข้อมูลการประเมิณปัญหา.",
          icon: "error",
        });
      }
    };

    const submitRequisition = async () => {
      if (selectedStockItems.value.length === 0) {
        Swal.fire({
          icon: "error",
          title: "ไม่มีรายการวัสดุที่ต้องการเบิก",
          text: "กรุณาเลือกวัสดุที่ต้องการเบิก",
        });
        return;
      }

      try {
        // สร้างข้อมูลที่จะส่งไปยัง API
        const requisitionData = {
          requisition_mainr_ID: selectedUserTab2.value.mainr_ID,
          requisition_user_ID: localStorage.getItem("userID"),
          stockItems: selectedStockItems.value.map((item) => ({
            stockID: item.stockid,
            quantity: item.quantity,
            quantity_orders: item.quantity_orders || 0,
          })),
        };

        // เรียก API เพื่อบันทึกการแจ้งเบิก
        const response = await axios.post("/api/auth/submitRequisition", requisitionData);

        // ตรวจสอบผลลัพธ์จาก API
        if (response.status === 201) {
          Swal.fire({
            icon: "success",
            title: "บันทึกสำเร็จ",
            text: "การแจ้งเบิกวัสดุของคุณถูกบันทึกแล้ว",
          }).then(() => {
            window.location.reload();
          });

          // ล้างรายการวัสดุที่เลือกหลังบันทึกสำเร็จ
          selectedStockItems.value = [];
          visibleModelDetailRequestTab2.value = false;
        } else {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถบันทึกข้อมูลการแจ้งเบิกได้",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถบันทึกข้อมูลการแจ้งเบิกได้",
        });
        console.error(error);
      }
    };

    const confirmUpdateNotwith = (index) => {
      Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณไม่ต้องการเบิกใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then((result) => {
        if (result.isConfirmed) {
          updateNotwith();
        }
      });
    };

    const updateNotwith = async () => {
      if (!selectedUserTab2.value.mainr_ID) {
        console.error("mainr_ID is missing in selectedUserTab3:", selectedUserTab2.value);
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถปรับปรุงสถานะ",
          text: "ข้อมูล mainr_ID ไม่ถูกต้อง",
        });
        return;
      }

      try {
        const response = await axios.put(`/api/auth/updateStatusNotwith`, {
          mainr_ID: selectedUserTab2.value.mainr_ID,
        });

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "เรียบร้อย",
            text: "การซ่อมไม่ต้องการเบิกถูกบันทึกแล้ว",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถบันทึกได้",
          });
        }
      } catch (error) {
        console.error("Error updating status:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการเรียกใช้ API",
          text: "ไม่สามารถบันทึกได้",
        });
      }
    };

    const assessProblemReqTab2 = async (selectedUser) => {};
    const assessProblemReqTab3 = async (selectedUser) => {};

    onMounted(() => {
      fetchRequestsTab1();
      fetchgetStatusReq();
    });

    

    return {
      activeTab,
      searchQueryTab1,
      searchQueryTab2,
      searchQueryTab3,
      searchQueryStock,
      paginatedItemsTab1,
      paginatedItemsTab3,
      paginatedWithdrawItems,
      totalPagesTab1,
      totalPagesTab3,
      totalWithdrawPages,
      rowsPerPageTab1,
      rowsPerPageTab3,
      rowsPerPageWithdraw,
      rowsPerPageStock,
      currentPageTab1,
      currentPageTab3,
      currentPageWithdraw,
      currentPageStock,
      visibleModelDetailRequestTab1,
      visibleModelDetailRequestTab2,
      visibleModelDetailRequestTab3,
      visibleModelStockWithdraw,
      visibleModelStockAmount,
      visibleStatusModal,
      closeModelDetailRequestTab1,
      closeModelDetailRequestTab2,
      closeModelDetailRequestTab3,
      closeModelStockAmount,
      closeStatusModal,
      closeModelStockWithdraw,
      showModalTab1,
      showModalTab2,
      showModalTab3,
      showModelStockWithdraw,
      showModelStockAmount,
      showStatusModal,
      selectedUserTab1,
      selectedUserTab2,
      selectedUserTab3,
      stockItems,
      selectedStockItems,
      paginatedStockItems,
      totalPagesStock,
      imageUrls,
      getImageUrl,
      openImageModal,
      closeImageModalOnly,
      visibleImageModal,
      currentImageIndex,
      handlePreviousImage,
      handleNextImage,
      addSelectedStock,
      submitStockSelection,
      submitAmountSelection,
      assessProblemReqTab1,
      assessProblemReqTab2,
      assessProblemReqTab3,
      setActiveTab,
      selectedStockAmount,
      selectedStockToEdit,
      removeSelectedStock,
      editSelectedStock,
      submitRequisition,
      statusUser,
      handleSubmitTooltip01,
      updateStatus,
      updateNotsuccess,
      confirmUpdateNotsuccess,
      confirmUpdateNotwith,
      updateNotwith,
      resStatus,
    };
  },
};
</script>

<style scoped>
.card-body p {
  margin: 0;
}

.date {
  font-weight: bold;
  color: white;
}

.cancelButton {
  color: white;
}
.frontwhite {
  color: white;
}

.status {
  font-size: 18px;
  color: rgb(228, 148, 0);
  text-align: right;
  margin-top: 10px;
}

.card-modern {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}

.card-modern:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-header-modern {
  color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 10px;
}

.card-title-modern {
  font-size: 1.2rem;
  font-weight: bold;
}

.date-modern {
  font-weight: bold;
  color: #e0e0e0;
}

.status-modern {
  font-size: 16px;
  color: #ff9800;
  text-align: right;
}

.cancelButton-modern {
  width: 100%;
  color: white;
  background-color: #f44336;
  border-radius: 5px;
  padding: 10px;
}

.card-footer-modern {
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.btnAdd {
  margin-bottom: 10px;
}
.btn-modern {
  background-color: #6c757d;
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn-modern:hover {
  background-color: #5a6268;
}

.form-select-modern {
  border-radius: 5px;
  padding: 5px;
  border: 1px solid #ced4da;
}

/* Custom styles */

.swal2-popup {
  max-width: 195vw; /* กำหนดให้ SweetAlert2 มีขนาดสูงสุด 95% ของหน้าจอ */
}
.swal2-input {
  padding: 16px;
  height: 500px;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
}

.swal2-radio {
  margin-right: 10px;
}

.swal2-radio + label {
  margin-bottom: 8px;
  font-size: 14px;
}

.swal2-radio:checked + label {
  color: #007bff;
}

.swal-textarea {
  width: 100%; /* กำหนดความกว้างเต็ม */
  height: 1550px; /* เพิ่มความสูงตามที่ต้องการ */
  padding: 16px;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
}
</style>
