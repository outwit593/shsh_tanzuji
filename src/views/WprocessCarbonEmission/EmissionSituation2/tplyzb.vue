<template>
    <div>
      <div class="selectors-container">
        <select v-model="selectedYear" @change="fetchData">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
        <select v-model="selectedMonth" @change="fetchData">
          <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
        </select>
      </div>
  
      <div class="charts-container">
        <div v-for="device in devices" :key="device" class="pie-chart">
          <div :id="`chart-${device}`" style="width: 300px; height: 300px;"></div>
          <div class="legend-container">
            <div v-for="(color, energyType) in energyColors" :key="energyType" class="legend-item">
              <div class="color-box" :style="{ backgroundColor: color }"></div>
              <div class="legend-text">{{ energyType }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import * as echarts from 'echarts';
  
  export default {
    data() {
      return {
        years: ['2022', '2023'],
        months: Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')),
        selectedYear: '2022',
        selectedMonth: '01',
        energyStructure: [],
        energyColors: {
          '氮气': '#ff9999',
          '生产水': '#66b3ff',
          '凉水塔冷却循环水': '#99ff99',
          '脱盐水Ⅱ': '#ffcc99',
          '火力发电': '#c2c2f0',
          '工业风': '#e0f7fa',
          '低压蒸汽(13s)': '#8fb3e6',
          '超高压蒸汽': '#c2f0c2',
          '中压蒸汽(35-39s)': '#ff6666',
          '燃料气': '#8e448c',
          '生产过程': '#4a567f'

        },
        devices: [] // 存储装置名称
      };
    },
    methods: {
      async fetchData() {
        try {
          const response = await axios.get(`/lianyoubu-CO2-emissions`, {
            params: {
              year: this.selectedYear,
              month: this.selectedMonth
            }
          });
  
          if (response.status === 200) {
            this.energyStructure = response.data;
            this.devices = [...new Set(this.energyStructure.map(item => item.device))]; // 获取装置名称
            this.renderCharts();
          } else {
            console.error('Unexpected response status:', response.status);
          }
        } catch (error) {
          console.error('Error fetching energy structure:', error);
        }
      },
      renderCharts() {
        this.devices.forEach(device => {
          const chartDom = document.getElementById(`chart-${device}`);
          if (chartDom) {
            const myChart = echarts.init(chartDom);
  
            const data = this.energyStructure.filter(item => item.device === device).map(item => ({
              name: item.energy_type,
              value: item.total,
              itemStyle: { color: this.energyColors[item.energy_type] || '#ccc' }
            }));
  
            const option = {
              title: {
                text: `${device} 碳排来源占比`,
                left: 'center'
              },
              tooltip: {
                trigger: 'item'
              },
              legend: {
                show: false // 隐藏图例
              },
              series: [
                {
                  name: '能源类型',
                  type: 'pie',
                  radius: ['40%', '70%'],
                  data: data,
                  label: {
                    show: true,
                    formatter: '{b}', // 显示完整的名称
                    fontSize: 14,
                    position: 'outside', // 标签放在饼图外面
                    overflow: 'break' // 标签允许换行
                  },
                  labelLine: {
                    show: true,
                    length: 10,
                    length2: 10
                  },
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            };
            myChart.setOption(option);
          }
        });
      }
    },
    mounted() {
      this.fetchData();
    }
  };
  </script>
  
  <style scoped>
  .selectors-container {
    margin-bottom: 25px; /* 选择框与图表之间的间距 */
  }
  
  .charts-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: flex-start; /* 靠左对齐 */
    margin-left: 30px;
  }
  
  .pie-chart {
    flex: 1 1 calc(33.333% - 20px); /* 每行显示3个饼图 */
    max-width: 300px; /* 限制饼图的最大宽度 */
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .legend-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start; /* 靠左对齐 */
    gap: 8px;
    margin-top: 5px;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
  }
  
  .color-box {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    border: 1px solid #ccc;
  }
  
  .legend-text {
    font-size: 14px;
  }
  </style>
  