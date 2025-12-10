<template>
    <div>
    <div class="selectors-container">
      <select v-model="selectedYear" @change="fetchData" class="selector">
        <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
      </select>
      <select v-model="selectedMonth" @change="fetchData" class="selector">
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
            <div id="devices_emissions-chart" style="width: 2000px; height: 800px;"></div>
          </div>
        </div>
        <div class="trend-chart-container">
        <div id="trend-chart" style="width: 2000px; height: 1000px;"></div>
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
        },
        dateList1: [],
        dateList2: []
      };
    },
    methods: {
      async fetchData() {
        try {
          const [consumptionResponse, emissionsResponse, devices_emissionsResponse, departmentDataResponse, trendDataResponse] = await Promise.all([
            axios.get(`https://172.160.11.205:443/xitingbu-energy-data`, {
              params: {
                type: 'consumption',
                year: this.selectedYear,
                month: this.selectedMonth
              }
            }),
            axios.get(`https://172.160.11.205:443/xitingbu-energy-data`, {
              params: {
                type: 'emissions',
                year: this.selectedYear,
                month: this.selectedMonth
              }
            }),
            axios.get(`https://172.160.11.205:443/xitingbu-energy-data`, {
              params: {
                type: 'devices_emissions',
                year: this.selectedYear,
                month: this.selectedMonth
              }
            }),
            axios.get(`https://172.160.11.205:443/xitingbu-energy-data`, {
            params: {
              type: 'department_energy_and_emissions',
              year: this.selectedYear,
              month: this.selectedMonth
            }
          }),
            axios.get(`https://172.160.11.205:443/xitingbu-energy-data`, {
              params: {
                type: 'department_energy_and_emissions_trend',
                year: this.selectedYear,
                month: this.selectedMonth
            }
          }),

          ]);
          console.log('Consumption Response:', consumptionResponse.data);
          console.log('Emissions Response:', emissionsResponse.data);
          console.log('Devices Emissions Response:', devices_emissionsResponse.data);
          console.log('Department Data Response:', departmentDataResponse.data);
          console.log('Department Data Response:', departmentDataResponse.data);
          if (consumptionResponse.status === 200 && emissionsResponse.status === 200 && devices_emissionsResponse.status === 200 && departmentDataResponse.status === 200 && trendDataResponse.status === 200) {
            this.consumptionData = consumptionResponse.data;
            this.emissionsData = emissionsResponse.data;
            this.devices_emissionsData = devices_emissionsResponse.data;
            this.totalEnergyConsumption = departmentDataResponse.data.total_energy_consumption;
            this.totalCarbonEmission = departmentDataResponse.data.total_carbon_emission;
            this.dateList1 = trendDataResponse.data.dateList1;
            this.dateList2 = trendDataResponse.data.dateList2;
            this.renderCharts();
            this.renderTrendChart();// 调用趋势图的数据获取
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
              text: '烯烃部能源结构(吨标油)',
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
              text: '烯烃部碳排来源(吨二氧化碳)',
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
                text: `烯烃部各装置能耗(吨标油)(${this.selectedYear}-${this.selectedMonth})`,
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
      },
      renderTrendChart() {
  // 获取当前选择的年份和月份
  const currentYear = this.selectedYear;
  const currentMonth = parseInt(this.selectedMonth, 10);

  // 计算需要显示的趋势数据的月份范围
  const startMonth = 1; // 总是从1月开始
  const endMonth = currentMonth; // 结束月份是当前选择的月份

  // 准备趋势图的数据
  let dateList1 = [];
  let valueList1 = [];
  let dateList2 = [];
  let valueList2 = [];

  // 根据当前选择的月份，动态生成趋势图数据
  for (let month = startMonth; month <= endMonth; month++) {
    // 假设 dateList1 和 dateList2 是从后端获取的完整月份数据列表
    // 我们需要根据当前选择的月份来筛选数据
    const monthData1 = this.dateList1.find(item => item[0].startsWith(currentYear) && item[0].endsWith(month.toString().padStart(2, '0')));
    const monthData2 = this.dateList2.find(item => item[0].startsWith(currentYear) && item[0].endsWith(month.toString().padStart(2, '0')));

    if (monthData1 && monthData2) {
      dateList1.push(`${currentYear}-${month.toString().padStart(2, '0')}`);
      valueList1.push(monthData1[1]);
      dateList2.push(`${currentYear}-${month.toString().padStart(2, '0')}`);
      valueList2.push(monthData2[1]);
    }
  }

  // 初始化趋势图的DOM元素
  const myChart = echarts.init(document.getElementById('trend-chart'));
  // 设置趋势图的选项
  myChart.setOption({
    visualMap: [
      {
        show: false,
        type: 'continuous',
        seriesIndex: 0,
        min: 0,
        max: 400
      },
      {
        show: false,
        type: 'continuous',
        seriesIndex: 1,
        dimension: 0,
        min: 0,
        max: endMonth
      }
    ],
    title: [
      {
        left: 'center',
        text: '烯烃部月度燃动能耗趋势(吨标油)',
        textStyle: {
                    fontSize: 24, // 设置标题字体大小
                    fontWeight: 'bold',
                    color: '#333' // 标题颜色
                }
      },
      {
        top: '55%',
        left: 'center',
        text: '烯烃部装置碳排趋势(吨二氧化碳)',
        textStyle: {
                    fontSize: 24, // 设置标题字体大小
                    fontWeight: 'bold',
                    color: '#333' // 标题颜色
                }
      }
    ],
    tooltip: {
      trigger: 'axis'
    },
    xAxis: [
      {
        type: 'category',
        data: Array.from({ length: endMonth }, (_, i) => `${currentYear}-${(i + 1).toString().padStart(2, '0')}`),
        axisLabel: {
          fontSize: 16,
          color: '#333333',
          formatter: function (value) {
            return value;
          }
        }
      },
      {
        type: 'category',
        data: Array.from({ length: endMonth }, (_, i) => `${currentYear}-${(i + 1).toString().padStart(2, '0')}`),
        axisLabel: {
          fontSize: 16,
          color: '#333333',
          formatter: function (value) {
            return value;
          }
        },
        gridIndex: 1
      }
    ],
    yAxis: [
      {},
      {
        gridIndex: 1
      }
    ],
    grid: [
      {
        bottom: '60%'
      },
      {
        top: '60%'
      }
    ],
    series: [
      {
        type: 'line',
        showSymbol: false,
        data: valueList1
      },
      {
        type: 'line',
        showSymbol: false,
        data: valueList2,
        xAxisIndex: 1,
        yAxisIndex: 1
      }
    ]
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
    display: flex;
    justify-content: start;
    margin-bottom: 20px;
    margin-left: 5px;
  }
  .selector {
  margin: 0 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

/* .charts-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.charts-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  max-width: 2000px;
  margin-bottom: 20px;
} */

.selector:focus {
  outline: none;
  border-color: #007bff;
}
.selectors-container select {
    margin: 0 10px;
}
  
.charts-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* 使容器水平居中 */
    margin-left: 50px; 
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
    max-width: 1000px; 
    justify-content: flex-start; /* 使容器水平居中 */
    margin-left: 250px; 
    /* Limit max-width to fit alongside the info boxes */
}
  
.pie-chart {
    flex: 1;
    margin-right: 0px;
}
  
.info-boxes {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 450px; /* 控制框与饼图的距离 */
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
    justify-content: flex-start; /* 使容器水平居中 */
    margin-left: 300px; 
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
    margin-left: 50px;
  }
  
  .bar-chart {
    width: 100%;
    max-width: 1200px;
  }
  .trend-charts-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 350px;
  justify-content: flex-start;
}
.trend-chart {
  margin-bottom: 20px;
  margin-left: 350px;
  justify-content: flex-start;
}
.trend-chart-container {
  margin-top: 40px;
  width: 100%;
  display: flex;
  justify-content: flex-start; /* 使容器水平居中 */
  margin-left: 50px; /* 添加此属性，调节趋势图的位置 */
  margin-top: 50px; 
  overflow-x: auto; /* 允许水平滚动 */
  white-space: nowrap; /* 防止内容换行 */
}
</style>
  