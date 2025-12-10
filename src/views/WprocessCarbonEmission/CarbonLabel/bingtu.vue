<template>
    <div class="energy-consumption">
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

    axios.get('http://localhost:5000/energy-consumption', {
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
        text: `Energy Consumption (${this.selectedYear}${this.timePeriod === 'month' ? '-' + (this.selectedMonth < 10 ? '0' + this.selectedMonth : this.selectedMonth) : ''})`,
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      series: [
        {
          name: 'Energy Type',
          type: 'pie',
          radius: '50%',
          data: data.map(item => ({ value: item.total, name: item.energy_type })),
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
    this.chart.setOption(option);
  }
    }
  };
  </script>
  
  <style scoped>
  .energy-consumption {
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
    max-width: 800px;
    height: 400px;
  }
  </style>
