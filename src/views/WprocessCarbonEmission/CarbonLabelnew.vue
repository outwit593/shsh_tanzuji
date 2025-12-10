<template>
  <div class="CarbonLabelnew">
    <div class="CL-option">
      <p class="CarbonLabelTitle">{{ nameyear }}</p>
      <div class="Options">
        <el-select v-model="selectedYear" placeholder="请选择年份">
          <el-option label="2022年" value="2022"></el-option>
          <el-option label="2023年" value="2023"></el-option>
        </el-select>
      </div>
    </div>
    <!-- 主要产品下拉框 -->
    <div class="CL-option">
      <p class="CarbonLabelTitle">{{ name }}</p>
      <div class="Options">
        <el-select v-model="value" placeholder="请选择产品">
          <el-option
            v-for="item in options"
            :key="item.label"
            :label="item.label"
            :value="item.value"
            @click.native="handleOptionClick(item.label)"
          />
        </el-select>
      </div>
    </div>
    <div v-if="value" class="CL-optionimg">
      <div class="img-container">
        <!-- 使用 img 标签嵌入 SVG 文件 -->
        <img :src="value" class="CL-Img" style="width: 150%; height: 200%;">
      </div>
    </div>
    <div v-if="showTable" class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>装置名</th>
            <th>产品</th>
            <th>产品碳排</th>
            <th>装置碳排</th>
            <th>燃耗</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(material, index) in materials" :key="index">
            <td>{{ material.WKSP }}</td>
            <td>{{ material.output ? material.output.join(', ') : '' }}</td>
            <td>{{ material.output_c ? material.output_c.join(', ') : '' }}</td>
            <td>{{ material.c_output }}</td>
            <td>{{ material.e_output }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '产品',
      nameyear: '年份',
      options: [
        { value: require('@/icons/image/criticalproduct/绘图1_1.png'), label: '乙烯' },
        { value: require('@/icons/image/criticalproduct/Visio-柴油(1)_1.png'), label: '柴油' },
        { value: require('@/icons/image/criticalproduct/butadiene.png'), label: '丁二烯' },
        { value: require('@/icons/image/criticalproduct/benzene.png'), label: '苯' }
      ],
      showImg: false,
      value: '',
      materials: [],
      showTable: false
    };
  },
  methods: {
    fetchData() {
      axios.get('http://127.0.0.1:5000/test')
        .then(response => {
          this.materials = response.data;
        })
        .catch(error => {
          console.error("There was an error!", error);
        });
    },
    handleOptionClick(label) {
      if (label === '柴油') {
        this.showTable = true;
      } else {
        this.showTable = false;
      }
    },
  },
  created() {
    this.fetchData();
  }
};
</script>

<style lang="scss" scoped>

.CarbonLabelnew {
  display: flex;
}

.year-select {
  font-family: '宋体', sans-serif; /* 设置字体为宋体 */
  font-weight: bold; /* 设置字体加粗 */
}

.CL-option {
  position: relative;
  width: 100%;
  height: 100px;
  margin: 50px;
  margin-right: 20px; /* 添加间距 */
}

.CarbonLabelTitle {
  position: absolute;
  top: 20px;
  left: 0; /* 相对于父元素定位 */
  font-family: '宋体', sans-serif; /* 设置字体为宋体 */
  font-weight: bold; /* 设置字体加粗 */
  font-size: 20px;
}

.Options {
  position: absolute;
  float: left;
  width: 200px;
  left: 150px;
  top: 15px;
}

.CL-title {
  position: absolute;
  font-size: 25px;
  left: 500px;
  top: 100px;
  margin-bottom: 20px;
}

.CL-optionimg {
  position: absolute;
  top: 200px;
  height: 650px;
  width: 90%;
  left: 100px;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

.img-container {
  width: fit-content; /* 设置容器宽度适合图片 */
  overflow-x: auto; /* 允许水平滚动 */
}
.table-container {
  margin-top: 1000px; /* 调整表格与图片框之间的间距 */
}

.data-table {
  width: 90%; /* 表格宽度与图片框一致 */
  margin: 0 auto; /* 居中显示 */
  border-collapse: collapse; /* 边框重叠 */
}

.data-table th,
.data-table td {
  border: 1px solid #ccc; /* 表格边框样式 */
  padding: 8px; /* 单元格内边距 */
  text-align: center; /* 文字居中对齐 */
}
</style>