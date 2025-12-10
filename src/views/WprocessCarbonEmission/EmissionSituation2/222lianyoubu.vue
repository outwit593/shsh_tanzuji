<template>
    <div class="device-emissions">
      <div class="controls">
        <label for="year-select">Year:</label>
        <select id="year-select" v-model="selectedYear" @change="fetchData">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
  
        <label for="month-select" v-if="timePeriod === 'month'">Month:</label>
        <select id="month-select" v-if="timePeriod === 'month'" v-model="selectedMonth" @change="fetchData">
          <option v-for="month in months" :key="month" :value="month">{{ month < 10 ? '0' + month : month }}</option>
        </select>
  
        <label for="time-period">Time Period:</label>
        <select id="time-period" v-model="timePeriod" @change="fetchData">
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>
      </div>
      <div ref="chart" class="chart"></div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import * as echarts from 'echarts';
  
  export default {
    data() {
      return {
        selectedYear: new Date().getFullYear(),
        selectedMonth: new Date().getMonth() + 1,
        timePeriod: 'month', // 'month' 或 'year'
        years: [2022, 2023, 2024], // 假设的年份列表
        months: Array.from({ length: 12 }, (_, i) => i + 1),
        chart: null
      };
    },
    mounted() {
      this.chart = echarts.init(this.$refs.chart);
      this.fetchData();
    },
    methods: {
        fetchData() {
            const params = {
      year: this.selectedYear,
      month: this.timePeriod === 'month' ? this.selectedMonth : null
    };

  
    axios.get('http://localhost:5000/lianyoubu-emissions', {
      params: params,
      withCredentials: true
    })
        .then(response => {
          this.updateChart(response.data);
        })
        .catch(error => {
          console.error("There was an error!", error);
        });
      },
        updateChart(data) {
        const option = {
          title: {
            text: `装置碳排放分析(${this.selectedYear}${this.timePeriod === 'month' ? '-' + (this.selectedMonth < 10 ? '0' + this.selectedMonth : this.selectedMonth) : ''})`,
            left: 'center',
            // top: '10%'
          },
          subtitle: {
      text: '单位：吨',
      left: 'center',
      top: '10%',
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
      bottom: '15%',  // Increase bottom margin to prevent label clipping
      containLabel: true
    },
          xAxis: {
            type: 'category',
            data: data.map(item => item.device),
            axisLabel: {
        interval: 0, // Show all labels
        rotate: 45,  // Rotate the labels by 90 degrees
        // align: 'center',
        // verticalAlign: 'middle'
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
              data: data.map(item => item.emissions),
              itemStyle: {
                color: params => (params.value < 0 ? '#ff0000' : '#00ff00'), // 负值红色，正值绿色
                // barBorderRadius: [0, 0, 10, 10] // 圆角
              },
              barWidth: '40%',  // 增加柱子的宽度
              barCategoryGap: '100%'  // 增加柱子之间的间距
            }
          ]
        };
        this.chart.setOption(option);
      }
    }
  };
  </script>
  
  <style scoped>
  .device-emissions {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  
  .controls {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    width: 100%;
    max-width: 800px;
  }
  
  .controls label {
    margin-right: 10px;
  }
  
  .controls select {
    padding: 5px;
    font-size: 16px;
  }
  
  .chart {
    width: 100%;
    max-width: 1300px;
    height: 500px;
    overflow: visible;
  }
  </style>
  