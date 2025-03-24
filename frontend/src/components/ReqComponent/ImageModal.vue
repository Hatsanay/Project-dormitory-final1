<!-- ImageModal.vue -->
<template>
  <CModal alignment="center" v-if="visible" @close.stop="close" size="lg">
    <CModalHeader>
      <CModalTitle>ดูรูปภาพ</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <img :src="imageUrl" alt="รูปภาพขยาย" style="width: 100%; height: auto" />
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click.stop="close">Close</CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
export default {
  name: "ImageModal",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  emits: ["close"],
  methods: {
    close() {
      console.log("Closing Image Modal");
      this.$emit("close");
    },
  },
  watch: {
    visible(newVal) {
      console.log("ImageModal visibility:", newVal);
    },
    imageUrl(newVal) {
      console.log("ImageModal imageUrl:", newVal);
    },
  },
};
</script>

<style scoped>
/* คุณสามารถเพิ่มสไตล์เพิ่มเติมได้ที่นี่ */
</style>
