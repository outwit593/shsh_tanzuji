<template>
  <div id="app" class="app-container">
    <div class="main-content" style="overflow-y: auto;">
      <!-- 选择框行容器 -->
      <div class="select-row">
        <!-- 年份选择下拉框 -->
        <div class="select-wrapper">
          <label for="year-select">时间</label>
          <select id="year-select" v-model="selectedYear" class="selectoption year-select" @change="updateProductOptions">
            <option disabled value="">请选择年份</option>
            <option>2022年</option>
            <option>2023年</option>
          </select>
        </div>
        <!-- 产品选择下拉框 -->
        <div class="select-wrapper">
          <label for="product-select">产品类型</label>
          <select id="product-select" v-model="selectedOption" class="selectoption">
            <option disabled value="" v-if="productOptions.length === 0">请先选择年份</option>
            <option disabled value="">请选择一个产品</option>
            <option v-for="option in productOptions" :value="option">{{ option }}</option>
          </select>
        </div>
      </div>
      <!-- 产品信息显示 -->
      <div v-if="selectedOption.includes('柴油')" class="diesels-container">
        <!--<div class="input-container">
          <input type="text" v-model="input1" class="input-text" placeholder="原油开采排放系数">
          <input type="text" v-model="input2" class="input-text" placeholder="原油运输排放系数">
          <input type="text" v-model="input3" class="input-text" placeholder="外购煤柴油（吨）">
          <input type="text" v-model="input4" class="input-text" placeholder="外购重质回收油（吨）">
          <button @click="sendDataToBackend" class="submit-button">提交</button>
        </div>-->
        <div >
          <img :src="getImagePath(diesel.image)" alt="Diesel Image" class="diesel-img" @click="showDieselData">
        </div>
      </div>
      <div v-if="selectedOption.includes('乙烯')" class="ethylenes-container">
        <div >
          <img :src="getImagePath(ethylene.image)" alt="Ethylene Image" class="ethylene-img" @click="showEthyleneData">
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

export default {
  name: 'App',
  components: {
    // NavBar
  },
  data() {
    return {
      selectedYear: '',
      selectedOption: '',
      productOptions: [],
      diesel:  { id: 1, name: '柴油' ,image:'柴油.png' },
      ethylene:{ id: 2, name: '乙烯', image: '乙烯.png' },
      input1: '',
      input2: '',
      input3: '',
      input4: '',
      currentDevice: null, // 用于存储当前装置的数据
      showModal: false, // 控制弹窗显示
      modalPosition: { x: 0, y: 0 }, // 弹框位置
    }
  },
  methods: {
    updateProductOptions() {
      if (this.selectedYear === '2022年') {
        this.productOptions = ['柴油', '乙烯'];
      } else if (this.selectedYear === '2023年') {
        this.productOptions = ['柴油', '乙烯'];
      } else {
        this.productOptions = [];
      }
      this.selectedOption = ''; // 
    },

    getImagePath(image) {
      const yearPrefix = this.selectedYear.substring(0, 4); // 2022/2023
      let folder = 'diesel'; // 
      if (this.selectedOption.includes('乙烯')) {
        folder = 'ethylene';
      } 
      return require(`@/icons/image/labelimage/${yearPrefix}${folder}-image/${image}`);
    },
    fetchData(deviceName) {
      axios.get(`http://127.0.0.1:5000/get_device_data?device_name=${deviceName}`)
        .then(response => {
          this.currentDevice = response.data;
          this.showModal = true; // 显示弹窗
        })
        .catch(error => {
          console.error("There was an error!", error);
        });
    },
    sendDataToBackend() {
      const data = {
        原油开采排放系数: this.input1,
        原油运输排放系数: this.input2,
        外购煤柴油: this.input3,
        外购重质回收油: this.input4
      };

      // 使用axios或其他适当的方法将数据发送到后端
      axios.post('http://127.0.0.1:5000/calculate', { data })
        .then(response => {
          console.log('Data sent successfully:', response);
        })
        .catch(error => {
          console.error('Error sending data:', error);
        });
    },
    showDieselData(event) {
      // 获取点击图片时相对于图片的坐标
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let deviceName = '';
      if(x<460&&x>355&&y>47&&y<189){
        // console.log('点击了2#常减压装置，相对于图片的坐标：', x, y);
        deviceName = 'device0';
      }
      else if(x<460&&x>355&&y>245&&y<371){
        // console.log('点击了3#常减压装置，相对于图片的坐标：', x, y);
        deviceName = 'device1'
      } 
      else if(x<460&&x>355&&y>431&&y<591){
        // console.log('点击了1#延迟焦化装置，相对于图片的坐标：', x, y);
        deviceName = 'device2'
      }  
      else if(x<460&&x>355&&y>610&&y<755){
        // console.log('点击了2#延迟焦化装置，相对于图片的坐标：', x, y);
        deviceName = 'device3'
      } 
      else if(x<460&&x>355&&y>804&&y<1034){
        // console.log('点击了渣油加氢装置，相对于图片的坐标：', x, y);
        deviceName = 'device7'
      }
      else if(x<460&&x>355&&y>1065&&y<1316){
        // console.log('点击了2#催化裂化装置，相对于图片的坐标：', x, y);
        deviceName = 'device8'
      }  
      else if(x<1119&&x>1014&&y>139&&y<333){
        // console.log('点击了加氢裂化装置，相对于图片的坐标：', x, y);
        deviceName = 'device9'
      } 
      else if(x<1119&&x>1014&&y>355&&y<525){
        // console.log('点击了中压加氢裂化装置，相对于图片的坐标：', x, y);
        deviceName = 'device10'
      } 
      else if(x<1119&&x>1014&&y>559&&y<743){
        // console.log('点击了1#柴油加氢装置，相对于图片的坐标：', x, y);
        deviceName = 'device11'
      }  
      else if(x<1107&&x>1003&&y>884&&y<1045){
        // console.log('点击了加氢改质装置，相对于图片的坐标：', x, y);
        deviceName = 'device12'
      }
      else if(x<1107&&x>1003&&y>1137&&y<1345){
        // console.log('点击了3#柴油加氢装置，相对于图片的坐标：', x, y);
        deviceName = 'device113'
      } 
      else if(x<1858&&x>1771&&y>0&&y<90){
        // console.log('点击了1#制氢装置，相对于图片的坐标：', x, y);
        deviceName = 'device4'
      } 
      else if(x<1848&&x>1740&&y>393&&y<519){
        // console.log('点击了2#制氢装置，相对于图片的坐标：', x, y);
        deviceName = 'device5'
      } 
      else if(x<1852&&x>1746&&y>835&&y<961){
        // console.log('点击了3#制氢装置，相对于图片的坐标：', x, y);
        deviceName = 'device6'
      } 
      else if(x<2536&&x>2419&&y>207&&y<407){
        // console.log('点击了柴油调合装置，相对于图片的坐标：', x, y);
        deviceName = 'device24'
      } 
      else if(x<2575&&x>2477&&y>995&&y<1139){
        // console.log('点击了燃料油调和装置，相对于图片的坐标：', x, y);
        deviceName = 'device25'
      }
      else{
        this.showModal = false;
      }       
      console.log('点击了柴油图片，相对于图片的坐标：', x, y);
      // 根据坐标位置处理逻辑，例如根据点击位置显示相应的数据
      // 这里只是示例，你需要根据具体需求进行逻辑处理
      this.modalPosition = { x:event.clientX, y:event.clientY };
      if (deviceName) {
        this.fetchData(deviceName);
      }
    },
    showEthyleneData(event) {
      // 获取点击图片时相对于图片的坐标
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let deviceName = '';
      if(x<347&&x>266&&y>89&y<193){
        // console.log('点击了2#常减压装置，相对于图片的坐标：', x, y);
        deviceName = 'device0';
      }
      else if(x<347&&x>266&&y>237&&y<331){
        // console.log('点击了3#常减压装置，相对于图片的坐标：', x, y);
        deviceName = 'device1'
      } 
      else if(x<347&&x>266&&y>377&&y<496){
        // console.log('点击了1#延迟焦化装置，相对于图片的坐标：', x, y);
        deviceName = 'device2'
      }  
      else if(x<347&&x>266&&y>511&&y<617){
        // console.log('点击了2#延迟焦化装置，相对于图片的坐标：', x, y);
        deviceName = 'device3'
      } 
      else if(x<347&&x>266&&y>656&&y<828){
        // console.log('点击了渣油加氢装置，相对于图片的坐标：', x, y);
        deviceName = 'device7'
      }
      else if(x<347&&x>266&&y>853&&y<1041){
        // console.log('点击了2#催化裂化装置，相对于图片的坐标：', x, y);
        deviceName = 'device8'
      }  
      else if(x<840&&x>761&&y>157&&y<303){
        // console.log('点击了加氢裂化装置，相对于图片的坐标：', x, y);
        deviceName = 'device9'
      } 
      else if(x<840&&x>761&&y>319&&y<447){
        // console.log('点击了中压加氢裂化装置，相对于图片的坐标：', x, y);
        deviceName = 'device10'
      } 
      else if(x<840&&x>761&&y>497&&y<591){
        // console.log('点击了1#柴油加氢装置，相对于图片的坐标：', x, y);
        deviceName = 'device11'
      }  
      else if(x<830&&x>752&&y>717&&y<838){
        // console.log('点击了加氢改质装置，相对于图片的坐标：', x, y);
        deviceName = 'device12'
      }
      else if(x<830&&x>752&&y>907&&y<1061){
        // console.log('点击了3#柴油加氢装置，相对于图片的坐标：', x, y);
        deviceName = 'device13'
      } 
      else if(x<1396&&x>1311&&y>0&&y<67){
        // console.log('点击了1#制氢装置，相对于图片的坐标：', x, y);
        deviceName = 'device4'
      } 
      else if(x<1380&&x>1306&&y>361&&y<441){
        // console.log('点击了2#制氢装置，相对于图片的坐标：', x, y);
        deviceName = 'device5'
      } 
      else if(x<1388&&x>1309&&y>680&&y<775){
        // console.log('点击了3#制氢装置，相对于图片的坐标：', x, y);
        deviceName = 'device6'
      } 
      else if(x<830&&x>752&&y>1193&&y<1287){
        // console.log('点击了催化双脱装置，相对于图片的坐标：', x, y);
        deviceName = 'device14'
      } 
      else if(x<1386&&x>1308&&y>1049&&y<1144){
        // console.log('点击了产品精制装置，相对于图片的坐标：', x, y);
        deviceName = 'device15'
      }
      else if(x<1386&&x>1308&&y>1177&&y<1258){
        // console.log('点击了2#气体分离装置，相对于图片的坐标：', x, y);
        deviceName = 'device16'
      }
      else if(x<1781&&x>1706&&y>250&&y<331){
        // console.log('点击了2#轻烃回收装置，相对于图片的坐标：', x, y);
        deviceName = 'device17'
      }
      else if(x<1781&&x>1706&&y>472&&y<563){
        // console.log('点击了3#轻烃回收装置，相对于图片的坐标：', x, y);
        deviceName = 'device18'
      }
      else if(x<1792&&x>1713&&y>809&&y<904){
        // console.log('点击了C2回收装置，相对于图片的坐标：', x, y);
        deviceName = 'device19'
      }
      else if(x<2122&&x>2036&&y>93&&y<213){
        // console.log('点击了石脑油预加氢装置，相对于图片的坐标：', x, y);
        deviceName = 'device20'
      }
      else if(x<2136&&x>2040&&y>548&&y<637){
        // console.log('点击了清洁汽油组分（烷基化）装置，相对于图片的坐标：', x, y);
        deviceName = 'device21'
      }
      else if(x<2136&&x>2046&&y>709&&y<815){
        // console.log('点击了气体脱硫回收装置，相对于图片的坐标：', x, y);
        deviceName = 'device22'
      }
      else if(x<2560&&x>2474&&y>97&&y<217){
        // console.log('点击了化轻调合装置，相对于图片的坐标：', x, y);
        deviceName = 'device23'
      }
      else if(x<2996&&x>2916&&y>121&&y<216){
        // console.log('点击了1#脱硫装置，相对于图片的坐标：', x, y);
        deviceName = 'device26'
      }
      else if(x<2996&&x>2916&&y>405&&y<497){
        // console.log('点击了2#脱硫装置，相对于图片的坐标：', x, y);
        deviceName = 'device27'
      }
      else if(x<2996&&x>2916&&y>555&&y<651){
        // console.log('点击了3#脱硫装置，相对于图片的坐标：', x, y);
        deviceName = 'device28'
      }
      else if(x<2996&&x>2916&&y>718&&y<792){
        // console.log('点击了4#脱硫装置，相对于图片的坐标：', x, y);
        deviceName = 'device29'
      }
      else if(x<2996&&x>2916&&y>1028&&y<1123){
        // console.log('点击了混合芳烃委外装置（雪垠），相对于图片的坐标：', x, y);
        deviceName = 'device30'
      }
      else if(x<3946&&x>3750&&y>0&&y<325){
        // console.log('点击了2#裂解分离装置，相对于图片的坐标：', x, y);
        deviceName = 'device31'
      }
      else if(x<3828&&x>3750&&y>545&&y<656){
        // console.log('点击了2#汽油加氢装置，相对于图片的坐标：', x, y);
        deviceName = 'device32'
      }
      else if(x<3828&&x>3750&&y>923&&y<1041){
        // console.log('点击了4#汽油加氢装置，相对于图片的坐标：', x, y);
        deviceName = 'device33'
      }
      else if(x<4508&&x>4429&&y>196&&y<290){
        // console.log('点击了1#重整装置，相对于图片的坐标：', x, y);
        deviceName = 'device34'
      }
      else if(x<4508&&x>4429&&y>335&&y<445){
        // console.log('点击了2#重整装置，相对于图片的坐标：', x, y);
        deviceName = 'device35'
      }
      else if(x<4508&&x>4429&&y>488&&y<609){
        // console.log('点击了3#重整装置，相对于图片的坐标：', x, y);
        deviceName = 'device36'
      }
      else if(x<4498&&x>4420&&y>881&&y<993){
        // console.log('点击了1#抽提装置，相对于图片的坐标：', x, y);
        deviceName = 'device37'
      }
      else if(x<4498&&x>4420&&y>1057&&y<1167){
        // console.log('点击了4#氢气提纯装置，相对于图片的坐标：', x, y);
        deviceName = 'device38'
      }
      else if(x<5004&&x>4924&&y>171&&y<331){
        // console.log('点击了2#二甲苯装置，相对于图片的坐标：', x, y);
        deviceName = 'device39'
      }
      else if(x<5010&&x>4930&&y>445&&y<558){
        // console.log('点击了2#抽提装置，相对于图片的坐标：', x, y);
        deviceName = 'device40'
      }
      else if(x<5010&&x>4910&&y>747&&y<884){
        // console.log('点击了加氢汽油抽提，相对于图片的坐标：', x, y);
        deviceName = 'device41'
      }
      else if(x<4995&&x>4916&&y>1064&&y<1175){
        // console.log('点击了3#抽提装置，相对于图片的坐标：', x, y);
        deviceName = 'device42'
      }
      else if(x<5506&&x>5426&&y>197&&y<307){
        // console.log('点击了2#歧化装置，相对于图片的坐标：', x, y);
        deviceName = 'device43'
      }
      else if(x<5526&&x>5426&&y>373&&y<513){
        // console.log('点击了1#重整油分离装置，相对于图片的坐标：', x, y);
        deviceName = 'device44'
      }
      else if(x<5526&&x>5426&&y>681&&y<821){
        // console.log('点击了2#重整油分离装置，相对于图片的坐标：', x, y);
        deviceName = 'device45'
      }
      else if(x<5526&&x>5426&&y>941&&y<1080){
        // console.log('点击了3#重整油分离装置，相对于图片的坐标：', x, y);
        deviceName = 'device46'
      }
      else{
        this.showModal = false;
      }       
      console.log('点击了乙烯图片，相对于图片的坐标：', x, y);
      // 根据坐标位置处理逻辑，例如根据点击位置显示相应的数据
      // 这里只是示例，你需要根据具体需求进行逻辑处理
      this.modalPosition = { x:event.clientX, y:event.clientY };
      if (deviceName) {
        this.fetchData(deviceName);
      }
    },
    closeModal() {
      this.showModal = false;
    }
  },
  created() {
    this.updateProductOptions();
  }
}
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
  position: absolute; /* 设置绝对定位 */
  top: 10px; /* 调整输入框位置，可根据需要进行调整 */
  left: 10; /* 居中显示 */
  display: flex;
  align-items: center;
}
.select-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.selectoption {
  padding: 8px;
  float: left; 
  width: 180px; 
  margin-left: 10px; 
  border: 2px solid #000000;
  border-radius: 8px;
  font-family: '宋体', SimSun, sans-serif;
  font-weight: bold; 
}
.selectoption:hover {
  border-color: #888;
}
.selectoption:focus {
  border-color: #555;
  outline: none;
}
label {
  float: left; 
  width: auto; 
  font-size: 20px; 
  margin-right: 10px; 
  margin-left: 230px; 
}
.diesels-container, .ethylenes-container {
  width: fit-content; /* 设置容器宽度适合图片 */
  height: auto; /* 设置容器宽度适合图片 */
  overflow-x: auto; /* 允许水平滚动 */
}
.diesel:hover, .ethylene:hover {
  box-shadow: 0 0 11px rgba(33,33,33,.2);
}
.input-container {
  position: absolute; /* 设置绝对定位 */
  top: 80px; /* 调整输入框位置，可根据需要进行调整 */
  left: 45%; /* 居中显示 */
  transform: translateX(-50%); /* 水平居中 */
  display: flex;
  justify-content: space-between;
}

.input-text {
  padding: 8px;
  width: 200px; /* 调整输入框宽度 */
  border: 2px solid #000000;
  border-radius: 10px; /* 设置圆角矩形边框 */
  font-family: '宋体', SimSun, sans-serif;
  margin-right: 10px; /* 添加输入框之间的间隔 */
}
h1, h2 ,h4,h3 {
  color: #000000;
  font-family: '宋体', SimSun, sans-serif;
}
p {
  font-size: 16px;
  font-family: '宋体', SimSun, sans-serif;
}
.diesel-img {
  /* 修改了类名 */
  position: relative;
  margin-top: 100px; /* 调整图片顶部间距 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  transform-origin: top left;
  transform: scale(0.1);
}
.ethylene-img{
  /* 修改了类名 */
  position: relative;
  margin-top: 100px; /* 调整图片顶部间距 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  transform-origin: top left;
  transform: scale(0.15);
}

.app-container, .select-wrapper, .diesel, .ethylene {
  font-family: '宋体', SimSun, sans-serif;
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



</style>
