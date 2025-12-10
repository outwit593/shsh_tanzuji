<template>
    <div id="app" class="app-container">
      <div class="main-content" style="overflow-y: auto;">
        <!-- 时间选择框 -->
        <div class="select-row">
          <div class="select-wrapper">
            <label for="year-month-select">选择年月</label>
            <el-date-picker
              v-model="selectedDate"
              type="month"
              placeholder="选择年和月"
              @change="fetchCarbonFootprintData">
            </el-date-picker>
          </div>
        </div>
  
        <!-- 直接显示柴油的图片 -->
        <div class="diesels-container">
          <div>
            <img :src="getImagePath()" alt="Diesel Image" class="diesel-img" @click="showDieselData">
          </div>
        </div>
  
        <!-- 弹窗 -->
        <div v-if="showModal" class="modal-overlay" :style="{ top: modalPosition.y + 'px', left: modalPosition.x + 'px' }">
          <p>装置物料加工量: {{ currentDevice.material_processing_amount }}(吨)</p>
          <p>装置生产过程碳排总量: {{ currentDevice.total_carbon_emissions }}(tCO2)</p>
          <p>装置生产过程单位加工量碳排: {{ currentDevice.carbon_emissions_per_unit }}(tCO2/t)</p>
          <p>装置出料携带碳排: {{ currentDevice.carbon_emissions_in_output }}(kgCO2/t)</p>
          <button @click="closeModal">关闭</button>
        </div>
  
        <router-view />
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import dayjs from 'dayjs';
  
  export default {
    name: 'App',
    data() {
      return {
        selectedDate: '2022-01',
        diesel: { id: 1, name: '柴油', image: '柴油.png' },
        currentDevice: null,
        showModal: false,
        modalPosition: { x: 0, y: 0 },
      };
    },
    methods: {
      getImagePath() {
        // 返回固定的图片路径
        return require('@/icons/image/labelimage/2022diesel-image/柴油.png');
      },
      fetchData(deviceName) {
        const yearMonth = dayjs(this.selectedDate).format('YYYY-MM');
        axios.get(`https://172.160.11.205:443/get_device_data?device_name=${deviceName}&yearMonth=${yearMonth}`)
          .then(response => {
            this.currentDevice = response.data;
            this.showModal = true; // 显示弹窗
          })
          .catch(error => {
            console.error("There was an error!", error);
          });
      },
      async fetchCarbonFootprintData() {
        try {
          const yearMonth = dayjs(this.selectedDate).format('YYYY-MM');
          // const response = await axios.get(`http://127.0.0.1:5000/api/carbon-footprint?yearMonth=${yearMonth}`);
          console.log('Response status:', response.status);
          console.log('Response data:', response.data);
        } catch (error) {
          console.error('Error fetching carbon footprint data:', error);
          this.useDefaultData();
        }
      },
      useDefaultData() {
        // 可以在这里定义默认数据逻辑
      },
      showDieselData(event) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let deviceName = '';
  
        // 根据点击位置处理逻辑
        if (x < 460 && x > 355 && y > 47 && y < 189) {
          deviceName = 'device0';
        } else if (x < 460 && x > 355 && y > 245 && y < 371) {
          deviceName = 'device1';
        } else if (x < 460 && x > 355 && y > 431 && y < 591) {
          deviceName = 'device2';
        } else if (x < 460 && x > 355 && y > 610 && y < 755) {
          deviceName = 'device3';
        } else if (x < 460 && x > 355 && y > 804 && y < 1034) {
          deviceName = 'device7';
        } else if (x < 460 && x > 355 && y > 1065 && y < 1316) {
          deviceName = 'device8';
        } else if (x < 1119 && x > 1014 && y > 139 && y < 333) {
          deviceName = 'device9';
        } else if (x < 1119 && x > 1014 && y > 355 && y < 525) {
          deviceName = 'device10';
        } else if (x < 1119 && x > 1014 && y > 559 && y < 743) {
          deviceName = 'device11';
        } else if (x < 1107 && x > 1003 && y > 884 && y < 1045) {
          deviceName = 'device12';
        } else if (x < 1107 && x > 1003 && y > 1137 && y < 1345) {
          deviceName = 'device13';
        } else if (x < 1858 && x > 1771 && y > 0 && y < 90) {
          deviceName = 'device4';
        } else if (x < 1848 && x > 1740 && y > 393 && y < 519) {
          deviceName = 'device5';
        } else if (x < 1852 && x > 1746 && y > 835 && y < 961) {
          deviceName = 'device6';
        } else if (x < 2536 && x > 2419 && y > 207 && y < 407) {
          deviceName = 'device24';
        } else if (x < 2575 && x > 2477 && y > 995 && y < 1139) {
          deviceName = 'device25';
        } else {
          this.showModal = false;
        }
        console.log('点击了乙烯图片，相对于图片的坐标：', x, y);
        this.modalPosition = { x: event.clientX, y: event.clientY };
        if (deviceName) {
          this.fetchData(deviceName);
        }
      },
      closeModal() {
        this.showModal = false;
      }
    },
    watch: {
      selectedDate(newDate) {
        this.fetchCarbonFootprintData();
      }
    },
    mounted() {
      this.useDefaultData();
      console.log('Mounted with default data');
    }
  };
  </script>
  
  
  <style>
.app-container {
  display: flex;
  margin-top: 10px;
}

.main-content {
  flex: 4;
  text-align: center;
}

.select-row {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  position: absolute;
  top: 10px;
  left: 10px;
}

.select-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  margin-left: 130px;
  font-family: '宋体', SimSun, sans-serif;
}

.select-wrapper label {
  font-size: 20px;
  font-weight: normal;
  margin-right: 10px;
  margin-left: 130px;
  /* margin-top: 10px; */
}

.el-date-picker:hover {
    border-color: #888;
  }
  
  .el-date-picker:focus {
    border-color: #555;
    outline: none;
  }

.diesels-container {
  width: fit-content;
  height: auto;
  overflow-x: auto;
}

.diesel-img {
  position: relative;
  margin-top: 100px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  transform-origin: top left;
  transform: scale(0.1);
}

.modal-overlay {
  z-index: 99999;
  position: fixed; /* 绝对定位 */
  top: 0;
  left: 0;
  width: auto; /* 设置宽度为100% */
  height: auto; /* 设置高度为100% */
  background-color: rgb(255, 255, 255); /* 半透明黑色背景 */
}

.el-picker-panel {
  width: 320px !important;
}

.el-month-table td {
  padding: 10px;
}

.el-date-picker:hover {
  border-color: #888;
}

.el-date-picker:focus {
  border-color: #555;
  outline: none;
}

.el-date-picker__header .el-input {
  color: #000; /* Adjust text color to ensure visibility */
}
</style>
