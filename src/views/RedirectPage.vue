<template>
    <div class="redirect-container">
      <p v-if="loading">正在处理跳转...</p>
      <p v-else-if="error">{{ error }}</p>
    </div>
  </template>
  
<script>
import axios from 'axios';

export default {
name: 'RedirectPage',
data() {
    return {
    loading: true,
    error: null,
    };
},
mounted() {
    this.handleRedirect();
},
methods: {
    handleRedirect() {
    // 获取 URL 中的 cmd 和 redirecturl 参数
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const cmd = urlParams.get('cmd');
    console.log('cmd:', cmd);
    const redirectUrl = urlParams.get('redirecturl');

    if (!cmd) {
        this.error = '缺少 cmd 参数';
        this.loading = false;
        return;
    }

    // 使用 axios 发送请求到后端进行解密和验证
    axios.get('https://172.160.11.205:443/RedirectPage', {
        params: { cmd },
    })
    .then(response => {
        const { isValid, message } = response.data;
        if (isValid) {
        // 如果验证通过，跳转到 redirecturl 或首页
        window.location.href = redirectUrl || '/';
        } else {
        window.location.href ='/login';
        // 如果验证失败，显示错误信息
        this.error = `访问被拒绝: ${message}`;
        }
    })
    .catch(error => {
        window.location.href ='/login';
        this.error = '解密失败: ' + error.message;
    })
    .finally(() => {
        this.loading = false;
    });
    },
},
};
</script>

<style scoped>
.redirect-container {
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
font-size: 18px;
}
</style>
  
