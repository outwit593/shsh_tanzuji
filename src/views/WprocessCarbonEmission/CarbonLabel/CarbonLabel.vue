<template>
  <div id="app" class="app-container">
    <div class="main-content">
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
        <div v-for="diesel in diesels" :key="diesel.id" class="diesel">
          <h3>{{ diesel.name }}</h3>
          <img :src="getImagePath(diesel.image)" alt="Diesel Image" class="diesel-image">
          <h4>碳排放量：{{ diesel.carbonFootprint }}tCO<sub>2</sub>e/t</h4>
        </div>
      </div>
      <div v-if="selectedOption.includes('燃料油')" class="fuels-container">
        <div v-for="fuel in fuels" :key="fuel.id" class="fuel">
          <h3>{{ fuel.name }}</h3>
          <img :src="getImagePath(fuel.image)" alt="Fuel Image" class="fuel-image">
          <h4>碳排放量：{{ fuel.carbonFootprint }}tCO<sub>2</sub>e/t</h4>  
        </div>
      </div>
      <div v-if="selectedOption.includes('其他产品')" >
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'App',
  data() {
    return {
      selectedYear: '',
      selectedOption: '',
      productOptions: [],
      diesels: [],
      fuels: [],
      defaultData: {
        '2022年': {
          diesels: [
            { id: 1, name: '0号出口轻柴油', carbonFootprint:  0, image: 'label1.jpg' },
            { id: 2, name: '0号车用柴油(Ⅵ)', carbonFootprint: 0, image: 'label1.jpg' },
            { id: 3, name: '0号出口车用柴油', carbonFootprint: 0, image: 'label1.jpg' }
          ],
          fuels: [
            { id: 4, name: 'RMG180船用燃料油(Ⅱ)', carbonFootprint: 0, image: 'label2.jpg' },
            { id: 5, name: 'RMG380CST', carbonFootprint: 0, image: 'label2.jpg' },
            { id: 6, name: 'LSMGO', carbonFootprint: 0, image: 'label2.jpg' },
            { id: 7, name: '轻质燃料油', carbonFootprint: 0, image: 'label2.jpg' },
            { id: 8, name: '燃料油组分', carbonFootprint: 0, image: 'label2.jpg' },
            { id: 9, name: '低硫船用燃料油', carbonFootprint: 0, image: 'label2.jpg' }
          ]
        },
        '2023年': {
          diesels: [
            { id: 10, name: '0号出口轻柴油', carbonFootprint: 0, image: 'label3.jpg' },
            { id: 11, name: '0号车用柴油(Ⅵ)', carbonFootprint: 0, image: 'label3.jpg' },
            { id: 12, name: '0号出口车用柴油', carbonFootprint: 0, image: 'label3.jpg' }
          ],
          fuels: [
            { id: 13, name: 'RMG180船用燃料油(Ⅱ)', carbonFootprint: 0, image: 'label4.jpg' },
            { id: 14, name: 'RMG380CST', carbonFootprint: 0, image: 'label4.jpg' },
            { id: 15, name: 'LSMGO', carbonFootprint: 0, image: 'label4.jpg' },
            { id: 16, name: '轻质燃料油', carbonFootprint: 0, image: 'label4.jpg' },
            { id: 17, name: '燃料油组分', carbonFootprint: 0, image: 'label4.jpg' },
            { id: 18, name: '低硫船用燃料油', carbonFootprint: 0, image: 'label4.jpg' }
          ]
        }
      }
    };
  },
  methods: {
  updateProductOptions() {
    if (this.selectedYear) {
      this.productOptions = ['柴油', '燃料油','其他产品'];
      this.fetchCarbonFootprintData();
    } else {
      this.productOptions = [];
    }
    this.selectedOption = ''; 
  },

  async fetchCarbonFootprintData() {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/carbon-footprint?year=${this.selectedYear}`);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      if (response.data && response.data.diesels && response.data.fuels) {
        this.diesels = response.data.diesels;
        this.fuels = response.data.fuels;
      } else {
        this.useDefaultData();
      }
    } catch (error) {
      console.error('Error fetching carbon footprint data:', error);
      this.useDefaultData();
    }
  },

  useDefaultData() {
    this.diesels = this.defaultData[this.selectedYear]?.diesels || [];
    this.fuels = this.defaultData[this.selectedYear]?.fuels || [];
  },

  getImagePath(image) {
    const year = this.selectedYear.substring(0, 4);
    let folder = '';

    if (this.selectedOption.includes('柴油')) {
      folder = 'diesel-image';
    } else if (this.selectedOption.includes('燃料油')) {
      folder = 'fuel-image';
    }
    return require(`@/icons/image/productlabelimage/${year}${folder}/${image}`);
  }
}
,
  mounted() {
    // 设置默认数据
    this.diesels = this.defaultData['2022年'].diesels;
    this.fuels = this.defaultData['2022年'].fuels;
    console.log('Mounted with default data'); // 调试信息
    console.log('Selected Year:', this.selectedYear); // 调试信息
    console.log('Diesels:', this.diesels); // 调试信息
    console.log('Fuels:', this.fuels);     // 调试信息
  }
}
</script>


<style>

.app-container {
display: flex;
margin-top: 10px;
}


.main-content {
flex: 4; /* 调整宽度占比 */
text-align: center;
}

.select-row {
  display: flex;
  /* justify-content; */
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
  font-weight: bold; /* 加粗 */
 
}
.selectoption:hover {
border-color: #888; /* 鼠标悬浮时改变边框颜色 */
}

.selectoption:focus {
border-color: #555; /* 选择框聚焦时边框颜色 */
outline: none; /* 去掉默认的焦点轮廓 */
}
label {
  float: left; 
  width: auto; 
  font-size: 20px; 
  margin-right: 10px; 
  margin-left: 230px; 
}

.diesels-container, .fuels-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5列布局 */
  gap: 20px; /* 格子间距 */
  padding: 20px; /* 内边距 */
}

.diesel, .fuel {
  background: white;
  border: 1px solid #ddd;
  padding: 10px;
  transition: box-shadow 0.3s;
}

.diesel:hover, .fuel:hover {
  box-shadow: 0 0 11px rgba(33,33,33,.2);
}

h1, h2 ,h4,h3{
  color: #000000;
  font-family: '宋体', SimSun, sans-serif;
}

p {
  font-size: 16px;
  font-family: '宋体', SimSun, sans-serif;
}

.diesel img, .fuel img {
  max-width: 150px; /* 设置图片的最大宽度 */
  height: 130px; /* 高度自动调整以保持宽高比 */
}

/* 仅对具体类或元素应用宋体 */
.app-container, .select-wrapper, .diesel, .fuel {
font-family: '宋体', SimSun, sans-serif;
}

</style>