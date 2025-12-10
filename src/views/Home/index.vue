<template>
  <div class="home">
    <el-card class="box-card">
      <img class="homeImg" src="@/icons/image/login2.png">
      <img class="homeTitleC" src="@/icons/image/home/TitleC.png">
      <img class="homeTitleE" src="@/icons/image/home/TitleE.png">
      <el-button v-for="item in List" :key="item.name" plain :icon="item.icon" class="homeButton" @click="ChangePage(item.path)">{{ item.label }}</el-button>
      <!-- 循环播放的表格容器 -->
       <div class="carousel-container-row">
      
      <div class="carousel-container">
        <el-carousel trigger="click" :height="400" arrow="always" :indicator-position="outside">
          <el-carousel-item>
            <div class="efficiency-tables">
              <div class="table-row">
                <div class="single-table">
                  <h2>烯烃部裂解炉</h2>
                  <table class="efficiency-table cracker-table">
                    <thead>
                      <tr>
                        <th>设备编号</th>
                        <th>排烟温度 (℃)</th>
                        <th>排烟氧含量 (%)</th>
                        <th>热效率 (%)</th>
                        <th>报警提示</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(crackerPair, index) in pairedCrackers" :key="index" 
                          :class="`row-${index % 2 === 0 ? 'even' : 'odd'}`" 
                          v-if="(crackerPair.cracker1['报警状态'] !== '正常') || (crackerPair.cracker2['报警状态'] !== '正常')"> 
                        <td>{{ crackerPair.cracker1['设备编号'] }}</td>
                        <td>{{ crackerPair.cracker1['排烟温度'] }}</td>
                        <td>{{ crackerPair.cracker1['排烟氧含量'] }}</td>
                        <td>{{ crackerPair.cracker1['热效率'] }}</td>
                        <td :style="{ color: crackerPair.cracker1['报警颜色'] }">{{ crackerPair.cracker1['报警状态'] }}</td>
                      </tr>
                      <tr v-for="(crackerPair, index) in pairedCrackers" :key="`second-${index}`" 
                          :class="`row-${(index + 1) % 2 === 0 ? 'even' : 'odd'}`" 
                          v-if="crackerPair.cracker2['报警状态'] !== '正常'"> 
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
          </el-carousel-item>
          <el-carousel-item>
            <div class="efficiency-tables">
              <div class="single-table">
                <h2>烯烃部汽轮机</h2>
                <table class="efficiency-table turbine-table">
                  <thead>
                    <tr>
                      <th>设备编号</th>
                      <th>进汽流量 (t/h)</th>
                      <th>等熵效率1 (%)</th>
                      <th>等熵效率2 (%)</th>
                      <th>报警提示</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(turbine, index) in turbines" :key="turbine.设备编号" 
                        :class="`row-${index % 2 === 0 ? 'even' : 'odd'}`" 
                        v-if="turbine['报警状态'] !== '正常'"> 
                      <td>{{ turbine.设备编号 }}</td>
                      <td>{{ turbine.进汽流量 }}</td>
                      <td>{{ turbine.等熵效率1 }}</td>
                      <td>{{ turbine.等熵效率2 }}</td>
                      <td :style="{ color: turbine['报警颜色'] }">{{ turbine['报警状态'] }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <div class="efficiency-tables">
              <div class="single-table">
                <h2>烯烃部精馏塔</h2>
                <table class="efficiency-table distillation-table">
                  <thead>
                    <tr>
                      <th>设备编号</th>
                      <th>进料流量 (t/h)</th>
                      <th>热效率 (%)</th>
                      <th>报警提示</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(distillationColumn, index) in distillationColumns" :key="distillationColumn.设备编号"
                        :class="`row-${index % 2 === 0 ? 'even' : 'odd'}`" 
                        v-if="distillationColumn['报警状态'] !== '正常'">
                      <td>{{ distillationColumn.设备编号 }}</td>
                      <td>{{ distillationColumn.进料流量 }}</td>
                      <td>{{ distillationColumn.热效率 }}</td>
                      <td :style="{ color: distillationColumn['报警颜色'] }">{{ distillationColumn['报警状态'] }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <div class="efficiency-tables-container">
              <div class="single-table">
                <h2>炼油部裂解炉</h2>
                <table class="efficiency-table cracker-table">
                  <thead>
                    <tr>
                      <th>设备编号</th>
                      <th>排烟温度 (℃)</th>
                      <th>排烟氧含量 (%)</th>
                      <th>热效率 (%)</th>
                      <th>报警提示</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(crackerPair, index) in pairedCrackers" :key="index" 
                        :class="`row-${index % 2 === 0 ? 'even' : 'odd'}`" 
                        v-if="(crackerPair.cracker3['报警状态'] !== '正常') || (crackerPair.cracker4['报警状态'] !== '正常')"> 
                      <td>{{ crackerPair.cracker3['设备编号'] }}</td>
                      <td>{{ crackerPair.cracker3['排烟温度'] }}</td>
                      <td>{{ crackerPair.cracker3['排烟氧含量'] }}</td>
                      <td>{{ crackerPair.cracker3['热效率'] }}</td>
                      <td :style="{ color: crackerPair.cracker3['报警颜色'] }">{{ crackerPair.cracker3['报警状态'] }}</td>
                    </tr>
                    <tr v-for="(crackerPair, index) in pairedCrackers" :key="`second-${index}`" 
                        :class="`row-${(index + 1) % 2 === 0 ? 'even' : 'odd'}`" 
                        v-if="crackerPair.cracker4['报警状态'] !== '正常'"> 
                      <td>{{ crackerPair.cracker4['设备编号'] }}</td>
                      <td>{{ crackerPair.cracker4['排烟温度'] }}</td>
                      <td>{{ crackerPair.cracker4['排烟氧含量'] }}</td>
                      <td>{{ crackerPair.cracker4['热效率'] }}</td>
                      <td :style="{ color: crackerPair.cracker4['报警颜色'] }">{{ crackerPair.cracker4['报警状态'] }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </el-carousel-item>
          <el-carousel-item>
              <div class="efficiency-tables-container">
              <div class="single-table">
                <h2>芳烃部加热炉</h2>
                <table class="efficiency-table cracker-table">
                  <thead>
                    <tr>
                      <th>设备编号</th>
                      <th>排烟温度 (℃)</th>
                      <th>排烟氧含量 (%)</th>
                      <th>热效率 (%)</th>
                      <th>报警提示</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(crackerPair, index) in pairedCrackers" :key="index" 
                        :class="`row-${index % 2 === 0 ? 'even' : 'odd'}`" 
                        v-if="(crackerPair.cracker5['报警状态'] !== '正常') || (crackerPair.cracker6['报警状态'] !== '正常')"> 
                      <td>{{ crackerPair.cracker5['设备编号'] }}</td>
                      <td>{{ crackerPair.cracker5['排烟温度'] }}</td>
                      <td>{{ crackerPair.cracker5['排烟氧含量'] }}</td>
                      <td>{{ crackerPair.cracker5['热效率'] }}</td>
                      <td :style="{ color: crackerPair.cracker5['报警颜色'] }">{{ crackerPair.cracker5['报警状态'] }}</td>
                    </tr>
                    <tr v-for="(crackerPair, index) in pairedCrackers" :key="`second-${index}`" 
                        :class="`row-${(index + 1) % 2 === 0 ? 'even' : 'odd'}`" 
                        v-if="crackerPair.cracker6['报警状态'] !== '正常'"> 
                      <td>{{ crackerPair.cracker6['设备编号'] }}</td>
                      <td>{{ crackerPair.cracker6['排烟温度'] }}</td>
                      <td>{{ crackerPair.cracker6['排烟氧含量'] }}</td>
                      <td>{{ crackerPair.cracker6['热效率'] }}</td>
                      <td :style="{ color: crackerPair.cracker6['报警颜色'] }">{{ crackerPair.cracker6['报警状态'] }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          
          </el-carousel-item>
        </el-carousel>
      </div>
     
      <div class="carousel-container" style="margin-left: 50.2%;">
        <el-carousel trigger="click" :height="400" arrow="always" :indicator-position="outside">
          <el-carousel-item>

          </el-carousel-item>
          <el-carousel-item>

</el-carousel-item><el-carousel-item>

</el-carousel-item>
        </el-carousel>
        </div>
    </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      List: [
        {
          name: 'CarbonEmission',
          label: '全流程碳排监控',
          icon: 'el-icon-s-management',
          path: '/carbonemission/emissionsituation'
        }, {
          name: 'DataQuery',
          label: '能耗/碳排数据查询',
          icon: 'el-icon-s-data',
          path: '/dataquery/companyentity'
        }, {
          name: 'Criticalequipment',
          label: '关键设备能效监控',
          icon: 'el-icon-s-custom',
          path: '/criticalequipment/gjlianyoubu/lyjiarelu'
        }, {
          name: 'EmissionReport',
          label: '碳排报告',
          icon: 'el-icon-s-marketing',
          path: '/emissionreport/carbonassets'
        }
      ],
      pairedCrackers: [],
      turbines: [],
      distillationColumns: [],
      currentTable: 'cracker',
      tableIndex: 0,
      intervalId: null,
      crackers1: [],
      crackers2: [],
      crackers3: [],
      crackers4: [],
      crackers5: [],
      crackers6: [],
      tableNames: ['cracker', 'turbine', 'distillationColumn'],
      // autoScrollInterval: null,
      progress: 33,
      isHoveringProgressBar: false,
      // progress1: 33,
      // progress2: 33,
      // progress3: 33,
      currentTable: 'cracker',
    };
  },
  created() {
    this.fetchCrackerData1();
    this.fetchTurbineData2();
    this.fetchTurbineData3();
    this.startAutoScroll();
    this.fetchCrackerData3();
    this.fetchCrackerData5();

    // this.startTableRotation();
  },
  methods: {
   
    min(value1, value2) {
      return Math.min(value1, value2);
    },
    fetchCrackerData1() {
      axios.get('https://172.160.11.205:443/api/data1')
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

      fetchTurbineData2() {
       axios.get('https://172.160.11.205:443/api/data2')
         .then(response => {
           if (Array.isArray(response.data)) {
             this.turbines = response.data.map(turbine => {
               const minEfficiency = this.min(turbine['等熵效率1'], turbine['等熵效率2']);
               let alarmStatus = '正常';
               let alarmColor = 'black';
               if(minEfficiency < 60) {
                alarmStatus = '超界限报警';
                alarmColor = 'red';

               }
               if(minEfficiency == 0) {
                alarmStatus = '装置停运';
                alarmColor = 'blue';
               }
               
               return {
                 ...turbine,
                 报警状态: alarmStatus,
                 报警颜色: alarmColor
               };
             });
            } else {
             console.error('返回的数据不是一个数组');
           }
         })
         .catch(error => {
           console.error('Error fetching turbine data:', error);
         });
     },
    fetchTurbineData3() {
      axios.get('https://172.160.11.205:443/api/data3')
        .then(response => {
          if (Array.isArray(response.data)) {
            this.distillationColumns = response.data.map(column => {
              let alarmStatus = '正常';
              let alarmColor = 'black';
               if(column['热效率'] < 30) {
                alarmStatus = '超界限报警';
                alarmColor = 'red';


              }
               if (column['进料流量'] < 10) {
                alarmStatus = '装置停运';
                alarmColor = 'blue';
               }
               
               return {
                 ...column,
                 报警状态: alarmStatus,
                 报警颜色: alarmColor
               };
              
            
            });
          } else {
            console.error('返回的数据不是一个数组');
          }
        })
        .catch(error => {
          console.error('Error fetching distillationColumns data:', error);
        });
    },
    fetchCrackerData3() {
        axios.get('https://172.160.11.205:443/api/lianyoujrl')
          .then(response => {
            if (Array.isArray(response.data)) {
              this.crackers3 = response.data.map(cracker => {
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
    fetchCrackerData5() {
        axios.get('https://172.160.11.205:443/api/fangtingjrl')
          .then(response => {
            if (Array.isArray(response.data)) {
              console.log(response.data)
              this.crackers5 = response.data.map(cracker => {
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
                      cracker2: i + 1 < this.crackers1.length ? this.crackers1[i + 1] : null,
                      cracker3: this.crackers3[i],
                      cracker4: i + 1 < this.crackers3.length ? this.crackers3[i + 1] : null,
                      cracker5: this.crackers5[i],
                      cracker6: i + 1 < this.crackers5.length ? this.crackers5[i + 1] : null
                  });
              }
              this.pairedCrackers = pairedData;
          },
    
    
          ChangePage(path) {
      this.$router.push(path);
    },
    
    prevTable() {
      this.tableIndex = (this.tableIndex - 1 + this.tableNames.length) % this.tableNames.length;
      this.currentTable = this.tableNames[this.tableIndex];
    },
    nextTable() {
      this.tableIndex = (this.tableIndex + 1) % this.tableNames.length;
      this.currentTable = this.tableNames[this.tableIndex];
    },
    startAutoScroll() {
      if (!this.isHoveringProgressBar) {
        this.intervalId = setInterval(() => {
          this.nextTable();
        }, 3000); // Change the table every 3 seconds
      }
    },
    stopAutoScroll() {
      clearInterval(this.intervalId);
    },
    changeTableByProgressBar(event) {
      const rect = event.target.getBoundingClientRect();
      const width = rect.width;
      const clickX = event.clientX - rect.left;
      // this.progress = clickX / width * 100;
      
      // 根据点击位置设置当前表格和进度条的百分比
      if (clickX < width / 3) {
        this.currentTable = 'cracker';
        this.progress = 33;
      } else if (clickX < width * 2 / 3) {
        this.currentTable = 'turbine';
        this.progress = 66;
      } else {
        this.currentTable = 'distillationColumn';
        this.progress = 100;
      }
      
      this.stopAutoScroll(); // 点击后停止自动切换
    },
    
    
  mounted() {
  },
  beforeDestroy() {
    this.stopAutoScroll();
  }
}
};
</script>



<style scoped> 


.home { 
  position: relative; 
  width: 100%; 
  height: 3000px; 
  top: 0px; }
.box-card { 
  position: absolute; 
  width: 95%; 
  height: 95%;
  margin: 20px 35px; 
  background-color: #fafafb; } 
.homeImg { 
  position: absolute; 
  width: 20%; 
  float: left; 
  left: -30px; 
  bottom: 2575px; } 
.homeTitleC { 
  position: absolute; 
  float: left; 
  width: 80%; 
  left: 200px; 
  top: 63px; 
  z-index: 2; } 
.homeTitleE { 
  position: absolute; 
  float: left; 
  width: 70%; 
  left: 290px; 
  top: 175px; 
  z-index: 2; } 
.table-container { 
  position: absolute; 
  width: 50%; 
  background-color: #f0f0f0; /* 灰色框 */ 
  /* padding: 25px;  */
  top: 220px; 
  height:400px;
  /* left: 10px;  */

  position: relative;
  /* width: 100%; */
  background-color: #f9f9f9;
  padding: 5px;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* Prevent overflow */
} 
.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.5s; } 
.fade-enter, .fade-leave-to { 
  opacity: 0; } 
.efficiency-tables { 
  /* display: flex; 
  flex-direction: column; 
  align-items: left; 
  width: 100%; 
  padding: 10px;  */
  display: flex;
  justify-content: center;
  align-items: center;
} 
.table-row { 
  display: flex; 
  justify-content: space-between; 
  width: 100%; } 
.table-container.single-table { 
  width: 105%; /* 单独表格宽度 */
top:20px; 

} 
.single-table { 
  width: 100%; /* 单独表格宽度 */
  left:-5px;
top:200px; 


}
.table-container h2 { 
    margin-bottom: 15px; 
    color: #000000; 
    text-align: left; 
    font-size: 4px; } 

.efficiency-table { 
      width: 50%; 
      border-collapse: collapse; 
    height:1000px;
  } 

.efficiency-table th, .efficiency-table td { 
  border: 1px solid #ddd; 
  padding: 12px; 
  text-align: center; 
  font-size: 12px; } 
.efficiency-table th:not(gap-head), .efficiency-table td:not(gap-cell) { 
  border: 1px solid #ddd; } 
.gap-head, .gap-cell { 
width: 1%; 
background-color: white !important; 
border: none !important; 
padding: 12%; } 
.efficiency-table th { 
  background-color: #f9f9f9;
  color: black; } 
.row-odd { 
  background-color: #fff; } 
.row-even { 
  background-color: #f9f9f9; } 
h1 { margin-bottom: 20px; 
  color: #333; 
  text-align: center; 
  font-size: 16px; } 
.text-red { 
  color: red; } 
.text-black { 
    color: black; } 

.cracker-table {
  width: 100%;
}
/* .turbine-table {
  width: 70%;
} */
/* .distillation-table {
  width: 50%;
} */

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background-color: #ddd;
  cursor: pointer;
  /* display:flex; */
}
.progress {
  height: 100%;
  background-color: #4CAF50;
  width: 0%; 
  transition: width 0.5s ease-in-out;
}
.progress-bar {
  width: 100%; /* 确保进度条容器占满整个宽度 */
  cursor: pointer; /* 当鼠标悬停时显示指针手势 */
  height: 20px;
}

.el-progress-bar {
  margin-bottom: 10px; /* 为进度条添加一些间距 */
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #f0f0f0;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #f0f0f0;

}

.carousel-container {
  position: absolute;
  top: 300px; /* 根据需要向下移动 */
  left: 0%;
  transform: translateX(0%);
  width: 49.7%; /* 设置宽度为页面的50% */
  background-color: #f0f0f0;
  padding: 3px;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* 防止内容溢出 */
  height:330px;

}


/* 走马灯指示器激活时的样式 */
.el-carousel__indicator.is-active button {
  background-color: #409EFF; /* 设置激活状态的指示器点的背景颜色 */
}

::v-deep .el-carousel__indicators .el-carousel__indicator button {
  background-color: black; /* 指示器点的默认背景颜色 */
  width: 40px; /* 指示器的宽度 */
  height: 2.5px; /* 指示器的高度 */
  /* border-radius: 6px;  */
}

/* 走马灯指示器的激活样式 */
::v-deep .el-carousel__indicators .el-carousel__indicator.is-active button {
  background-color: rgb(120, 172, 181); /* 激活状态的指示器点的背景颜色 */
}

/* 鼠标悬停在指示器上时的样式 */
::v-deep .el-carousel__indicators:hover .el-carousel__indicator button {
  background-color: rgb(120, 172, 181); /* 鼠标悬停时的指示器点的背景颜色 */
}

.efficiency-table {
  table-layout: auto;
  width: 100%; /* 确保表格占满容器的宽度 */
  height:100%;
}

.efficiency-table th,
.efficiency-table td {
  min-width: 85px; /* 设置一个最小宽度，根据实际需要调整 */
  word-wrap: break-word; /* 防止内容溢出 */
 max-height:500px;
padding:7px 15px;
}

h2 {
text-align:center;
font-size:20px;
}

.efficiency-tables-container{
  display:flex;
  flex-direction:column;
  overflow-y:auto;
  height:100%;
}
.el-carousel {
  height:100%;
}
.el-carousel-item{
  display:flex;
  height:100%;
}

    </style>