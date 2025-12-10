<template>
  <div class="CarbonLabelnew">
    <div class="CL-option">
      <p class="CarbonLabelTitle">{{ name }}</p>
      <div class="Options">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <p class="CL-title">产品流程图</p>
    </div>
    <div v-if="showFlowchart" class="CL-optionimg">
      <!-- jsPlumb流程图容器 -->
      <div id="jsplumb-container" style="width: 100%; height: 100%;"></div>
    </div>
  </div>
</template>


<script>
import { jsPlumb } from 'jsplumb';
import axios from 'axios';

export default {
  data() {
    return {
      name: '主要产品碳排放',
      options: [
        { value: 'ethylene', label: '乙烯' },
        { value: 'propylene', label: '丙烯' },
        { value: 'butadiene', label: '丁二烯' },
        { value: 'benzene', label: '苯' }
      ],
      showFlowchart: false,
      value: ''
    };
  },
  methods: {
    showData() {
      if (this.value === 'ethylene') {
        this.showFlowchart = true;
        this.$nextTick(() => {
          // 渲染流程图
          this.renderFlowchart();
        });
      } else {
        this.showFlowchart = false;
      }
    },
    renderFlowchart() {
      const instance = jsPlumb.getInstance({
        container: 'jsplumb-container'
      });
      instance.ready(() => {
        // 清除旧的绘制
        instance.reset();

        // 定义一些样式
        const common = {
          connector: ['Bezier', { curviness: 60 }], // 使用Bezier连接器，增加弯曲度
          // 例如，使用具体的位置百分比作为锚点
          anchors: [
            [1, 0.5, 0, 0], // 源节点的右侧中点
            [0, 0.5, 0, 0]  // 目标节点的左侧中点
          ], // 顶部到底部的连接可以减少连线交叉
          endpoint: ['Rectangle', { width: 10, height: 10 }], // 使用矩形端点
          paintStyle: { stroke: '#007bff', strokeWidth: 1, dashstyle: '4 2' }, // 蓝色虚线
          endpointStyle: { fill: '#007bff' }, // 端点填充颜色与连线一致
          overlays: [
            ['Arrow', { width: 12, length: 12, location: 1 }],
            //['Label', { label: "Action", location: 0.5, cssClass: 'connector-label' }] // 连接器中间添加文本标签
          ]
        };


        // 在流程图容器中动态添加节点
        const addEndpoint = (id, label, top, left) => {
          const el = document.createElement('div');
          el.id = id;
          el.style.position = 'absolute';
          el.style.top = `${top}px`;
          el.style.left = `${left}px`;
          el.style.border = '1px solid rgb(149, 55, 55)';
          el.style.padding = 'px';
          el.style.top = top + 'px';
          el.style.left = left + 'px';
          el.innerHTML = label;
          document.getElementById('jsplumb-container').appendChild(el);
          return el;
        };

        // 添加节点
        const st1 = addEndpoint('2#常减压装置', '2#常减压装置', 20, 100);
        const st2 = addEndpoint('3#常减压装置', '3#常减压装置', 100, 100);
        const op1 = addEndpoint('1#延迟焦化装置', '1#延迟焦化装置', 200, 100);
        const op2 = addEndpoint('2#延迟焦化装置', '2#延迟焦化装置', 300, 100);
        const op3 = addEndpoint('渣油加氢装置', '渣油加氢装置', 400, 100);
        const op4 = addEndpoint('2#催化裂化装置', '2#催化裂化装置', 500, 100);
        const op5 = addEndpoint('航煤脱硫醇装置', '煤脱硫醇装置', 20, 400);
        const en6 = addEndpoint('高压加氢裂化', '高压加氢裂化', 100, 400);
        const op7 = addEndpoint('中压加氢裂化', '中压加氢裂化', 200, 400);
        const op8 = addEndpoint('1#柴油加氢装置', '1#柴油加氢装置', 300, 400);
        const op9 = addEndpoint('加氢改制装置', '加氢改制装置', 400, 400);
        const op10 = addEndpoint('3#柴油加氢装置', '3#柴油加氢装置', 500, 400);
        const op11 = addEndpoint('催化双脱装置', '催化双脱装置', 600, 400);

        // 添加连接
        instance.connect({...common, source: '2#常减压装置', target: '1#延迟焦化装置'});
        instance.connect({...common, source: '3#常减压装置', target: '1#延迟焦化装置'});
        instance.connect({...common, source: '2#常减压装置', target: '2#延迟焦化装置'});
        instance.connect({...common, source: '3#常减压装置', target: '2#延迟焦化装置'});
        instance.connect({...common, source: '2#常减压装置', target: '渣油加氢装置'});
        instance.connect({...common, source: '3#常减压装置', target: '渣油加氢装置'});
        instance.connect({...common, source: '2#常减压装置', target: '2#催化裂化装置'});
        instance.connect({...common, source: '3#常减压装置', target: '2#催化裂化装置'});
        instance.connect({...common, source: '1#延迟焦化装置', target: '渣油加氢装置'});
        instance.connect({...common, source: '渣油加氢装置', target: '2#催化裂化装置'});
        instance.connect({...common, source: '2#催化裂化装置', target: '渣油加氢装置'});
        instance.connect({...common, source: '2#催化裂化装置', target: '1#延迟焦化装置'});
        instance.connect({...common, source: '2#催化裂化装置', target: '2#延迟焦化装置'});
      });
    },
    fetchData() {
      axios.get('http://127.0.0.1:5000/test')
        .then(response => {
          console.log(response.data); // 处理响应数据
        })
        .catch(error => {
          console.error("There was an error!", error);
        });
    },
    sendData() {
      const dataToSend = { key: '你好' }; // 替换为你要发送的数据
      axios.post('http://127.0.0.1:5000/test', dataToSend)
        .then(response => {
          console.log(response.data); // 处理响应数据
        })
        .catch(error => {
          console.error("There was an error!", error);
        });
    }

  },
  watch: {
    value(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.showData();
      }
    }
  },
  created() {
    this.sendData();
  }


};
</script>


<style lang="scss" scoped>

.table-container {
  margin-top: 20px; /* 调整表格与图片框之间的间距 */
}

.data-table {
  width: 90%; /* 表格宽度与图片框一致 */
  margin: 0 auto; /* 居中显示 */
  border-collapse: collapse; /* 边框重叠 */
}

.data-table th,
.data-table td {
  border: 1px solid #ccc; /* 表格边框样式 */
  padding: 8px; /* 单元格内边距 */
  text-align: center; /* 文字居中对齐 */
}

.CL-option {
  position: relative;
  width: 100%;
  height: 100px;
  margin: 50px;
}

.CarbonLabelTitle {
  position: absolute;
  top: 20px;
  left: 50px;
  float: left;
  width: auto;
  font-size: 20px;
}

.Options {
  position: absolute;
  float: left;
  width: 200px;
  left: 300px;
  top: 15px;
}

.CL-title {
  position: absolute;
  font-size: 25px;
  left: 500px;
  top: 100px;
  margin-bottom: 20px;
}

.CL-optionimg {
  position: relative;
  height: 650px;
  width: 90%;
  left: 50px;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

.img-container {
  width: fit-content; /* 设置容器宽度适合图片 */
  overflow-x: auto; /* 允许水平滚动 */
}

.dataOverlay {
  position: fixed;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  z-index: 9999; /* 确保覆盖其他元素 */
}

.flowchart-node {
  border: 1px solid rgb(149, 55, 55);
  padding: 10px
}

.connector-label {
  background-color: #fff;
  border: 1px solid #007bff;
  color: #007bff;
  font-size: 12px;
  padding: 2px;
}

</style>
