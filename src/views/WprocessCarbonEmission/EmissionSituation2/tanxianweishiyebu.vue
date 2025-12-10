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
        <div class="charts-row">
          <div class="pie-charts">
            <div class="pie-chart">
              <div id="consumption-chart" style="width: 500px; height: 400px;"></div>
            </div>
            <div class="pie-chart">
              <div id="emissions-chart" style="width: 500px; height: 400px;"></div>
            </div>
          </div>
          <div class="info-boxes">
            <div class="info-box">
              <div class="info-title">本月总能耗（吨标油）</div>
              <div class="info-value">{{ totalEnergyConsumption.toFixed(2) }} </div>
            </div>
            <div class="info-box">
              <div class="info-title">本月总碳排（吨二氧化碳）</div>
              <div class="info-value">{{ totalCarbonEmission.toFixed(2) }}</div>
            </div>
          </div>
        </div>
        <div class="legend-container">
          <div v-for="(color, energyType) in energyColors" :key="energyType" class="legend-item">
            <div class="color-box" :style="{ backgroundColor: color }"></div>
            <div class="legend-text">{{ energyType }}</div>
          </div>
        </div>
        <div class="bar-chart-container">
          <div class="bar-chart">
            <div id="devices_emissions-chart" style="width: 1600px; height: 600px;"></div>
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
        consumptionData: [],
        emissionsData: [],
        devices_emissionsData: [],
        totalEnergyConsumption: 0,
        totalCarbonEmission: 0,
        energyColors: {
          '氮气': '#ff9999',
          '生产水': '#66b3ff',
          '凉水塔冷却循环水': '#99ff99',
          '脱盐水Ⅱ': '#ffcc99',
          '火力发电': '#c2c2f0',
          '低压蒸汽(13s)': '#8fb3e6',
          '超高压蒸汽': '#c2f0c2',
          '中压蒸汽(35-39s)': '#ff6666',
          '燃料气': '#8e448c',
          '工业风': '#e0f7fa',
          '生产过程': '#4a567f'
        }
      };
    },
    methods: {
      async fetchData() {
        try {
          const [consumptionResponse, emissionsResponse, devices_emissionsResponse, departmentDataResponse] = await Promise.all([
            axios.get(`https://172.160.11.205:443/tanxianweishiyebu-energy-data`, {
              params: {
                type: 'consumption',
                year: this.selectedYear,
                month: this.selectedMonth
              }
            }),
            axios.get(`https://172.160.11.205:443/tanxianweishiyebu-energy-data`, {
              params: {
                type: 'emissions',
                year: this.selectedYear,
                month: this.selectedMonth
              }
            }),
            axios.get(`https://172.160.11.205:443/tanxianweishiyebu-energy-data`, {
              params: {
                type: 'devices_emissions',
                year: this.selectedYear,
                month: this.selectedMonth
              }
            }),
            axios.get(`https://172.160.11.205:443/tanxianweishiyebu-energy-data`, {
            params: {
              type: 'department_energy_and_emissions',
              year: this.selectedYear,
              month: this.selectedMonth
            }
          })
          ]);
          console.log('Consumption Response:', consumptionResponse.data);
          console.log('Emissions Response:', emissionsResponse.data);
          console.log('Devices Emissions Response:', devices_emissionsResponse.data);
          console.log('Department Data Response:', departmentDataResponse.data);
          if (consumptionResponse.status === 200 && emissionsResponse.status === 200 && devices_emissionsResponse.status === 200 && departmentDataResponse.status === 200) {
            this.consumptionData = consumptionResponse.data;
            this.emissionsData = emissionsResponse.data;
            this.devices_emissionsData = devices_emissionsResponse.data;
            this.totalEnergyConsumption = departmentDataResponse.data.total_energy_consumption;
            this.totalCarbonEmission = departmentDataResponse.data.total_carbon_emission;
            this.renderCharts();
          } else {
            console.error('Unexpected response status:', consumptionResponse.status, emissionsResponse.status, devices_emissionsResponse.status, departmentDataResponse.status);
          }
        } catch (error) {
          console.error('Error fetching energy data:', error);
        }
      },
      renderCharts() {
        
        // Render consumption chart
        const consumptionChartDom = document.getElementById('consumption-chart');
        if (consumptionChartDom) {
          const consumptionChart = echarts.init(consumptionChartDom);
          const consumptionData = this.consumptionData.map(item => ({
            name: item.energy_type,
            value: item.total,
            itemStyle: { color: this.energyColors[item.energy_type] || '#ccc' }
          }));
  
          const consumptionOption = {
            title: {
              text: '碳纤维事业部能源结构(吨标油)',
              left: 'center',
              textStyle: {
                    fontSize: 24, // 设置标题字体大小
                    fontWeight: 'bold',
                    color: '#333' // 标题颜色
                }
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              show: false
            },
            series: [
              {
                name: '能源类型',
                type: 'pie',
                radius: ['40%', '70%'],
                data: consumptionData,
                label: {
                  show: true,
                  formatter: '{b}',
                  fontSize: 18,
                  position: 'outside',
                  overflow: 'break'
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
          consumptionChart.setOption(consumptionOption);
        }
  
        // Render emissions chart
        const emissionsChartDom = document.getElementById('emissions-chart');
        if (emissionsChartDom) {
          const emissionsChart = echarts.init(emissionsChartDom);
          const emissionsData = this.emissionsData.map(item => ({
            name: item.energy_type,
            value: item.total,
            itemStyle: { color: this.energyColors[item.energy_type] || '#ccc' }
          }));
  
          const emissionsOption = {
            title: {
              text: '碳纤维事业部碳排来源(吨二氧化碳)',
              left: 'center',
              textStyle: {
                    fontSize: 24, // 设置标题字体大小
                    fontWeight: 'bold',
                    color: '#333' // 标题颜色
                }
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              show: false
            },
            series: [
              {
                name: '能源类型',
                type: 'pie',
                radius: ['40%', '70%'],
                data: emissionsData,
                label: {
                  show: true,
                  formatter: '{b}',
                  fontSize: 18,
                  position: 'outside',
                  overflow: 'break'
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
          emissionsChart.setOption(emissionsOption);
        }
        
        console.log('Devices Emissions Data:', this.devices_emissionsData); // 查看数据内容
  
  const devices_emissionsData = this.devices_emissionsData.map(item => ({
    device_name: item.device_name,
    emissions: item.emissions
  }));
  
   // Render devices_emissions chart
        const devices_emissionsChartDom = document.getElementById('devices_emissions-chart');
        if (devices_emissionsChartDom) {
            const devices_emissionsChart = echarts.init(devices_emissionsChartDom);
            console.log('Devices Emissions Data:', this.devices_emissionsData); // 确认数据
  
            const devices_EmissionsData = this.devices_emissionsData.map(item => ({
            device: item.device,
            emissions: item.emissions
            }));
  
            const devices_emissionsOption = {
            title: {
                text: `碳纤维事业部各装置能耗(吨标油)(${this.selectedYear}-${this.selectedMonth})`,
                left: 'center',
                top: '0%',
                textStyle: {
                    fontSize: 24, // 设置标题字体大小
                    fontWeight: 'bold',
                    color: '#333' // 标题颜色
                }
            },
            subtitle: {
                text: '单位：吨',
                left: 'center',
                top: '15%',
                textStyle: {
                color: '#000000',
                fontSize: 14
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '15%', // 增加底部边距以防止标签剪切
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: devices_EmissionsData.map(item => item.device), // 确保横坐标为装置名称
                axisLabel: {
                interval: 0, // 显示所有标签
                color: '#333333',
                rotate: 45, // 标签旋转 45 度
                fontSize: 16
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                formatter: '{value}'
                }
            },
            series: [
                {
                name: '碳排放量',
                type: 'bar',
                data: devices_EmissionsData.map(item => item.emissions),
                itemStyle: {
                    color: params => (params.value < 0 ? '#ff6f6f' : '#6b8e23') // 负值红色，正值绿色
                },
                barWidth: '40%', // 增加柱子之间的间距
                label: {
                    show: true,
                    position: 'top',
                    color: '#333333',
                    fontSize: 14,
                    formatter: (params) => {
          return params.value.toFixed(2); // 保留两位小数
        }
                }
                }
            ]
            };
            devices_emissionsChart.setOption(devices_emissionsOption);
        }
      }
    },
    mounted() {
      this.fetchData();
    }
  };
  </script>
  
  <style scoped>
  .selectors-container {
    display: flex;
    justify-content: start;
    margin-bottom: 20px;
    margin-left: 5px;
  }
  
  .selectors-container select {
    margin: 0 10px;
  }
  
  .charts-container {
    display: flex;
    flex-direction: column;
  }
  
  .charts-row {
    display: flex;
    align-items: flex-start; /* Align items at the start */
    width: 100%;
  }
  
  .pie-charts {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    max-width: 1000px; /* Limit max-width to fit alongside the info boxes */
  }
  
  .pie-chart {
    flex: 1;
    margin-right: 20px;
  }
  
  .info-boxes {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 550px; /* 控制框与饼图的距离 */
  align-items: center; 
  }
  
  .info-box {
  border: 2px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  padding: 15px;
  margin-bottom: 20px;
  width: 350px;
  height: 150px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center; /* Vertically center */
  align-items: center; /* Horizontally center */
  }
  
  .info-title {
  font-weight: bold;
  font-size: 24px; /* Font size for the title */
  color: #333;
  margin-bottom: 10px; /* Space below the title */
  position: relative; /* Position relative for the top adjustment */
  top: -10px; /* Adjust vertical position to move title up slightly */
  }
  
  .info-value {
    color: #333;
    font-size: 24px;
  }
  
  .legend-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: 10px;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    margin: 5px 10px;
  }
  
  .color-box {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
  
  .bar-chart-container {
    margin-top: 40px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-left: -150px;
  }
  
  .bar-chart {
    width: 100%;
    max-width: 1200px;
  }
  </style>
  