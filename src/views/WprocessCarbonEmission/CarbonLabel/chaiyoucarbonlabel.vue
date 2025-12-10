<template>
  <div class="scrollable-container"> <!-- 新增的容器 -->
    <!-- 新增的标题行，居中显示 -->
    <div class="title_date-row">
    <div class="title-container">
      <h2>柴油产品碳标签</h2>
    </div>

    <!-- 柴油产品信息 -->
    <div class="selectors-section">
      <div class="selectors-container">
        <div class="select-row">
          <div class="select-wrapper">
            <label for="year-month-select">选择年月</label>
            <el-date-picker
              v-model="selectedDate"
              type="month"
              placeholder="选择年月"
              @change="handleDateChange"
              :clearable="false" style="width: 200px;">
            </el-date-picker>
          </div>
        </div>
      </div>
    </div>
  </div>
      
  <div class="diesels-section">
  <div class="diesels-row">
    <div class="diesels-container">
      <div class="diesel-container">
        <div v-for="diesel in diesels" :key="diesel.productName" v-if="diesel.production > 0" class="diesel">
          <h4>{{ diesel.productName }}</h4>
          <img :src="getImagePath()" alt="Diesel Image" class="diesel-image" />
          <h4>碳排放量: {{ diesels[0].carbonFootprint }} tCO<sub>2</sub>e/t</h4>
          <h4>产量: {{ diesel.production }} 吨</h4>
        </div>
      </div>
      <div class="info-boxes">
        <div class="info-box">
          <div class="info-title">本月总碳排（吨二氧化碳）</div>
          <div class="info-value">{{ totalCarbonEmission.toFixed(2) }} 吨</div>
        </div>
        <div class="info-box">
          <div class="info-title">本月生产柴油产品总量</div>
          <div class="info-value">{{ totalProductsOutput.toFixed(2) }} 吨</div>
        </div>
      </div>
    </div>
  </div>
</div>
      <!-- 饼图板块 -->
      <div class="section-box">
        <div class="charts-row pie-charts">
          <div class="pie-chart">
            <div id="consumption-chart" style="width: 330px; height: 280px;"></div>
          </div>
          <div class="pie-chart">
            <div id="emissions-chart" style="width: 330px; height: 280px;"></div>
          </div>
          <div class="pie-chart">
          <div id="devices_emissions-pie" style="width: 330px; height: 280px;"></div>
        </div>
        <div class="pie-chart">
          <div id="devices-emissions-pie-chart" style="width: 330px; height: 280px;"></div>
        </div>

        </div>
        <!-- 图例 -->
        <div class="legend-row">
        <div class="legend-container" style="width:700px; margin-top: 15px;">
          <div v-for="(color, energyType) in energyColors" :key="energyType" class="legend-item">
            <div class="color-box" :style="{ backgroundColor: color }"></div>
            <div class="legend-text">{{ energyType }}</div>
          </div>
        </div>
        
        <div class="legend-container" style="width: 700px; margin-top: 15px; margin-left:-60px;">
          <div v-for="(color, device_name) in device_Colors" :key="device_name" class="legend-item">
            <div class="color-box" :style="{ backgroundColor: color }"></div>
            <div class="legend-text">{{ device_name.replace('装置', '') }}</div>
          </div>
        </div>
      </div>
      </div>
 

    <!-- 柱状图和趋势图放在单独的容器里 -->
    
    <div class="trend-chart-section">
      <!-- 趋势图板块 -->
      <div class="trend-chart-container">
        <div id="trend-chart" style="width: 1500px; height: 600px;"></div>
      </div>
    </div>
    <div class="bars-chart-section">
      <!-- 簇状柱形图板块 -->
      <div class="bars-chart-container">
        <div class="bars-chart">
          <div id="product-output-chart" style="width: 1350px; height: 500px;"></div>
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
        devicesEmissionsPieData: [],
        diesels: [],
        DATAS:[],        
        // isAnnualView: false, // 是否显示全年数据的标志
        diesellProducts: ['0号出口轻柴油', '0号车用柴油(Ⅵ)', '0号出口车用柴油'],
        years: ['2022', '2023'],
        months: Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')),
        selectedYear: '2022',
        selectedMonth: '01',
        selectedDate: '2022-01',
        productOutputData: [],
        consumptionData: [],
        emissionsData: [],
        devices_emissionsData: [],
        totalProductsOutput: 0,
        totalCarbonEmission: 0,
        energyColors: {
          '氮气': '#ff9999',
          '生产水': '#66b3ff',
                    '脱盐水Ⅱ': '#ffcc99',
          '火力发电': '#c2c2f0',
          '低压蒸汽(13s)': '#8fb3e6',
          '超高压蒸汽': '#c2f0c2',
          '中压蒸汽(35-39s)': '#ff6666',
          '燃料气': '#8e448c',
          '工业风': '#e0f7fa',
          '生产过程': '#4a567f',
          '凉水塔冷却循环水': '#99ff99',
        },
        device_Colors: {
          '2#常减压装置': '#4C72B0', // 蓝紫色
'3#常减压装置': '#55A868', // 柔和绿色
'1#延迟焦化': '#C44E52', // 柔和红色
'2#延迟焦化': '#8172B2', // 浅紫色
'渣油加氢装置': '#64B5CD', // 天蓝色
'2#催化裂化装置': '#FFBB78', // 柔和橙色
'加氢裂化装置': '#F28E2C', // 深橙色
'中压加氢装置': '#76B7B2', // 青绿色
'1#柴油加氢精制': '#E15759', // 珊瑚红
'3#柴油加氢装置': '#59A14F', // 浅绿色
'加氢改质装置': '#EDC948', // 柔和黄色
'1#制氢装置': '#AF7AA1', // 紫红色
'2#制氢装置': '#FF9DA7', // 柔和粉红色
'3#制氢装置': '#9C755F', // 柔和棕色
'柴油调合装置': '#BAB0AC'  // 灰色
    },
        dateList1: [],
        // dateList2: []
      };
    },
    // computed: {
    //   filteredDiesels() {
    //     return this.diesels.filter(diesel =>
    //       ['0号出口轻柴油', '0号车用柴油(Ⅵ)', '0号出口车用柴油'].includes(diesel.name)
    //     );
        
    //   }
    // },
    methods: {
      handleDateChange(value) {
      const date = new Date(value);
      this.selectedYear = date.getFullYear();
      this.selectedMonth = String(date.getMonth() + 1).padStart(2, '0'); // 保持两位数
      this.fetchData(); // 调用 fetchData 方法
      this.fetchCarbonFootprintData();

    },
    getImagePath() {
        // console.log(123)
        try {
          // console.log(this.selectedDate)
          const year = dayjs(this.selectedDate).format('YYYY'); // 获取年份
          const folderName = `${year}diesel-image`; // 根据年份选择文件夹
  
          if (this.isAnnualView) {
            // 如果是查看全年数据
            return require(`@/icons/image/productlabelimage/${folderName}/${year}-SUM.jpg`);
          } else {
            // 如果是查看某个月的数据
            const yearMonth = dayjs(this.selectedDate).format('YYYY-MM');
            return require(`@/icons/image/productlabelimage/${folderName}/${yearMonth}.jpg`);
          }
        } catch (e) {
          console.error('Error loading image:', e);
          // 返回备用图片路径
          return ''; // 可选: 返回一个默认图片路径
        }
      },
      async fetchCarbonFootprintData() {
  // this.isAnnualView = false;

  try {
    const yearMonth = dayjs(this.selectedDate).format('YYYY-MM');
    const response = await axios.get(`https://172.160.11.205:443/chaiyoucarbonlabel-energy-data`, {
      params: {
        type: 'chaiyoucarbonlabel',
        year: this.selectedYear,
        month: this.selectedMonth,
        product: 'diesel'
      }
    });

    if (response.status === 200) {
      this.diesels = response.data || []; // 确保数据有效
    } else {
      console.error('Response error:', response.status);
    }
  } catch (error) {
    console.error('Error fetching carbon footprint data:', error);
    // 如果请求失败，可以使用默认数据或提示用户
    this.diesels = []; // 设置为空数组，避免undefined错误
  }
},

      async fetchData() {
        try {
          const [consumptionResponse, emissionsResponse, devices_emissionsResponse, departmentDataResponse, trendDataResponse, productOutputResponse] = await Promise.all([
            axios.get(`https://172.160.11.205:443/chaiyoucarbonlabel-energy-data`, {
            // axios.get(`/chaiyoucarbonlabel-energy-data`, {
              params: {
                type: 'consumption',
                year: this.selectedYear,
                month: this.selectedMonth
              }
            }),
            axios.get(`https://172.160.11.205:443/chaiyoucarbonlabel-energy-data`, {
            // axios.get(`/chaiyoucarbonlabel-energy-data`, {
              params: {
                type: 'emissions',
                year: this.selectedYear,
                month: this.selectedMonth
              }
            }),
            axios.get(`https://172.160.11.205:443/chaiyoucarbonlabel-energy-data`, {
            // axios.get(`/chaiyoucarbonlabel-energy-data`, {
              params: {
                type: 'devices_emissions',
                year: this.selectedYear,
                month: this.selectedMonth
              }
            }),
            // axios.get(`https://172.160.11.205:443/chaiyoucarbonlabel-energy-data`, {
            // axios.get(`/chaiyoucarbonlabel-energy-data`, {
            //   params: {
            //     type: 'devices_carbon_emissions',
            //     year: this.selectedYear,
            //     month: this.selectedMonth
            //   }
            // }),


            axios.get(`https://172.160.11.205:443/chaiyoucarbonlabel-energy-data`, {
            // axios.get(`/chaiyoucarbonlabel-energy-data`, {
            params: {
              type: 'department_energy_and_emissions',
              year: this.selectedYear,
              month: this.selectedMonth
            }
          }),
            axios.get(`https://172.160.11.205:443/chaiyoucarbonlabel-energy-data`, {
            // axios.get(`/chaiyoucarbonlabel-energy-data`, {
              params: {
                type: 'department_energy_and_emissions_trend',
                year: this.selectedYear,
                month: this.selectedMonth
            }
          }),
            axios.get('https://172.160.11.205:443/chaiyoucarbonlabel-energy-data', {
              params: {
               type: 'product_output',
               year: this.selectedYear,
               month: this.selectedMonth
            }
          }),
          // axios.get('/chaiyoucarbonlabel-energy-data', {
          //     params: {
          //      type: 'chaiyoucarbonlabel',
          //      year: this.selectedYear,
          //      month: this.selectedMonth,
          //      product: 'diesel'
          //   }
          // })
          ]);
          console.log('Consumption Response:', consumptionResponse.data);
          console.log('Emissions Response:', emissionsResponse.data);
          console.log('Devices Emissions Response:', devices_emissionsResponse.data);
          console.log('Department Data Response:', departmentDataResponse.data);
          console.log('Department Data Response:', departmentDataResponse.data);
          if (consumptionResponse.status === 200 && emissionsResponse.status === 200 && devices_emissionsResponse.status === 200 && departmentDataResponse.status === 200 && trendDataResponse.status === 200 && productOutputResponse.status === 200 ) {
            this.consumptionData = consumptionResponse.data;
            this.emissionsData = emissionsResponse.data;
            this.devices_emissionsData = devices_emissionsResponse.data;
            this.totalProductsOutput = departmentDataResponse.data.total_products_output;
            this.totalCarbonEmission = departmentDataResponse.data.total_carbon_emission;
            this.dateList1 = trendDataResponse.data.dateList1;
            this.productOutputData = productOutputResponse.data;
            // this.diesels = dieselsResponse.data;
            // this.dateList2 = trendDataResponse.data.dateList2;
            this.renderCharts();
            this.renderCharts1();
            this.renderTrendChart();// 调用趋势图的数据获取
          } else {
            console.error('Unexpected response status:', consumptionResponse.status, emissionsResponse.status, devices_emissionsResponse.status, departmentDataResponse.status);
          }
        } catch (error) {
          console.error('Error fetching energy data:', error);
        }
      },

      renderCharts() {
  // 获取当前选择的年份和月份
  const currentYear = this.selectedYear;
  const currentMonth = parseInt(this.selectedMonth, 10);
  
  // 计算需要显示的月份范围
  const months = Array.from({ length: 12 }, (_, i) => `${currentYear}-${(i + 1).toString().padStart(2, '0')}`); // 所有月份
  const visibleMonths = months.slice(0, currentMonth); // 选择的月份范围

  // 根据数据生成每个月的产品产量
  const productNames = [
    '0号车用柴油(国Ⅲ)', '0号车用柴油', 'LSMGO',
    '0号普通柴油', '0号普通柴油(Ⅳ)', '0号出口轻柴油', '0号车用柴油(Ⅵ)', '0号出口车用柴油',
    '0号车用柴油(Ⅴ)', '0号车用柴油(Ⅳ)', '10号普通柴油', '10号车用柴油(Ⅴ)'
  ]; // 产品名称列表

  const colors = [
    '#4a90e2', '#e94e77', '#9ab1ef', '#2de038', '#686de0',
    '#d97a5c', '#6e9ef1', '#e5cf0d', '#97b552', '#95706d',
    '#dc69aa', '#07a2a4'
  ]; // 为每个产品定义一种颜色
// 计算全年各产品的产量总和，用于过滤全年为0的产品
const totalOutputs = productNames.map((name) => {
  return this.productOutputData
    .filter(item => item.product_name === name)  // 找到所有该产品的数据
    .reduce((sum, item) => sum + item.product_output, 0);  // 计算全年总和
});

// 过滤出全年产量不为0的产品名称
const filteredProductNames = productNames.filter((_, index) => totalOutputs[index] > 0);

// 过滤出全年产量不为0的颜色
const filteredColors = colors.filter((_, index) => totalOutputs[index] > 0);

  // 创建一个映射以便根据月份和产品获取产量数据
  const monthProductOutputs = visibleMonths.map(month => {
    const monthData = this.productOutputData.filter(item => item.month === month);
    const monthOutputs = productNames.map(name => {
      const item = monthData.find(dataItem => dataItem.product_name === name);
      return item ? item.product_output : 0;
    });
    return monthOutputs;
  });

  // 打印数据以便调试
  console.log('Product Output Data:', this.productOutputData);
  console.log('Visible Months:', visibleMonths);
  console.log('Month Product Outputs:', monthProductOutputs);

  // 初始化柱状图的DOM元素
  const productOutputChartDom = document.getElementById('product-output-chart');
  if (productOutputChartDom) {
    const productOutputChart = echarts.init(productOutputChartDom);

    // 设置柱状图的选项
    const productOutputOption = {
      title: {
        text: `产品产量 (${currentYear}-${this.selectedMonth})`, // 更新标题显示年份和月份
        left: 'center',
        textStyle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#333' // 标题颜色
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: filteredProductNames, // 显示图例
        left: 'center', // 图例居中显示
        
        top: '73%', // 图例位置在底部
        textStyle: {
          fontSize: 14 // 增加图例字体大小
        },
        orient: 'horizontal', // 图例横向排列
        itemWidth: 25, // 可以调整图例项的宽度
        itemHeight: 14, // 可以调整图例项的高度
        width: '100%',  // 限制图例的最大宽度
    itemGap: 1,  // 图例项之间的间隔
    padding: [1, 2], // 控制图例区域的内边距
    formatter: function(name) {
        // 通过图例项目的索引来每五个换行
        const index = productNames.indexOf(name);
        return index % 5 === 5 ? `${name}\n` : name;
    }
      },
      xAxis: {
        type: 'category',
        data: visibleMonths.map(month => '                ' + month), // 显示月份作为横坐标
        axisLabel: {
          fontSize: 14,
          rotate: 45,
          color: '#333333'
        },
        boundaryGap: true // 设置为 true，柱子不会填充到轴的边界
      },
      yAxis: {
        type: 'value',
        name: '单位:吨',
        nameTextStyle: {
          fontSize: 14,
          color: '#333333'
        },
        axisLabel: {
          fontSize: 14,
          color: '#333333'
        }
      },
      grid: {
        left: '0%', // 将整个图表向右移动
        right: '5%',
        bottom: '20%',
        containLabel: true
      },
      series: productNames.map((name, index) => {
  const data = monthProductOutputs.map((outputs) => outputs[index]); // 直接使用 outputs[index]
  
  // 过滤掉产量为0的值
  const filteredData = data.filter(output => output > 0);
  
  // 只返回数据大于0的产品系列
  return {
    name: name,
    type: 'bar',
    data: data,
    barWidth: '18px', // 控制柱子宽度
    barGap: '0%', // 保证同系列之间没有间隙
    barCategoryGap: '10%', // 保证不同产品类别中的柱子有间隙
    itemStyle: {
      color: colors[index] // 根据产品名称设置颜色
    },
    // 通过添加额外的属性，能够在图例中隐藏产量为0的系列
    visible: filteredData.length > 0 // 只显示有数据的系列
  };
}).filter(series => series.data.length > 0), // 过滤掉全为0的系列
    };

    // 应用配置
    productOutputChart.setOption(productOutputOption);
  }
},

fetchDevicesEmissionsData() {
  const currentYear = this.selectedYear;
  const currentMonth = this.selectedMonth;
     
      axios.get(`https://172.160.11.205:443/chaiyoucarbonlabel-energy-data`, { params: {
                type: 'devices_carbon_emissions',
                year: this.selectedYear,
                month: this.selectedMonth
              } })
        .then(response => {
          this.devicesEmissionsPieData = response.data;
          this.renderPieChart(); // 渲染饼图
        })
        .catch(error => {
          console.error("Error fetching devices emissions data:", error);
        });
    },
    renderPieChart() {
      const chartDom = document.getElementById('devices-emissions-pie-chart');
      this.chart = echarts.init(chartDom);
      const currentYear = this.selectedYear;
  const currentMonth = this.selectedMonth;
      // 准备数据
      const pieData = this.devicesEmissionsPieData.map(item => ({
        name: item.device,
        value: item.emissions,
        itemStyle: { color: this.device_Colors[item.device] || '#ccc' },
      }));

      // 配置饼图
      const option = {
        title: {
          text: `装置二氧化碳排放量(吨)(${this.selectedYear}-${this.selectedMonth})`,
          left: 'center',
          textStyle: {
                fontSize: 20, // 设置标题字体大小
                fontWeight: 'bold',
                color: '#333' // 标题颜色
            }

        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
                const device = params.name; // 获取设备名称
                const emissions = params.value.toFixed(2); // 保留两位小数
                const percent = params.percent.toFixed(2); // 获取百分比
                return `${device}<br/>装置碳排量：${emissions} 吨<br/>占比：${percent}%`; // 保留“装置”字样
            }

        },
       
        series: [
          {
            name: '装置二氧化碳排放量',
            
            type: 'pie',
            radius: ['35%', '65%'],
                center: ['50%', '60%'],
            data: pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            
            labelLine: {
                    show: true,
                    length: 10,
                    length2: 10
                },

            label: {
                    show: true,
                    position: 'outside', // 标签显示在外部
                    color: '#333333',
                    fontSize: 14,
                    overflow: 'break',
                    formatter: (params) => {
                        return `${params.name.replace('装置', '')}`; 
                    }
                  }

          },
        ],
      };

      // 使用配置项显示图表
      this.chart.setOption(option);
    },

      renderCharts1() {
        
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
              text: `能源结构(吨标油)(${this.selectedYear}-${this.selectedMonth})`,
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
                const value = params.value; // 获取数值
                const percent = params.percent; // 获取百分比
                return `能源结构：<br/>${params.name}: ${value.toFixed(2)} 吨 <br/>占比：${percent.toFixed(2)}%`; // 保留两位小数并添加单位
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
                center: ['50%', '60%'],
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
              text: `碳排来源(吨二氧化碳)(${this.selectedYear}-${this.selectedMonth})`,
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
            // 使用 toFixed(2) 保留两位小数
            const value = params.value.toFixed(2);
            
            return `碳排来源：<br/>${params.name}: ${value} 吨 <br/>占比：${params.percent.toFixed(2)}%`; }// 显示保留两位小数的数值和百分比
            },
            legend: {
              show: false
            },
            series: [
              {
                name: '能源类型',
                type: 'pie',
                radius: ['35%', '65%'],
                center: ['50%', '60%'],
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

const devices_emissionsChartDom = document.getElementById('devices_emissions-pie');
if (devices_emissionsChartDom) {
    const devices_emissionsChart = echarts.init(devices_emissionsChartDom);
    console.log('Devices Emissions Data:', this.devices_emissionsData); // 确认数据
    
    const devices_EmissionsData = this.devices_emissionsData.map(item => ({
        device: item.device,
        emissions: item.emissions,
        
    }));

    const devices_emissionsOption = {
        title: {
            text: `各装置能耗(吨标油)(${this.selectedYear}-${this.selectedMonth})`,
            left: 'center',
            textStyle: {
                fontSize: 20, // 设置标题字体大小
                fontWeight: 'bold',
                color: '#333' // 标题颜色
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                const device = params.name; // 获取设备名称
                const emissions = params.value.toFixed(2); // 保留两位小数
                const percent = params.percent.toFixed(2); // 获取百分比
                return `${device+'装置'}<br/>装置能耗：${emissions} 吨<br/>占比：${percent}%`; // 保留“装置”字样
            }
        },
        series: [
            {
                name: '碳排放量',
                type: 'pie',
                radius: ['35%', '65%'],
                center: ['50%', '60%'],
                data: devices_EmissionsData.filter(item => item.emissions > 0).map(item => ({
                    name: item.device.replace('装置', ''),
                    value: item.emissions,
                    itemStyle: {
                        // 使用设备对应的颜色
                        color: this.device_Colors[item.device] || '#888888' // 如果没有对应的颜色，则使用默认色
                    }
                })),


                labelLine: {
                    show: true,
                    length: 10,
                    length2: 10
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)' // 高亮时的阴影效果
                    }
                },
                label: {
                    show: true,
                    position: 'outside', // 标签显示在外部
                    color: '#333333',
                    fontSize: 14,
                    overflow: 'break',
                    formatter: (params) => {
                        return `${params.name}`; // 标签上不再显示“装置”
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

  // 根据当前选择的月份，动态生成趋势图数据
  for (let month = startMonth; month <= endMonth; month++) {
    // 假设 dateList1 是从后端获取的完整月份数据列表
    // 我们需要根据当前选择的月份来筛选数据
    const monthData1 = this.dateList1.find(item => item[0].startsWith(currentYear) && item[0].endsWith(month.toString().padStart(2, '0')));


    // if (monthData1 && monthData2) {
    if (monthData1) {

      dateList1.push(`${currentYear}-${month.toString().padStart(2, '0')}`);
      valueList1.push(monthData1[1]);
    //   dateList2.push(`${currentYear}-${month.toString().padStart(2, '0')}`);
    //   valueList2.push(monthData2[1]);
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

        text: '生产柴油产品碳排趋势(吨二氧化碳)',
        textStyle: {
                    fontSize: 20, // 设置标题字体大小
                    fontWeight: 'bold',
                    color: '#333' // 标题颜色
                },
                
      },
    ],
   
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        const value = params[0].value.toFixed(2); // 保留两位小数
        return `时间: ${params[0].axisValue}<br/>碳排放强度: ${value} tCO₂/t`; // 显示月份和值并加上"吨"
      }
      
    },
    xAxis: [
      {
        type: 'category',
        data: Array.from({ length: endMonth }, (_, i) => `${currentYear}-${(i + 1).toString().padStart(2, '0')}`),
        axisLabel: {
          fontSize: 14,
          color: '#333333',
          formatter: function (value) {
            return value;
          }
        },
             },
    ],
    yAxis: [
      {
        name: '单位:tCO₂/t', // 添加副标题
        nameTextStyle: {
          fontSize: 14, // 设置副标题字体大小
          color: '#333'  // 设置副标题字体颜色
        },
      axisLabel: {
                fontSize: 14,
                color: '#333333' // 设置纵轴数值的字体颜色
            }},
      {
        // gridIndex: 1
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
        data: valueList1,
        itemStyle: {
            color: '#FFFF00'  // 改为红色
          },
          lineStyle: {
            color: '#FFFF00', // 线条颜色改为红色
            width: 3  // 线条加粗
          }
      },
    ]
  });
}
  },

    mounted() {
      // this.fetchData();
      // this.fetchCarbonFootprintData();
      this.fetchCarbonFootprintData(this.selectedDate);
      this.fetchData(this.selectedDate);
      this.fetchDevicesEmissionsData(this.selectedDate);
    }
  };
  </script>
  
  <style scoped>
  
  /* @import url("../assets/404_images/font/font.css"); */
  .new-roman {
  font-family: 'Times New Roman', serif;
}

  .title-container {
    text-align: center;
    margin-bottom: 20px;
  }

  .title-container h2 {
    font-size: 30px;
    font-weight: bold;
  }


  .title_date-row {
    display: flex;
    justify-content: center; /* 水平居中对齐 */
    align-items: center; /* 垂直居中对齐 */
    gap: 0px; /* 标题和选择框之间的间距 */
  }
  
  .select-wrapper {
    width: 10px; /* 调整选择框的宽度 */
    height: 40px; /* 调整选择框的高度 */
    /* display: flex; */
    margin-left: 5px;
    align-items: center; /* 使内部的label和选择框垂直居中 */
  }
  .el-date-picker {
    width: 100%; 
    height: 10px; /* 让 date-picker 占满 wrapper */
    width: 200px;
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
    margin-left: -20px;
    margin-top: 10px;
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

.select-row {
  display: flex;
  /* align-items: center; */
  gap: 10px; /* 控制标签和选择框之间的间距 */
}
.diesels-section {
  border: 1px solid #ccc; /* 框的边框 */
  border-radius: 8px; /* 框的圆角 */
  padding: 20px; /* 内边距 */
  margin-bottom: 20px; /* 下边距 */
  background-color: #f9f9f9; /* 框的背景色 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  width: 3000px;
  height: 220px;
  margin: 0 auto 20px auto;
  position: relative; /* 作为相对参照 */
  top: -15px; 
}


.charts-section {
  border: 1px solid #ccc; /* 框的边框 */
  border-radius: 8px; /* 框的圆角 */
  padding: 20px; /* 内边距 */
  margin-bottom: 20px; /* 下边距 */
  background-color: #f9f9f9; /* 框的背景色 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  width: 3000px;
  margin: 0 auto 20px auto;
  top: -15px; 
}
.diesels-container {
    
    grid-template-columns: repeat(3, 1fr); /* 确保每行显示三个燃料油图片 */
    gap: 20px;
    padding: 20px;
    max-width: 1200px; /* 设置一个足够宽的最大宽度以容纳三个图片 */
    position: absolute; /* 绝对定位相对于 diesels-section */
  top: 50%; /* 垂直居中 */
  left: 50%; /* 水平居中 */
  transform: translate(-50%, -50%); /* 确保在父容器中居中 */
  text-align: start;
  
  /* margin-top: -5px; */
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* 水平居中 */
  margin-top: 8px;
  margin-left:-850px;
}
  
  .diesel {
    background: white;
    border: 1px solid #ddd;
    padding: 10px;
    transition: box-shadow 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: center; /* 垂直居中 */
    align-items: center; /* 水平居中 */
    text-align: center; /* 确保文本居中 */
    width: 230px; 
    height: 185px;
  min-width: 200px; /* 或者你希望的任何最小宽度 */
  }
  
  .diesel:hover {
    box-shadow: 0 0 11px rgba(33, 33, 33, .2);
  }



.charts-row {
    display: flex;
    align-items: flex-start; /* Align items at the start */
    width: 100%;
    margin-top:-25px;
    /* margin-left: */
}
.pie-charts {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    max-width: 1000px; 
    justify-content: flex-start; /* 使容器水平居中 */
    margin-left: -15px; 
    /* Limit max-width to fit alongside the info boxes */
}
  
.pie-chart {
    flex: 1;
    margin-right: -5px;
    margin-top:20px;
}
.legend-container {
    display: flex;
    flex-wrap: wrap; /* 允许换行 */
    justify-content: flex-start;
    /* margin-top: 10px; */
    margin-left: 40px; 
 top:5px;
}

.legend-item {
    display: flex;
    align-items: center;
    margin: 2px; /* 设置左右间隔为5px，总间隔为10px */
    flex-basis: calc(20% - -45px); /* 每行最多放6个 */
    box-sizing: border-box; /* 确保margin不会影响宽度计算 */

}
.legend-text {
    font-size: 14px; /* 设置字体大小为14px */
}
.legend-row {
    display: flex;
    align-items: flex-start; /* Align items at the start */
    width: 100%;
    margin-top:-10px;
}
.bars-chart-container {
    margin-top: 290px;
    width: 100%;
    display: flex;
    justify-content: start;
    position: relative;   /* 使用相对定位 */
    left: -300px; 
    margin-bottom: 20px;
  
  }

.bar-chart {
    width: 100%;
    max-width: 1200px;
    margin-top: 100px;
  
  }
.bars-chart {
  display: flex; /* 使用弹性布局 */
  justify-content: start; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 100%;
  max-width: 2500px;
  margin: 0 auto; /* 确保在框中居中 */
  margin-top: -300px; /* 仍然可以保留这个负边距 */
  margin-left: 280px;
  }

.trend-chart {
  margin-bottom: 20px;
  margin-left: -20px;
  justify-content: center;
}
.trend-chart-container {
  
  width: 100%;
  display: flex;
  justify-content: start; /* 使容器水平居中 */
  margin-left: -100px; 
  margin-top: 50px; 
  white-space: nowrap; /* 防止内容换行 */
  position: relative;   /* 使用相对定位 */
 
  margin-bottom: 20px;
  margin-top: -10px;

 
}
  
  label {
    float: left;
    width: auto;
    font-size: 20px;
    margin-right: 10px;
    margin-left: 230px;
  }
  
  
  
  h1, h3 {
    color: #000000;
    font-family: '宋体', SimSun, sans-serif;
    font-size: 30px;
  }
  .h2{
    font-size: 30px;
    font-weight: bold;           
  }
  h4 {
    color: #000000;
    font-family: '宋体', SimSun, sans-serif;
    font-size: 14px;

            
  }
  
  p {
    font-size: 16px;
    font-family: '宋体', SimSun, sans-serif;
  }
  
  .diesel img {
    max-width: 180px;
    height: 120px;
    /* width:250px; */
    margin-bottom:5px; /* 添加图片和标题之间的空隙 */
  }
  
  /* .annual-button {
    padding: 8px 15px;
    margin-left: 20px;
    font-size: 18px;
    border: 2px solid #000000;
    border-radius: 8px;
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
    font-family: '宋体', SimSun, sans-serif;
  }
  
  .annual-button:hover {
    background-color: #45a049;
  }
   */
  .app-container, .select-wrapper, .diesel {
    font-family: '宋体', SimSun, sans-serif;

  }


.section-box {
  border: 1px solid #ccc; /* 框的边框 */
  border-radius: 8px; /* 框的圆角 */
  padding: 20px; /* 内边距 */
  margin-bottom: 20px; /* 下边距 */
  background-color: #f9f9f9; /* 框的背景色 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  width: 3000px;
  height: 410px;
  margin: 0 auto 20px auto;
  margin-top: -15px; 
}
.charts-section {
  border: 1px solid #ccc; /* 框的边框 */
  border-radius: 8px; /* 框的圆角 */
  padding: 20px; /* 内边距 */
  margin-bottom: 20px; /* 下边距 */
  background-color: #f9f9f9; /* 框的背景色 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  width: 3000px;
  margin: 0 auto 20px auto;
  top: -15px; 
}



.trend-chart-section {
  border: 1px solid #ccc; /* 框的边框 */
  border-radius: 8px; /* 框的圆角 */
  padding: 20px; /* 内边距 */
  margin-bottom: 20px; /* 下边距 */
  background-color: #f9f9f9; /* 框的背景色 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  width: 3000px;
  height: 285px;
  margin: 0 auto 20px auto;
  top: -15px; 
}
.bars-chart-section{
  border: 1px solid #ccc; /* 框的边框 */
  border-radius: 8px; /* 框的圆角 */
  padding: 20px; /* 内边距 */
  margin-bottom: 20px; /* 下边距 */
  background-color: #f9f9f9; /* 框的背景色 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  width: 3000px;
  height: 420px;
  margin: 0 auto 20px auto;
  top: -15px; 
}


/* .diesel-image {
  max-width: 100%; 
  height: 100px; 
  width: 180px;
} */

.pie-charts {
  display: flex; /* 使饼图水平排列 */
  justify-content: space-between; /* 均匀分布 */
  /* margin-left:-10px; */
}



.color-box {
  width: 15px; /* 颜色块的宽度 */
  height: 15px; /* 颜色块的高度 */
  margin-right: 5px; /* 颜色块与文本的间距 */
  display: inline-block; /* 使颜色块与文本在同一行 */

}
.diesels-row {
    display: flex;
    align-items: flex-start; /* Align items at the start */
    width: 100%;
   
}


.bar-chart,
.bars-chart,
#trend-chart {
  width: 100%;
}


.scrollable-container {
  width: 100%; /* 或设置为您希望的最大宽度 */
  overflow-x: scroll; /* 始终显示水平滚动条 */
  white-space: nowrap; /* 防止内容换行 */
  overflow: hidden;
}

  
.info-boxes {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap:6px;
  flex: 1; /* 让info-boxes占据可用空间 */
  min-width: 200px; /* 或者你希望的任何最小宽度 */
  margin-left: 20px; /* 设置info-boxes左边的边距 */
  margin-top: 1px;
}

.info-box {
  border: 2px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  padding: 15px;
  margin-bottom: 20px;
  width: 260px;
  height: 80px;
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
  top: -1px; /* Adjust vertical position to move title up slightly */
}
  
  .info-value {
    color: #333;
    font-size: 20px;
  }

 
.diesel-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* 设置卡片之间的间距 */
}



</style>
  