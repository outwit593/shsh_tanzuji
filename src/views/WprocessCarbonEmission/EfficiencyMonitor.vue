<template>
  <div class="scroll-container" style="overflow-y: auto">
    <div v-if="currentPage === 'ethyleneANDpropylene'">
      <div class="monitor">
        <p style="font-size: 30px">乙烯+丙烯装置碳效率监控</p>
        <el-select
          v-model="selectedPage"
          placeholder="请选择页面"
          @change="handlePageChange"
          style="
            width: 300px;
            height: 40px;
            font-size: 30px;
            position: fixed;
            left: 450px;
            bottom: 20px;
          "
        >
          <el-option label="乙烯装置碳效率监控" value="ethylene"></el-option>
          <el-option label="乙烯+丙烯装置碳效率监控" value="ethyleneANDpropylene"></el-option>
        </el-select>
        <!-- 其他内容... -->
        <!-- 添加选择散点数量的输入框和按钮 -->
        <div class="scatter-selection">
          <label for="scatterCount">选择或输入散点数量:</label>

          <!-- el-input 和 el-select 结合实现下拉选择或输入 -->
          <el-input
            v-model="limitInput"
            placeholder="请输入散点数量"
            style="width: 200px; margin-right: 10px"
            @input="handleInputChange"
          >
            <el-select
              v-model="limitInput"
              slot="prepend"
              placeholder="选择数量"
              @change="handleSelectChange"
            >
              <el-option
                v-for="n in [10, 20, 30, 40, 50]"
                :key="n"
                :label="n"
                :value="n"
              />
            </el-select>
          </el-input>

          <!-- 确定按钮 -->
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </div>
        <!-- 置信椭圆加散点图 -->
        <div class="ellipse-div">
          <svg
            width="710"
            height="440"
            id="scatterPlot"
            
          >
          <rect
            x="15"
            y="15"
            width="680"
            height="400"
            stroke="#ccc" 
            fill="#f9f9f9" 
            stroke-width="1" 
            rx="8" 
            ry="8" 
            filter="url(#shadow)" 
            ></rect>
            <!-- 定义阴影效果 -->
            <defs>
              <filter id="shadow" x="0" y="0" width="200%" height="200%">
                <feOffset result="offOut" in="SourceAlpha" dx="2" dy="2" />
                <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3" />
                <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
              </filter>
            </defs>
            <!-- 图片作为背景 -->
            <image
              href="./ellipse.png"
              x="50"
              y="0"
              width="500"
              height="400"
            />
            <!-- 使用 v-for 循环绘制散点 -->
            <circle
              v-for="(point, index) in ethyleneANDpropylene_coordinate_points"
              :key="index"
              :cx="calculateCx(point.x)"
              :cy="calculateCy(point.x,point.y)"
              r="5"
              :fill="index === newestPointIndex ? 'red' : 'blue'"
            >
              <!-- 添加 title 元素来显示坐标 -->
              <title>X: {{ point.x }}, Y: {{ point.y }}</title>
            </circle>
            <label for="scatterCount">选择散点数量:</label>

            <!-- 数据点图例 -->
            <!-- 红色当前点示例 -->
            <circle cx="660" cy="375" r="5" fill="red" />
            <!-- 蓝色历史点示例 -->
            <circle cx="660" cy="395" r="5" fill="blue" />
            <text x="590" y="380" font-size="14" fill="black">当前数据</text>
            <text x="590" y="400" font-size="14" fill="black">历史数据</text>
            <!-- 色阶图例 -->

            <!-- 色阶图例 -->
            <defs>
              <linearGradient
                id="gradientLegend"
                x1="0%"
                y1="20%"
                x2="0%"
                y2="80%"
              >
                <stop
                  offset="0%"
                  style="stop-color: rgb(0, 255, 0); stop-opacity: 1"
                />
                <stop
                  offset="100%"
                  style="stop-color: rgb(255, 0, 0); stop-opacity: 1"
                />
              </linearGradient>
            </defs>
            <rect
              x="640"
              y="40"
              width="20"
              height="300"
              fill="url(#gradientLegend)"
            />
            <!-- 色阶图例数值文本 -->
            <text x="640" y="40" font-size="10" fill="black">1</text>
            <text x="640" y="350" font-size="10" fill="black">2</text>
            <!-- <text x="100" y="600" font-size="10" fill="black">200</text> -->
          </svg>
        </div>

        <!-- 其他内容... -->

        <!-- 表单 -->
        <!-- 表格容器 -->
        <div class="data-table-container">
          <el-switch
            v-model="NewAreaSwitch"
            active-text="显示新区数据"
            inactive-text="关闭新区显示"
            @change="toggleTableData"
          >
          </el-switch>
          <el-table
            :data="ethyleneANDpropylene_process_data"
            :border="true"
            style="width: 100%; border: 1px solid #ebeef5"
          >
            <!-- el-table-column 内容 -->
            <el-table-column type="index" :index="indexMethod">
            </el-table-column>
            <el-table-column
              prop="processVariable"
              label="过程变量"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="value"
              label="数值"
              width="120"
              :formatter="formatNumber"
            >
            </el-table-column>
            <el-table-column prop="unit" label="单位" width="120">
            </el-table-column>
          </el-table>
        </div>
        <div class="ethyleneANDpropylene_carbonIntensity">
          <el-table
            :data="ethyleneANDpropylene_carbon_intensity_data"
            :border="true"
            style="width: 100%; border: 1px solid #ebeef5"
          >
            <!-- el-table-column 内容 -->
            <el-table-column
              prop="carbon_intensity"
              label="碳强度"
              width="90"
              :formatter="formatNumber"
            ></el-table-column>
            <el-table-column
              prop="unit"
              label="单位"
              width="170"
            ></el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 其他按钮... -->
    <!-- 使用 v-if 或 v-show 控制页面的显示 -->
    <div v-if="currentPage === 'ethylene'">
      <div class="monitor">
        <p style="font-size: 30px">乙烯装置碳效率监控</p>
        <el-select
          v-model="selectedPage"
          placeholder="请选择页面"
          @change="handlePageChange"
          style="
            width: 300px;
            height: 40px;
            font-size: 16px;
            position: fixed;
            left: 450px;
            bottom: 20px;
          "
        >
          <el-option label="乙烯装置碳效率监控" value="ethylene"></el-option>
          <el-option label="乙烯+丙烯装置碳效率监控" value="ethyleneANDpropylene"></el-option>
        </el-select>
        <!-- 其他内容... -->
        <!-- 添加选择散点数量的输入框和按钮 -->
        <div class="scatter-selection">
          <label for="scatterCount">选择或输入散点数量:</label>

          <!-- el-input 和 el-select 结合实现下拉选择或输入 -->
          <el-input
            v-model="limitInput"
            placeholder="请输入散点数量"
            style="width: 200px; margin-right: 10px"
            @input="handleInputChange"
          >
            <el-select
              v-model="limitInput"
              slot="prepend"
              placeholder="选择数量"
              @change="handleSelectChange"
            >
              <el-option
                v-for="n in [10, 20, 30, 40, 50]"
                :key="n"
                :label="n"
                :value="n"
              />
            </el-select>
          </el-input>

          <!-- 确定按钮 -->
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </div>

        <!-- 置信椭圆加散点图 -->
        <div class="ellipse-div">
          <svg
            width="710"
            height="440"
            id="scatterPlot"
            
          >
          <rect
            x="15"
            y="15"
            width="680"
            height="400"
            stroke="#ccc" 
            fill="#f9f9f9" 
            stroke-width="1" 
            rx="8" 
            ry="8" 
            filter="url(#shadow)" 
            ></rect>
            <!-- 定义阴影效果 -->
            <defs>
              <filter id="shadow" x="0" y="0" width="200%" height="200%">
                <feOffset result="offOut" in="SourceAlpha" dx="2" dy="2" />
                <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3" />
                <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
              </filter>
            </defs>
            <!-- 图片作为背景 -->
            <image
              href="./ellipse.png"
              x="50"
              y="0"
              width="500"
              height="400"
            >
            
            </image>
            <!-- 使用 v-for 循环绘制散点 -->
            <circle
              v-for="(point, index) in ethylene_coordinate_points"
              :key="index"
              :cx="calculateCx(point.x)"
              :cy="calculateCy(point.x,point.y)"
              r="5"
              :fill="index === newestPointIndex ? 'red' : 'blue'"
            >
              <!-- 添加 title 元素来显示坐标 -->
              <title>X: {{ point.x }}, Y: {{ point.y }}</title>
            </circle>
            <label for="scatterCount">选择散点数量:</label>

            <!-- 数据点图例 -->
            <!-- 红色当前点示例 -->
            <circle cx="660" cy="375" r="5" fill="red" />
            <!-- 蓝色历史点示例 -->
            <circle cx="660" cy="395" r="5" fill="blue" />
            <text x="590" y="380" font-size="14" fill="black">当前数据</text>
            <text x="590" y="400" font-size="14" fill="black">历史数据</text>
            <!-- 色阶图例 -->

            <!-- 色阶图例 -->
            <defs>
              <linearGradient
                id="gradientLegend"
                x1="0%"
                y1="20%"
                x2="0%"
                y2="80%"
              >
                <stop
                  offset="0%"
                  style="stop-color: rgb(0, 255, 0); stop-opacity: 1"
                />
                <stop
                  offset="100%"
                  style="stop-color: rgb(255, 0, 0); stop-opacity: 1"
                />
              </linearGradient>
            </defs>
            <rect
              x="640"
              y="40"
              width="20"
              height="300"
              fill="url(#gradientLegend)"
            />
            <!-- 色阶图例数值文本 -->
            <text x="640" y="40" font-size="10" fill="black">1.5</text>
            <text x="640" y="350" font-size="10" fill="black">3.5</text>
            <!-- <text x="100" y="600" font-size="10" fill="black">200</text> -->
          </svg>
        </div>

        <!-- 其他内容... -->

        <!-- 表单 -->
        <!-- 表格容器 -->
        <div class="data-table-container">
          <!-- 开关 -->
          <el-switch
            v-model="NewAreaSwitch"
            active-text="显示新区数据"
            inactive-text="关闭新区显示"
            @change="toggleTableData"
          >
          </el-switch>
          <el-table
            :data="ethylene_process_data"
            :border="true"
            style="width: 100%; border: 1px solid #ebeef5"
          >
            <!-- el-table-column 内容 -->
            <el-table-column type="index" :index="indexMethod">
            </el-table-column>
            <el-table-column
              prop="processVariable"
              label="过程变量"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="value"
              label="数值"
              width="120"
              :formatter="formatNumber"
            >
            </el-table-column>
            <el-table-column prop="unit" label="单位" width="120">
            </el-table-column>
          </el-table>
        </div>
        <div class="ethylene_carbonIntensity">
          <el-table
            :data="ethylene_carbon_intensity_data"
            :border="true"
            style="width: 100%; border: 1px solid #ebeef5"
          >
            <!-- el-table-column 内容 -->
            <el-table-column
              prop="carbon_intensity"
              label="碳强度"
              width="90"
              :formatter="formatNumber"
            ></el-table-column>
            <el-table-column
              prop="unit"
              label="单位"
              width="95"
            ></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      NewAreaSwitch: true,
      selectedPage: "", // 下拉框选择的页面
      currentPage: "ethylene", // 控制当前页面显示
      limit: 20, // 默认为20个点
      limitInput: 20, // 用户输入或选择的值

      // 表单信息
      ethylene_process_data: [],
      ethylene_carbon_intensity_data: [],
      // 定义数据点数组，您可以根据需要动态添加或修改数据点
      ethylene_coordinate_points: [
        //测试用点
        //{   "x": -2,
       // "y": -1},
        //{   "x": 0,
        //"y": 0},
        //{   "x": 2.2,
       // "y": 0.4},
        //{   "x": 0.7,
        //"y": 0.6},
        //{   "x": -4.03,
       // "y": 0},
        //{   "x": 0.9,
        //"y": 1.1},
        //{   "x": -2.7,
        //"y": 0.3},
        //{   "x": -0.8,
        //"y": -0.3},
        //{   "x": 2.2,
        //"y": -2.8},
       // {   "x": 2.1,
        //"y": 0.2},
        //{   "x": 2,
        //"y": -1.2},
        //{   "x": 2,
        //"y": -1.2},
        //{   "x": 2,
        //"y": -1.2},
        //{   "x": 2,
        //"y": -1.2},
        //{   "x": 2,
        //"y": -1.1},{   "x": 2.1,
        //"y": -1.3},{   "x": -2.1,
        //"y": -0.8},{   "x": 2.2,
        //"y": -1.2},{   "x": 3.2,
        //"y": -1.7},{   "x": 2.6,
        //"y": -1.4},
        
      ],
      ethyleneANDpropylene_process_data:[],
      ethyleneANDpropylene_carbon_intensity_data:[],
      ethyleneANDpropylene_coordinate_points:[],
      unitMapping: {
        燃料气流量: "Nm³/h",
        进料总量: "Kg/h",
        锅炉给水流量: "t/h",
        外购SS流量: "t/h",
        冷凝水流量: "t/h",
        外供HS流量: "t/h",
        乙烯产量: "t/h",
        GT2601HS流量: "t/h", // 例子，可能需要修改
        丙烯塔再沸器流量: "t/h", // 例子，可能需要修改
        乙烯塔塔压: "Mpa",
        "1号炉COT": "°C",
        "2号炉COT": "°C",
        "3号炉COT": "°C",
        "4号炉COT": "°C",
        "2号炉炉膛负压": "Pa",
        "3号炉炉膛负压": "Pa",
        乙烯碳强度: "tCO₂/tC₂H₄",
        乙烯加丙烯碳强度:"tCO₂/t(C₂H₄ + C₃H₆)",
        乙烯加丙烯产量: "t/h",
      },
      intervalId: null, //用于setInterval的ID，以便清除
      newestPointIndex: -1, // 用来记录最新点的索引
    };
  },
  mounted() {
    this.fetchData();
    this.startInterval(); // 开始定时请求
  },
  beforeDestroy() {
    clearInterval(this.intervalId); // 清除定时器
    if (this.websocket) {
      this.websocket.close();
    } // 关闭WebSocket连接
  },
  methods: {
    // 处理下拉框页面选择的变化
    handlePageChange(value) {
      this.currentPage = value;
    },

    // 表单索引
    indexMethod(index) {
      return index + 1;
    },
    // 响应下拉框选择
    handleSelectChange() {
      this.limitInput = parseInt(this.limitInput);
    },
    // 响应输入框输入
    handleInputChange() {
      this.limitInput = parseInt(this.limitInput);
    },
    // 点击确定按钮时，更新数据
    handleConfirm() {
      this.limit = this.limitInput; // 更新 limit 值
      this.fetchData(); // 重新获取数据
    },
    toggleTableData() {
      this.limit = this.limitInput; // 更新 limit 值
      this.fetchData();
      if (this.NewAreaSwitch) {
        // 恢复表单数据
        this.fetchData(); // 重新获取数据
      } else {
        // 将所有 value 设置为 0
        this.ethylene_process_data = this.ethylene_process_data.map((item) => ({
          ...item,
          value: 0,
        }));
        this.ethylene_carbon_intensity_data = this.ethylene_carbon_intensity_data.map((item) => ({
          ...item,
          carbon_intensity: 0,
        }));
        this.ethylene_coordinate_points = [];
      }
    },

    fetchData() {
      axios
        .get("`https://172.160.11.205:443/process-data", {  
          params: 
          { limit: this.limit,
            newAreaSwitch: this.NewAreaSwitch // 将开关状态传递给后端
          },
        })
        .then((response) => {
          // 检查返回的数据是否为数组
          if (response.data && typeof response.data === "object") {
            const targetVariables = [
              "燃料气流量",
              "进料总量",
              "锅炉给水流量",
              "外购SS流量",
              "冷凝水流量",
              "外供HS流量",
              "乙烯产量",
              "乙烯加丙烯产量"
            ];
              // 转换角度为弧度。调整整体角度
            const theta1 = 0 * Math.PI / 180;  // 100度转换为弧度
            const cosTheta1 = Math.cos(theta1);
            const sinTheta1 = Math.sin(theta1);

            // 定义旋转函数
            const rotatePoint1 = (point) => {
              const x1 = point.x;
              const y1 = point.y;
              const xPrime = cosTheta1 * x1 + sinTheta1 * y1;
              const yPrime = -sinTheta1 * x1 + cosTheta1 * y1;
              return { x: xPrime, y: yPrime };
            };
            const theta2 = 0 * Math.PI / 180;  // 100度转换为弧度
            const cosTheta2 = Math.cos(theta2);
            const sinTheta2 = Math.sin(theta2);

            // 定义旋转函数
            const rotatePoint2 = (point) => {
              const x2 = point.x;
              const y2 = point.y;
              const xPrime = cosTheta2 * x2 + sinTheta2 * y2;
              const yPrime = -sinTheta2 * x2 + cosTheta2 * y2;
              return { x: xPrime, y: yPrime };
            };
            //乙烯页面的
            this.ethylene_process_data = response.data.ethylene_process_data
              .filter((item) => targetVariables.includes(item.processVariable)) // 筛选出目标变量的项
              .map((item) => {
                // 为每个 processVariable 查找并添加单位
                const unit = this.unitMapping[item.processVariable] || ""; // 查找单位，如果没有则为空
                return {
                  ...item,
                  unit: unit, // 将单位添加到每个对象中
                };
              });
            this.ethylene_carbon_intensity_data = response.data.ethylene_carbon_intensity_data.map(
              (item) => {
                // 为每个 processVariable 查找并添加单位
                const unit = this.unitMapping["乙烯碳强度"] || ""; // 查找单位，如果没有则为空
                return {
                  ...item,
                  unit: unit, // 将单位添加到每个对象中
                };
              }
            );

            // this.ethylene_coordinate_points = response.data.ethylene_coordinate_points;
            // 获取以太烯坐标点并进行旋转
            this.ethylene_coordinate_points = response.data.ethylene_coordinate_points.map(point => rotatePoint1(point));

            // 保证第一个点是最新点
            if (this.ethylene_coordinate_points.length > 0) {
              this.newestPointIndex = this.ethylene_coordinate_points.length - 1; // 最后一个点设为最新点
            }
            //乙烯加丙烯页面的
            this.ethyleneANDpropylene_process_data = response.data.ethyleneANDpropylene_process_data
              .filter((item) => targetVariables.includes(item.processVariable)) // 筛选出目标变量的项
              .map((item) => {
                // 为每个 processVariable 查找并添加单位
                const unit = this.unitMapping[item.processVariable] || ""; // 查找单位，如果没有则为空
                return {
                  ...item,
                  unit: unit, // 将单位添加到每个对象中
                };
              });
            this.ethyleneANDpropylene_carbon_intensity_data = response.data.ethyleneANDpropylene_carbon_intensity_data.map(
              (item) => {
                // 为每个 processVariable 查找并添加单位
                const unit = this.unitMapping["乙烯加丙烯碳强度"] || ""; // 查找单位，如果没有则为空
                return {
                  ...item,
                  unit: unit, // 将单位添加到每个对象中
                };
              }
            );
            this.ethyleneANDpropylene_coordinate_points = response.data.ethyleneANDpropylene_coordinate_points.map(point => rotatePoint2(point));
            // this.ethyleneANDpropylene_coordinate_points = response.data.ethyleneANDpropylene_coordinate_points;

            // 保证第一个点是最新点
            if (this.ethyleneANDpropylene_coordinate_points.length > 0) {
              this.newestPointIndex = this.ethyleneANDpropylene_coordinate_points.length - 1; // 最后一个点设为最新点
            }



          } else {
            console.error("返回的数据不是一个对象或者响应数据格式不正确");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    // 根据提供的比例计算 cx 坐标
    calculateCx(x) {
      const a = 4.033;
      const scaledX = 300 + x * (250/ a);
      return Math.max(50, Math.min(scaledX, 550));
    },

    // 根据提供的比例计算 cy 坐标
    calculateCy(x,y) {
      const a = 4.03; // x 轴长度
      const b = 4.18;
      //绘制未出界的点Y坐标
      const scaledY = 200 - y * (150 / b);
      //在圆的基础上由已知x得到正y
      const adjustedX = (x > a) ? a : (x < -a) ? -a : x;

      const PositiveY = b * Math.sqrt(1 - Math.pow(adjustedX / a, 2));
      const miny = PositiveY;
      const maxy = -PositiveY;
      const minY = 200 - miny * (150 / b);
      const maxY = 200 - maxy * (150 / b);

      return Math.max(minY, Math.min(scaledY, maxY));
    },
    startInterval() {
      // 设置定时请求，例如每10秒请求一次
      this.intervalId = setInterval(this.fetchData, 10000);
    },
    //限制保留两位小数
    formatNumber(row, column, cellValue) {
      if (cellValue !== null && cellValue !== "") {
        return cellValue.toFixed(2);
      } else {
        return cellValue;
      }
    },
  },
};
</script>

<style scoped>
.monitor {
  background-color: #fff;
  padding: 20px;
  text-align: center;
  color: #000;
  font-size: 1.5em;
  position: relative;
}
.ellipse-div {
  width: 800px; /* div图片的固定宽度 */
  height: 550px; /* div图片的固定高度 */
  /* margin: auto; 使用 auto 边距实现水平居中 */
  transform: translateX(10px) translateY(50px); 
}
/* 新增表格样式 */
.data-table-container {
  position: absolute;
  top: 190px; /* 与顶部的间隔 */
  right: 50px; /* 与右侧的间隔 */
  width: 410px;
  height: 10px; /* 表格宽度，可以根据需要调整 */
  transform: scale(1); /* 缩小到80% */
  font-size: 1.2em; /* 缩小字体大小 */
}
.ethylene_carbonIntensity {
  position: absolute;
  top: 70px; /* 与顶部的间隔 */
  right: 250px; /* 与右侧的间隔 */
  width: 186.6px; /* 表格宽度，可以根据需要调整 */
  font-size: 1.5em; /* 缩小字体大小 */
  transform: scale(1.2); /* 缩小到80% */
}
.ethyleneANDpropylene_carbonIntensity {
  position: absolute;
  top: 70px; /* 与顶部的间隔 */
  right: 174.6px; /* 与右侧的间隔 */
  width: 262px; /* 表格宽度，可以根据需要调整 */
  font-size: 1.5em; /* 缩小字体大小 */
  transform: scale(1.2); /* 缩小到80% */
}

/* 将 scatter-selection 定位到页面右下角 */
.scatter-selection {
  position: fixed;
  right: 50px; /* 调整距离右侧的距离 */
  bottom: 0px; /* 调整距离底部的距离 */
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  margin-bottom: 20px;
  font-size: 0.8em; /* 放大字体大小 */
  color: #000; /* 标准黑色 */
  transform: scale(1); /* 整体缩小80% */
}

.scatter-selection label {
  margin-right: 10px; /* 调整标签与下拉框之间的间距 */
}

/* 页面标题的样式，加粗字体 */
.page-title {
  font-size: 1.8em; /* 调整字体大小 */
  margin: 20px 0; /* 设置上下边距 */
  color: #333; /* 标准文本颜色 */
  text-align: center; /* 居中显示 */
}
</style>