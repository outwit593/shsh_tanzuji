<template>
    <div class="bg" ref="passBox" @click="onDouble">
      <!-- Top Box -->
      <section class="topBox" v-if="navKey == 1">
        <div class="topBox_left">
          {{ theTime }}
          <div class="hrBox"></div>
          <span>{{ theDate }} {{ theWeekday ? `星期${theWeekday}` : "" }}</span>
          <div class="flex3">
            <div
              @click="ontables(2)"
              :class="{ moren: true, xuanz: indexof == 1 }"
            >
              年
            </div>
            <div
              @click="ontables(3)"
              :class="{ moren: true, xuanz: indexof == 2 }"
            >
              月
            </div>
            <div
              @click="ontables(4)"
              :class="{ moren: true, xuanz: indexof == 3 }"
            >
              日
            </div>
          </div>
        </div>
        <div class="topBox_center"><span>新强联数字化能碳管理中心</span></div>
        <div class="topBox_right">
          <div
            class="topBox_right_item hoverCursorPointer"
            :class="{ topBox_right_item_active: indexsOF === index }"
            v-for="(item, index) in treeList"
            :key="index"
            @click="onChangeNavKey(item, index)"
          >
            {{ item.name }}
          </div>
          <img
          src="require('@/assets/404_images/dataBigScreen/img15.png')" alt=""
            class="fullScreenBtn hoverCursorPointer"
            @click="onFullPage"
          />
        </div>
      </section>
      
      <!-- Center Section -->
      <section class="center" v-if="navKey == 1">
        <!-- Total Energy -->
        <div class="center-top">
          <div class="center-bg">
            <div class="center-bgLeft">
              <div class="bgLeft-title">总能耗</div>
              <div class="bgLeft-text" v-if="TionEnergy != null">
                {{ TionEnergy.one.total ? TionEnergy.one.total.toFixed(2) : 0 }}
              </div>
              <div class="bgLeft-text" v-else>0t</div>
              <div class="bgLeft-text1">t折标煤</div>
            </div>
            <div class="center-bgright">
              <div>
                <div class="listBox4_item">
                  <img src="require('@/assets/404_images/dataBigScreen/img4.png')" class="listBox4_item_icon" alt="" />
                  <div>
                    <div class="listBox4_item_text2">电(t)折标煤</div>
                    <div class="listBox4_item_text" v-if="TionEnergy != null">
                      {{ TionEnergy.one.top.toFixed(2) }}
                    </div>
                    <div class="listBox4_item_text" v-else>0</div>
                  </div>
                </div>
                <div class="listBox4_item">
                  <img src="require('@/assets/404_images/dataBigScreen/img4.png')" class="listBox4_item_icon" alt="" />
                  <div>
                    <div class="listBox4_item_text2">天然气(t折标煤)</div>
                    <div class="listBox4_item_text" v-if="TionEnergy != null">
                      {{ TionEnergy.one.bottom.toFixed(2) }}
                    </div>
                    <div class="listBox4_item_text" v-else>0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Carbon Emission -->
        <div class="center-top">
          <div class="center-bg">
            <div class="center-bgLeft">
              <div class="bgLeft-title">碳排放</div>
              <div class="bgLeft-text" v-if="TionEnergy != null">
                {{ TionEnergy.two.total.toFixed(2) }}
              </div>
              <div class="bgLeft-text" v-else>0</div>
              <div class="bgLeft-text1">(tCO2)</div>
            </div>
            <div class="center-bgright">
              <div>
                <div v-for="item in 4" :key="item">
                  <div class="listBox4_item">
                    <img src="require('@/assets/404_images/dataBigScreen/img4.png')" class="listBox4_item_icon" alt="" />
                    <div>
                      <div class="listBox4_item_text2">电(tCO2)</div>
                      <div class="listBox4_item_text" v-if="TionEnergy != null">
                        {{ TionEnergy.two.top.toFixed(2) }}
                      </div>
                      <div class="listBox4_item_text" v-else>0</div>
                    </div>
                  </div>
                  <div class="listBox4_item">
                    <img src="require('@/assets/404_images/dataBigScreen/img4.png')" class="listBox4_item_icon" alt="" />
                    <div>
                      <div class="listBox4_item_text2">天然气(tCO2)</div>
                      <div class="listBox4_item_text" v-if="TionEnergy != null">
                        {{ TionEnergy.two.bottom.toFixed(2) }}
                      </div>
                      <div class="listBox4_item_text" v-else>0</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Carbon Footprint -->
        <div class="center-top">
          <div class="center-bg">
            <div class="center-bgLeft">
              <div class="bgLeft-title">碳足迹</div>
              <div class="bgLeft-text" v-if="TionEnergy != null">
                {{ TionEnergy.three.total.toFixed(2) }}
              </div>
              <div class="bgLeft-text" v-else>0</div>
              <div class="bgLeft-text1">(tCO2/t)</div>
            </div>
            <div class="center-bgright">
              <div>
                <div v-for="item in 4" :key="item">
                  <div class="listBox4_item">
                    <img src="require('@/assets/404_images/dataBigScreen/img4.png')" class="listBox4_item_icon" alt="" />
                    <div>
                      <div class="listBox4_item_text2">电(tCO2/t)</div>
                      <div class="listBox4_item_text" v-if="TionEnergy != null">
                        {{ TionEnergy.three.top.toFixed(2) }}
                      </div>
                      <div class="listBox4_item_text" v-else>0</div>
                    </div>
                  </div>
                  <div class="listBox4_item">
                    <img src="require('@/assets/404_images/dataBigScreen/img4.png')" class="listBox4_item_icon" alt="404 Image" />
                    <div>
                      <div class="listBox4_item_text2">天然气(tCO2/t)</div>
                      <div class="listBox4_item_text" v-if="TionEnergy != null">
                        {{ TionEnergy.three.bottom.toFixed(2) }}
                      </div>
                      <div class="listBox4_item_text" v-else>0</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Annual CO2 Emission -->
        <div class="center-top">
          <div class="center-bg">
            <div class="center-bgLeft">
              <div class="bgLeft-title">年累计CO2排放</div>
              <div class="bgLeft-text" v-if="TionEnergy != null">
                {{ TionEnergy.four.total.toFixed(2) }}
              </div>
              <div class="bgLeft-text" v-else>0</div>
              <div class="bgLeft-text1">(tCO2)</div>
            </div>
            <div class="center-bgright">
              <div>
                <div v-for="item in 4" :key="item">
                  <div class="listBox4_item">
                    <img src="require('@/assets/404_images/dataBigScreen/img4.png')" class="listBox4_item_icon" alt="404 Image" />
                    <div>
                      <div class="listBox4_item_text2">能耗(tCO2)</div>
                      <div class="listBox4_item_text" v-if="TionEnergy != null">
                        {{ TionEnergy.four.top.toFixed(2) }}
                      </div>
                      <div class="listBox4_item_text" v-else>0</div>
                    </div>
                  </div>
                  <div class="listBox4_item">
                    <img src="require('@/assets/404_images/dataBigScreen/img4.png')" class="listBox4_item_icon" alt="" />
                    <div>
                      <div class="listBox4_item_text2">其他(tCO2)</div>
                      <div class="listBox4_item_text" v-if="TionEnergy != null">
                        {{ TionEnergy.four.bottom.toFixed(2) }}
                      </div>
                      <div class="listBox4_item_text" v-else>0</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Pie Chart Section -->
      <div v-if="navKey == 2" class="pie-chart-container">
        <div class="pie-chart-row">
          <div class="pie-chart-item" v-for="(item, index) in pieData" :key="index">
            <div class="pie-chart-title">{{ item.title }}</div>
            <div id="pieChart" ref="pieChart" style="width: 400px; height: 300px;"></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {
    data() {
      return {
        navKey: 1,
        indexof: 1,
        TionEnergy: null,
        pieData: [], // Assume this contains data for pie charts
        theTime: '',
        theDate: '',
        theWeekday: '',
        treeList: []
      };
    },
    methods: {
      onChangeNavKey(item, index) {
        this.navKey = 1;
        this.indexof = index;
      },
      onDouble() {
        // Handle double click event
      },
      onFullPage() {
        // Handle full page toggle
      },
      ontables(type) {
        this.indexof = type;
        // Logic to update `TionEnergy` based on the selected type
      },
      drawPieCharts() {
        this.pieData.forEach((data, index) => {
          const chart = echarts.init(this.$refs.pieChart[index]);
          const option = {
            title: {
              text: data.title,
              subtext: data.subtitle,
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: data.legend
            },
            series: [
              {
                name: data.name,
                type: 'pie',
                radius: '50%',
                data: data.seriesData
              }
            ]
          };
          chart.setOption(option);
        });
      }
    },
    watch: {
      pieData(newVal) {
        this.$nextTick(() => {
          this.drawPieCharts();
        });
      }
    },
    mounted() {
      // Initialization code here
    }
  };
  </script>
  
  <style scoped>
  .bg {
    background-color: #f5f5f5;
    padding: 20px;
  }
  .topBox {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #fff;
  }
  .center {
    display: flex;
    flex-direction: column;
    padding: 20px;
  }
  .center-top {
    margin-bottom: 20px;
  }
  .pie-chart-container {
    display: flex;
    flex-direction: column;
  }
  .pie-chart-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .pie-chart-item {
    flex: 1;
    min-width: 300px;
    max-width: 400px;
  }
  </style>
  