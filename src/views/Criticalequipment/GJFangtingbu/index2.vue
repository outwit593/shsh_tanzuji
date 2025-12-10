<template>
  <div class="efficiency-tables">
      <!-- 标题 -->
      <h1>芳烃部关键用能设备能效监控</h1>

      <!-- 芳烃部表格容器 -->
      <div class="table-row">
        <!-- 第一个加热炉炉表格 -->
        <div class="table-container">
          <h2>加热炉</h2>
          <table class="efficiency-table">
            <thead>
              <tr>
                <th>设备编号</th><th>排烟温度 (℃)</th><th>排烟氧含量 (%)</th><th>热效率 (%)</th><th>报警提示</th>
                <th class="gap-head"></th>
                <th>设备编号</th><th>排烟温度 (℃)</th><th>排烟氧含量 (%)</th><th>热效率 (%)</th><th>报警提示</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(crackerPair, index) in pairedCrackers" :key="index"
                  :class="`row-${index % 2 === 0 ? 'odd' : 'even'}`">
                <td>{{ crackerPair.cracker1['设备编号'] }}</td>
                <td>{{ crackerPair.cracker1['排烟温度'] }}</td>
                <td>{{ crackerPair.cracker1['排烟氧含量'] }}</td>
                <td>{{ crackerPair.cracker1['热效率'] }}</td>
                <td :style="{ color: crackerPair.cracker1['报警颜色'] }">{{ crackerPair.cracker1['报警状态'] }}</td>
                <td class="gap-cell"></td>
                <td>{{ crackerPair.cracker2['设备编号'] }}</td>
                <td>{{ crackerPair.cracker2['排烟温度'] }}</td>
                <td>{{ crackerPair.cracker2['排烟氧含量'] }}</td>
                <td>{{ crackerPair.cracker2['热效率'] }}</td>
                <td :style="{ color: crackerPair.cracker2['报警颜色'] }">{{ crackerPair.cracker2['报警状态'] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


    
  </div>
</template>


<script>
import axios from 'axios';


export default {
  name: 'EfficiencyMonitor',
  data() {
    return {
      // 这里是您的数据模型
		crackers1: [],
	  pairedCrackers: [],
	

    };
  },
  created() {
      this.fetchCrackerData1();// 组件创建时获取数据
    },
    methods: {
      min(value1, value2) {
          return Math.min(value1, value2);
        },
      fetchCrackerData1() {
        axios.get('https://172.160.11.205:443/api/fangtingjrl')
          .then(response => {
            if (Array.isArray(response.data)) {
              this.crackers1 = response.data.map(cracker => {
                let alarmStatus = '正常';
                let alarmColor = 'black';
                if(cracker['热效率'] == 0 && cracker['排烟温度'] < 30) {
                  alarmStatus = '装置停运';
                  alarmColor = 'blue';
                } 
                else if (cracker['热效率'] < 90 && cracker['排烟温度'] > 30) {
                  alarmStatus = '超界限报警';
                  alarmColor = 'red';
                }
                
                return {
                  ...cracker,
                  报警状态: alarmStatus,
                  报警颜色: alarmColor
                };

              });
                this.pairCrackers();
            } else {
              console.error('返回的数据不是一个数组');
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      },
   
    pairCrackers() {
              let pairedData = [];
              for (let i = 0; i < this.crackers1.length; i += 2) {
                  pairedData.push({
                      cracker1: this.crackers1[i],
                      cracker2: i + 1 < this.crackers1.length ? this.crackers1[i + 1] : null
                  });
              }
              this.pairedCrackers = pairedData;
          }
    },

    }

</script>

<style scoped>
.efficiency-tables {
  display: flex;
  flex-direction: column;
  align-items: left;
  width: 100%;
  padding: 10px;
}

.table-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.table-container {
  flex: 1;
  margin: 10px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: none;
  box-sizing: border-box;
}



.table-container.single-table {
  width: 100%; /* 单独表格宽度 */
}

.table-container h2 {
  margin-bottom: 15px;
  color: #000000;
  text-align: left;
  font-size:14px;
}

.efficiency-table {
  width: 100%;
  border-collapse: collapse;
}

.efficiency-table th, .efficiency-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
  font-size:12px
}

.efficiency-table th:not(gap-head),
.efficiency-table td:not(gap-cell) {
  border: 1px solid #ddd;
}

.gap-head,
.gap-cell {
  width:1%;
  background-color: white !important;
  border:none !important;
  padding:12%;

}



.efficiency-table th {
  background-color: #f9f9f9;
  color: black;
}

/* 奇数行和偶数行的背景色 */
.row-odd {
  background-color: #fff;
}

.row-even {
  background-color: #f9f9f9;
}

h1 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
  font-size:16px
}

.text-red {
  color: red;
}
.text-black {
  color: black;
}
</style>