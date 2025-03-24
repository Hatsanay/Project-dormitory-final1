<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center bg-light">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="6">
          <CCardGroup>
            <CCard class="p-4 shadow-lg rounded">
              <CCardBody>
                <CForm @submit.prevent="login">
                  <div class="text-center mb-4">
                    <h1 class="display-4">Login</h1>
                    <p class="text-muted">Sign in to your account</p>
                  </div>

                  <CInputGroup class="mb-3">
                    <CInputGroupText class="bg-primary text-white">
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="username"
                      placeholder="Username"
                      autocomplete="username"
                      required
                    />
                  </CInputGroup>

                  <CInputGroup class="mb-4">
                    <CInputGroupText class="bg-primary text-white">
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="password"
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                      required
                    />
                  </CInputGroup>

                  <CRow>
                    <CCol :xs="12">
                      <CButton
                        type="submit"
                        color="primary"
                        class="btn-lg btnlogin"
                        :disabled="isLoading"
                      >
                        <span v-if="isLoading"> <CSpinner size="sm" /> Loading... </span>
                        <span v-else>Login</span>
                      </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <!-- Uncomment if you need the forgot password feature -->
                      <!-- <CButton color="link" class="px-0"> Forgot password? </CButton> -->
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>

    <CToaster class="p-3" placement="top-end">
      <CToast v-for="(toast, index) in toasts" :key="index" visible>
        <CToastHeader closeButton class="bg-primary text-white">
          <span class="me-auto fw-bold">{{ toast.title }}</span>
        </CToastHeader>
        <CToastBody>{{ toast.content }}</CToastBody>
      </CToast>
    </CToaster>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginFormComponent",
  data() {
    return {
      username: "",
      password: "",
      isLoading: false,
      toasts: [],
    };
  },
  methods: {
    createToast(st, er) {
      this.toasts.push({ title: st, content: er });
      setTimeout(() => {
        this.toasts.shift();
      }, 5000);
    },
    login() {
      this.isLoading = true;
      axios
        .post("/api/auth/login", {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          const { token, permissions, id } = response.data;
          localStorage.setItem("token", token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          this.$router.push("/dashboard");
        })
        .catch((error) => {
          console.error("Login error:", error);
          const errorStatus = error.response
            ? `Error Status ${error.response.status}`
            : "An error occurred";
          const errorMessage =
            error.response && error.response.data && error.response.data.error
              ? error.response.data.error
              : "An error occurred during login. Please try again.";
          this.createToast(errorStatus, errorMessage);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.wrapper {
  /* background-image: url('/path-to-your-background-image.jpg'); */
  background-size: cover;
  background-position: center;
}
h1 {
  color: #007bff;
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
.btnlogin{
  width: 100%;
}

.shadow-lg {
  border-radius: 10px;
}
</style>
