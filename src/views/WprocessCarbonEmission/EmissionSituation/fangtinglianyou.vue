<template>
  <div class="scrollable-container">
    <div class="title_date-row">
    <div class="title-container">
    <h2>芳烃炼油部碳排情况</h2>
  </div>

  <div class="selectors-container">
      <div class="select-row">
        <div class="select-wrapper">
          <label for="year-month-select">选择年月</label>
          <el-date-picker
            v-model="selectedDate"
            type="month"
            placeholder="选择年月"
            @change="handleDateChange"
            :clearable="false">
          </el-date-picker>
        </div>
      </div>
    </div>

</div>
  <!-- <div class="selectors-container">
    <select v-model="selectedYear" @change="fetchData" class="selector">
      <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
    </select>
    <select v-model="selectedMonth" @change="fetchData" class="selector">
      <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
    </select>
  </div> -->


  <div class="charts-section">
    <div class="charts-container">
      <div class="charts-row">
        <div class="pie-charts">
          <div class="pie-chart">
            <div id="consumption-chart" style="width: 330px; height: 280px;"></div>
          </div>
          <div class="pie-chart">
            <div id="emissions-chart" style="width: 330px; height: 280px;"></div>
          </div>
        </div>
        <div class="legend-container" style="width: 50px; margin-top: 0px; margin-left: 50px;">
        <div v-for="(color, energyType) in energyColors" :key="energyType" class="legend-item">
          <div class="color-box" :style="{ backgroundColor: color }"></div>
          <div class="legend-text">{{ energyType }}</div>
        </div>
      </div>

        <div class="info-boxes">
          <div class="info-box">
            <div class="info-title">本月总能耗（吨标油）</div>
            <div class="info-value">{{ totalEnergyConsumption.toFixed(2) }} 吨</div>
          </div>
          <div class="info-box">
            <div class="info-title">本月总碳排（吨二氧化碳）</div>
            <div class="info-value">{{ totalCarbonEmission.toFixed(2) }} 吨</div>
          </div>
        </div>


      </div>
        </div>
        
      
      </div>
     
      <div class="bar-chart-section">
      <div class="bar-chart-container">
        <div class="bar-chart">
          <div id="devices_emissions-chart" style="width: 1600px; height: 500px;"></div>
        </div>
      </div>
    </div>
    <div class="trend-chart-section">
  <div class="trend-chart-container">
    <div class="trend-chart-row">
    <div id="trend-chart1" class="trend-chart" style="height: 400px;"></div>
    <div id="trend-chart2" class="trend-chart" style="height: 400px;"></div>
  </div>
</div>
</div>
  </div>
</template>


<script>
import axios from 'axios';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
export default {
  data() {
    return {
      years: ['2022', '2023'],
      months: Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')),
      selectedYear: '2022',
      selectedMonth: '01',
      selectedDate: '2022-01',
      consumptionData: [],
      emissionsData: [],
      devices_emissionsData: [],
      totalEnergyConsumption: 0,
      totalCarbonEmission: 0,
      energyColors: {
        '氮气': '#ff9999',
        '生产水': '#66b3ff',
        '脱盐水Ⅱ': '#ffcc99',
        '火力发电': '#c2c2f0',
        '工业风': '#66f7fa',
        '燃料气': '#8e448c',
        '超高压蒸汽': '#c2f0c2',
        '低压蒸汽(13s)': '#8fb3e6',
        '生产过程': '#4a567f',
        '凉水塔冷却循环水': '#99ff99',
        '中压蒸汽(35-39s)': '#ff6666'
      },
      dateList1: [],
      dateList2: []
    };
  },
  methods: {
    handleDateChange(value) {
    const date = new Date(value);
    this.selectedYear = date.getFullYear();
    this.selectedMonth = String(date.getMonth() + 1).padStart(2, '0'); // 保持两位数
    this.fetchData(); // 调用 fetchData 方法

  },
    async fetchData() {
      try {
        const yearMonth = dayjs(this.selectedDate).format('YYYY-MM');
        const [consumptionResponse, emissionsResponse, devices_emissionsResponse, departmentDataResponse, trendDataResponse] = await Promise.all([
          // axios.get(`https://172.160.11.205:443/fangtinglianyou-energy-data`, {
          axios.get(`/fangtinglianyou-energy-data`, {
            params: {
              type: 'consumption',
              year: this.selectedYear,
              month: this.selectedMonth
            }
          }),
          // axios.get(`https://172.160.11.205:443/fangtinglianyou-energy-data`, {
          axios.get(`/fangtinglianyou-energy-data`, {
            params: {
              type: 'emissions',
              year: this.selectedYear,
              month: this.selectedMonth
            }
          }),
          // axios.get(`https://172.160.11.205:443/fangtinglianyou-energy-data`, {
          axios.get(`/fangtinglianyou-energy-data`, {
            params: {
              type: 'devices_emissions',
              year: this.selectedYear,
              month: this.selectedMonth
            }
          }),
          // axios.get(`https://172.160.11.205:443/fangtinglianyou-energy-data`, {
          axios.get(`/fangtinglianyou-energy-data`, {
          params: {
            type: 'department_energy_and_emissions',
            year: this.selectedYear,
            month: this.selectedMonth
          }
        }),
          // axios.get(`https://172.160.11.205:443/fangtinglianyou-energy-data`, {
          axios.get(`/fangtinglianyou-energy-data`, {
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
            text: '芳烃炼油部能源结构(吨标油)',
            left: 'center',
            textStyle: {
                  fontSize: 20, // 设置标题字体大小
                  fontWeight: 'bold',
                  color: '#333' // 标题颜色
              }
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
        // 获取类别名称、颜色和数值（保留两位小数）
        const value = params.value.toFixed(2); // 保留两位小数
        const color = params.color; // 获取对应颜色
        const percent = params.percent.toFixed(2);
        
        return `能源类型<br/>
                <span style="display:inline-block;width:10px;height:10px;background-color:${color};border-radius:50%;margin-right:5px;"></span>
                ${params.name}：${value} 吨 (${percent}%)`;
      },
      position: function (point, params, dom, rect, size) {
      const padding = 10; // 设置间距
      const chartWidth = size.viewSize[0]; // 获取图表宽度
      const tooltipWidth = dom.clientWidth; // 获取tooltip的宽度

      // 始终将 tooltip 固定在右侧显示
      const positionX = point[0] + padding;

      // 如果 tooltip 超出右侧边界，调整位置
      if (positionX + tooltipWidth + padding > chartWidth) {
          return [chartWidth - tooltipWidth - padding, point[1]];
      }
      return [positionX, point[1]];
  }

          },
          legend: {
            show: false
          },
          series: [
            {
              name: '能源类型',
              type: 'pie',
              radius: ['35%', '65%'],
              data: consumptionData,
              label: {
                show: true,
                formatter: '{b}',
                fontSize: 14,
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
            text: '芳烃炼油部碳排来源(吨二氧化碳)',
            left: 'center',
            textStyle: {
                  fontSize: 20, // 设置标题字体大小
                  fontWeight: 'bold',
                  color: '#333' // 标题颜色
              }
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
        // 获取类别名称、颜色和数值（保留两位小数）
        const value = params.value.toFixed(2); // 保留两位小数
        const color = params.color; // 获取对应颜色
        const percent = params.percent.toFixed(2);
        
        return `能源类型<br/>
                <span style="display:inline-block;width:10px;height:10px;background-color:${color};border-radius:50%;margin-right:5px;"></span>
                ${params.name}：${value} 吨 (${percent}%)`;
      }
            
          },
          legend: {
            show: false
          },
          series: [
            {
              name: '能源类型',
              type: 'pie',
              radius: ['35%', '65%'],
              data: emissionsData,
              label: {
                show: true,
                formatter: '{b}',
                fontSize: 14,
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
              text: `芳烃炼油部各装置能耗(吨标油)(${this.selectedYear}-${this.selectedMonth})`,
              left: 'center',
              top: '0%',
              textStyle: {
                  fontSize: 20, // 设置标题字体大小
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
  trigger: 'axis', // 触发条件为轴上而不是单独柱子
  axisPointer: {
      type: 'shadow' // 阴影指示器
  },
  formatter: function (params) {
      // 由于是轴触发，params 是一个数组，我们取第一个柱子的值
      const value = params[0].value; // 获取第一个数据项的值
      return `${params[0].name}装置<br/>装置能耗：${value.toFixed(2)} 吨`;  // 保留两位小数并添加单位
  },
  position: function (point, params, dom, rect, size) {
      let position = [point[0], point[1]];
      const padding = 20; // 给tooltip添加一些间距
      const chartWidth = size.viewSize[0]; // 获取图表宽度
      const tooltipWidth = dom.clientWidth; // 获取tooltip的宽度

      // 获取右侧5个柱子的索引
      const rightColumnIndexes = [devices_EmissionsData.length - 7,devices_EmissionsData.length - 6,devices_EmissionsData.length - 5, devices_EmissionsData.length - 4, devices_EmissionsData.length - 3, devices_EmissionsData.length - 2, devices_EmissionsData.length - 1];
      
      // 当前 tooltip 是为哪个柱子显示的
      const dataIndex = params[0].dataIndex;  // 获取触发的柱子的索引
      
      // 如果当前柱子是右侧五个柱子之一，则强制将 tooltip 显示到左侧
      if (rightColumnIndexes.includes(dataIndex)) {
          position[0] = point[0] - tooltipWidth - padding; // 将 tooltip 移到左边
      } else {
          position[0] = point[0]; // 否则，保持原位置
      }

      // 为避免 tooltip 过低导致遮挡，动态调整y坐标
      const chartHeight = size.viewSize[1]; // 获取图表高度
      const bottomEdge = chartHeight - point[1]; // 获取 tooltip 与图表底部的距离
      const tooltipHeight = dom.clientHeight; // 获取 tooltip 高度

      // 如果 tooltip 会超出底部，将其向上移动
      if (bottomEdge < tooltipHeight + padding) {
          position[1] = point[1] - tooltipHeight - padding;
      }

      return position;
  }
},

          grid: {
              left: '10%',
              right: '10%',
              bottom: '15%', // 增加底部边距以防止标签剪切
              containLabel: true
          },
          xAxis: {
              type: 'category',
              data: devices_EmissionsData.map(item => item.device.replace('装置', '')), // 确保横坐标为装置名称
              axisLabel: {
              interval: 0, // 显示所有标签
              color: '#333333',
              fontSize: 14,
              fontFamily: 'SimSun',
              formatter: function(value) {
          // 将每个字之间插入换行符
          return value.split('').join('\n');
             
              }
          },
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
              barWidth: '20%', 
              barCategoryGap: '10px', // 控制柱状图类目之间的间距
             barGap: '20%', // 控制同类别柱子之间的间距
              label: {
                  show: false,
                  position: 'top',
                  color: '#333333',
                  fontSize: 14,
                  

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
    const startMonth = 1; // 总是从1月开始
    const endMonth = currentMonth; // 结束月份是当前选择的月份

    let dateList1 = [], valueList1 = [];
    let dateList2 = [], valueList2 = [];

    // 根据当前选择的月份，动态生成趋势图数据
    for (let month = startMonth; month <= endMonth; month++) {
      const monthStr = month.toString().padStart(2, '0');
      const monthData1 = this.dateList1.find(item => item[0].startsWith(currentYear) && item[0].endsWith(monthStr));
      const monthData2 = this.dateList2.find(item => item[0].startsWith(currentYear) && item[0].endsWith(monthStr));

      if (monthData1 && monthData2) {
        dateList1.push(`${currentYear}-${monthStr}`);
        valueList1.push(monthData1[1]);
        dateList2.push(`${currentYear}-${monthStr}`);
        valueList2.push(monthData2[1]);
      }
    }

    // 初始化图表1
    const chart1 = echarts.init(document.getElementById('trend-chart1'));
    chart1.setOption({
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
      title: {
        left: 'center',
        text: '芳烃炼油部月度燃动能耗趋势(吨标油)',
        textStyle: {
          fontSize: 20, 
          fontWeight: 'bold',
          color: '#333'
        }
      },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: Array.from({ length: endMonth }, (_, i) => `${currentYear}-${(i + 1).toString().padStart(2, '0')}`),
        axisLabel: {
          fontSize: 14,
      color: '#333333',
      rotate: 45,  // 设置为 45 度倾斜
      formatter: function (value) {
        return value;
      }
        }
      },
      yAxis: {},
      series: [{ type: 'line', showSymbol: false, data: valueList1 }]
    });

    // 初始化图表2
    const chart2 = echarts.init(document.getElementById('trend-chart2'));
    chart2.setOption({
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
      title: {
        left: 'center',
        text: '芳烃炼油部装置碳排趋势(吨二氧化碳)',
        textStyle: {
          fontSize: 20, 
          fontWeight: 'bold',
          color: '#333'
        }
      },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: Array.from({ length: endMonth }, (_, i) => `${currentYear}-${(i + 1).toString().padStart(2, '0')}`),
        axisLabel: {
          fontSize: 14,
      color: '#333333',
      rotate: 45,  // 设置为 45 度倾斜
      formatter: function (value) {
        return value;
      }
        }
      },
      yAxis: {},
      series: [{ type: 'line', showSymbol: false, data: valueList2 }]
    });
  }

},

  mounted() {
    this.fetchData(this.selectedDate);
    // document.body.style.zoom = 0.9;
  }
};
</script>

<style scoped>
/* @import url("./assets\404_images/font/font.css"); */
.select-wrapper {
  width: 10px; /* 调整选择框的宽度 */
  height: 40px; /* 调整选择框的高度 */
}
.el-date-picker {
  width: 80%; /* 让 date-picker 占满 wrapper */
  height: 10px; /* 让 date-picker 占满 wrapper */
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



.charts-container {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 使容器水平居中 */
  margin-left: 150px; 
}

.charts-row {
  display: flex;
  align-items: flex-start; /* Align items at the start */
  width: 100%;
  margin-top:-10px;
}

.pie-charts {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  max-width: 1000px; 
  justify-content: flex-start; /* 使容器水平居中 */
  margin-left: -80px; 
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
margin-left: 140px; 
gap:20px;
margin-top: 15px;
}

.info-box {
border: 2px solid #ccc;
border-radius: 8px;
background-color: #f9f9f9;
padding: 15px;
margin-bottom: 20px;
width: 260px;
height: 100px;
text-align: center;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
display: flex;
flex-direction: column;
justify-content: center; /* Vertically center */
align-items: center; /* Horizontally center */
}

.info-title {
font-weight: bold;
font-size: 20px; /* Font size for the title */
color: #333;
margin-bottom: 10px; /* Space below the title */
position: relative; /* Position relative for the top adjustment */
top: -10px; /* Adjust vertical position to move title up slightly */
}

.info-value {
  color: #333;
  font-size: 20px;
}

.legend-container {
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  justify-content: flex-start;
  /* margin-top: 10px; */
  margin-left: 50px; 
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 5px 5px; /* 设置左右间隔为5px，总间隔为10px */
  flex-basis: calc(50% - 10px); /* 每行最多放6个 */
  box-sizing: border-box; /* 确保margin不会影响宽度计算 */
  font-size: 14px;
  margin-top:4px;
}


.color-box {
  width: 15px;
  height: 15px;
  margin-right: 5px;
}

.bar-chart-container {
  margin-top: 40px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-left: -180px;
}

.bar-chart {
  width: 100%;
  max-width: 1200px;
  margin-top: -50px;
}

.trend-chart {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
margin-bottom: 20px;
margin-left: -40px; /* 减小左侧间距 */
justify-content: flex-start;
/* flex-basis: calc(100% - -300px);  */
width: 700px;  
height: 400px; 
/* gap: -80px; */
margin-top:-60px;
}


.trend-chart-row {
  display: flex;
  align-items: flex-start; /* Align items at the start */
  width: 100%;
  margin-top:-10px;
}
.trend-chart-container {
margin-top: 0px;
width: 100%;
display: flex;
margin-top: 50px;
flex: 1; /* 每个容器平分可用宽度 */
}

.trend-chart-section {
border: 1px solid #ccc; /* 框的边框 */
border-radius: 8px; /* 框的圆角 */
padding: 20px; /* 内边距 */
margin-bottom: 20px; /* 下边距 */
background-color: #f9f9f9; /* 框的背景色 */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
width: 3000px;
height: 400px;
margin: 0 auto 20px auto;
display: flex;
justify-content: space-between; /* 让两个图表容器均匀分布 */
align-items: flex-start;
gap: 10px; /* 缩小两个图表之间的间距 */
position: relative;  /* 设置相对定位 */
top: -15px;  /* 向上移动 20px */
}

.title_date-row {
  display: flex;
  justify-content: center; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
  gap: 50px; /* 标题和选择框之间的间距 */
}
.title-container {
  text-align: center;
  margin-bottom: 20px;
}

.title-container h2 {
  font-size: 30px;
  font-weight: bold;
}

.charts-section {
border: 1px solid #ccc; /* 框的边框 */
border-radius: 8px; /* 框的圆角 */
padding: 20px; /* 内边距 */
margin-bottom: 20px; /* 下边距 */
background-color: #f9f9f9; /* 框的背景色 */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
width: 3000px;
height:290px;
margin: 0 auto 20px auto;
position: relative;  /* 设置相对定位 */
top: -15px;  /* 向上移动 20px */
}

.bar-chart-section{
border: 1px solid #ccc; /* 框的边框 */
border-radius: 8px; /* 框的圆角 */
padding: 20px; /* 内边距 */
margin-bottom: 20px; /* 下边距 */
background-color: #f9f9f9; /* 框的背景色 */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
width: 3000px;
height: 450px;
margin: 0 auto 20px auto;
position: relative;  /* 设置相对定位 */
top: -15px;  /* 向上移动 20px */
}

.scrollable-container {
width: 100%; 
overflow-x: scroll; 
white-space: nowrap; 
overflow: hidden;
}

.selectors-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  margin-left: 20px;
}

.selectors-container label {
  font-size: 20px; /* 修改为你想要的字体大小 */
  color: #333;
  margin-right: 8px;
}
.selector {
margin: 0 10px;
padding: 10px;
font-size: 16px;
border: 1px solid #ddd;
border-radius: 5px;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
background-color: #fff;
height: 10px;
}

.selector:focus {
outline: none;
border-color: #007bff;
}

.selectors-container select {
  margin: 0 10px;
  height: 10px;
}

</style>
