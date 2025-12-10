<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">{{ title }}</div> -->
    <div class="dashboard1">
      <div v-for="item in dataObj" :key="item.name1" class="dashboard1-1">
        <img class="daImg" :src="item.icon1">
        <p class="daTitle">{{ item.name1 }}</p>
        <div class="daData">
          <p>{{ item.num1 }}</p>
          <img :src="item.icon2" width="20">
          <p>{{ item.num2 }}</p>
        </div>
      </div>
    </div>
    <el-card class="cardMap">
      <div class="mapLY" @click="Lianyoubu">
        <p style="text-align: center;">炼油部</p>
        <p style="text-align: center;">data</p>
      </div>
      <div class="mapXT" @click="Xitingbu">
        <p style="text-align: center;">烯烃部</p>
        <p style="text-align: center;">data</p>
      </div>
      <div class="mapFTHG" @click="Fangtinghuagong">
        <p style="text-align: center;">芳烃化工部</p>
        <p style="text-align: center;">data</p>
      </div>
      <div class="mapFTLY" @click="Fangtinglianyou">
        <p style="text-align: center;">芳烃炼油部</p>
        <p style="text-align: center;">data</p>
      </div>
      <div class="mapCY" @click="Chuyunbu">
        <p style="text-align: center;">储运部</p>
        <p style="text-align: center;">data</p>
      </div>
    </el-card>
    <div id="dashboardTable" />
    <div id="dashboardPie" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios';
export default {
  name: 'Dashboard',
  data() {
    return {
      title: '全流程碳排情况',
      importdata: [],
      dataObj: [
        {
          name1: '今日总能耗（标油吨）',
          icon1: require('@/icons/image/deleption.png'),
          num1: '1000',
          icon2: require('@/icons/image/uparrow.png'),
          num2: '1%'
        },
        {
          name1: '今日总碳排量（吨）',
          icon1: require('@/icons/image/deemission.png'),
          num1: '500',
          icon2: require('@/icons/image/downarrow.png'),
          num2: '5%'
        },
        {
          name1: '本月总能耗（标油吨）',
          icon1: require('@/icons/image/deleption.png'),
          num1: '1000',
          icon2: require('@/icons/image/uparrow.png'),
          num2: '1%'
        },
        {
          name1: '本月总碳排量（吨）',
          icon1: require('@/icons/image/deemission.png'),
          num1: '500',
          icon2: require('@/icons/image/downarrow.png'),
          num2: '5%'
        },
        {
          name1: '本月总经济效益（元）',
          icon1: require('@/icons/image/deeconomic.png'),
          num1: '1000',
          icon2: require('@/icons/image/uparrow.png'),
          num2: '1%'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    this.fetchLineData();
    this.pie()
  },
  methods: {
    fetchLineData() {
    axios.get('http://localhost:8083/api/data')
      .then(response => {
        this.dateList1 = response.data.dateList1;
        this.dateList2 = response.data.dateList2;
        this.line(this.dateList1, this.dateList2);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  },
    line(data1,data2) {
      const dateList1 = data1.map(function(item) {
        return item[0]
      })
      const valueList1 = data1.map(function(item) {
        return item[1]
      })
      const dateList2 = data2.map(function(item) {
        return item[0]
      })
      const valueList2 = data2.map(function(item) {
        return item[1]
      })
      const myChart = this.$echarts.init(document.getElementById('dashboardTable'))
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
            max: dateList2.length - 1
          }
        ],
        title: [
          {
            left: 'center',
            text: '炼油部的月度能耗'
          },
          {
            top: '55%',
            left: 'center',
            text: '碳排趋势图'
          }
        ],
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            data: dateList1
          },
          {
            data: dateList2,
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
      })
    },
    pie() {
      const data = [{
        name: '抽余碳四B',
        value: '120.123'
      },
      {
        name: '甲醇',
        value: '21.5049'
      },
      {
        name: '气制氢气B',
        value: '0'
      },
      {
        name: '抽甲基叔丁基醚B',
        value: '81.0058'
      },
      {
        name: '丁烯-1B',
        value: '26.5249'
      },
      {
        name: '醚后液化石油气B',
        value: '39.5156'
      }]
      const myChart = this.$echarts.init(document.getElementById('dashboardPie'))
      myChart.setOption({
        title: [
          {
            text: '装置碳排占比',
            left: 'center'
          },
          {
            subtext: '1#MTBE',
            left: '16.67%',
            top: '50%',
            textAlign: 'center'
          },
          {
            subtext: '2#常减压装置',
            left: '50%',
            top: '50%',
            textAlign: 'center'
          },
          {
            subtext: '3#柴油加氢装置',
            left: '83.33%',
            top: '50%',
            textAlign: 'center'
          }
        ],
        series: [
          {
            type: 'pie',
            radius: '25%',
            center: ['50%', '50%'],
            data: data,
            label: {
              position: 'outer',
              alignTo: 'none',
              bleedMargin: 5
            },
            left: 0,
            right: '60%',
            top: -180,
            bottom: 0
          },
          {
            type: 'pie',
            radius: '25%',
            center: ['50%', '50%'],
            data: data,
            label: {
              position: 'outer',
              alignTo: 'none',
              bleedMargin: 5
            },
            left: '30%',
            right: '30%',
            top: -180,
            bottom: 0
          },
          {
            type: 'pie',
            radius: '25%',
            center: ['50%', '50%'],
            data: data,
            label: {
              position: 'outer',
              alignTo: 'none'
              // edgeDistance: 20
            },
            left: '60%',
            right: 0,
            top: -180,
            bottom: 0
          }
        ]
      })
    },
    Lianyoubu() {
      this.$router.push({ path: '/documentquery/lianyoubu' })
    },
    Xitingbu() {
      this.$router.push({ path: '/documentquery/xitingbu' })
    },
    Fangtinghuagong() {
      this.$router.push({ path: '/documentquery/fangtinghuagongbu' })
    },
    Fangtinglianyou() {
      this.$router.push({ path: '/documentquery/fangtinglianyoubu' })
    },
    Chuyunbu() {
      this.$router.push({ path: '/documentquery/chuyunbu' })
    }
  }
}
</script>

<style lang="scss" scoped>

.dashboard-text {
  //font-size: larger;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
.dashboard1 {
  position: relative;
  width: 90%;
  height: 150px;
  top: 30px;
  margin: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  .dashboard1-1 {
    position: relative;
    width: 15%;
    height: 80%;
    float: left;
    top: 15px;
    margin-left: 50px;

    .daTitle {
      position: absolute;
      top: 20px;
      left: 20px;
      color: rgb(51, 51, 52);
      font-size: 15px;
    }

    .daImg {
      position: absolute;
      margin-left: 15px;
      top: 60px;
      width: 50px;
    }

    .daData {
      position: absolute;
      top: 70px;
      margin-left: 70px;

      p {
        float: left;
        margin-left: 15px;
        color: rgb(51, 51, 52);
        font-size: medium;
      }

      img {
        float: left;
        margin-left: 15px;
      }
    }
  }
}

.cardMap{
  position: relative;
  width: 100%;
  height: 800px;
  margin: 30px;
  background: url('~@/icons/image/map/map.png') center center no-repeat;
  .mapLY{
    position: absolute;
    border-radius: 25px;
    right: 27%;
    top: 20%;
    width: 130px;
    height: 60px;
    padding: 10px 30px;
    background-color: cornflowerblue;
  }
  .mapXT{
    position: absolute;
    border-radius: 25px;
    left: 28%;
    top: 32%;
    width: 130px;
    height: 60px;
    padding: 10px 30px;
    background-color: cornflowerblue;
  }
  .mapFTHG{
    position: absolute;
    border-radius: 25px;
    left: 41%;
    top: 14%;
    width: 140px;
    height: 60px;
    padding: 10px 30px;
    background-color: cornflowerblue;
  }
  .mapFTLY{
    position: absolute;
    border-radius: 25px;
    left: 51%;
    top: 48%;
    width: 140px;
    height: 60px;
    padding: 10px 30px;
    background-color: cornflowerblue;
  }
  .mapCY{
    position: absolute;
    border-radius: 25px;
    right: 11%;
    bottom: 13%;
    width: 140px;
    height: 60px;
    padding: 10px 30px;
    background-color: cornflowerblue;
  }
}

#dashboardTable {
  position: relative;
  width: 100%;
  height: 500px;
  margin: 30px;
}
#dashboardPie{
  position: relative;
  width: 90%;
  height: 400px;
  margin: 30px;
}

</style>

