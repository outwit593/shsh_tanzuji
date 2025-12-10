<template>
    <div class="efficiency-tables">
      <!-- 标题 -->
      <h1>储运部关键用能设备能效监控</h1>
  
      <!-- 裂解炉表格容器 -->
      <div class="table-row">
        <!-- 第一个裂解炉表格 -->
        <div class="table-container">
          <h2>裂解炉</h2>
          <table class="efficiency-table">
            <thead>
              <tr>
                <th>设备编号</th>
                <th>排烟温度</th>
                <th>排烟氧含量</th>
                <th>热效率</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cracker, index) in crackers1" :key="cracker.id1" 
                  :class="`row-${index % 2 === 0 ? 'odd' : 'even'}`">
                <td>{{ cracker.id1 }}</td>
                <td>{{ cracker.temperature1 }}</td>
                <td>{{ cracker.oxygenContent1 }}</td>
                <td>{{ cracker.efficiency1 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 第二个裂解炉表格 -->
        <div class="table-container">
           <h2 style="height: 27px; line-height: 20px; vertical-align: middle;">&nbsp;</h2>
          <table class="efficiency-table">
            <thead>
              <tr>
                <th>设备编号</th>
                <th>排烟温度</th>
                <th>排烟氧含量</th>
                <th>热效率</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cracker, index) in crackers2" :key="cracker.id2" 
                  :class="`row-${index % 2 === 0 ? 'odd' : 'even'}`">
                <td>{{ cracker.id2 }}</td>
                <td>{{ cracker.temperature2 }}</td>
                <td>{{ cracker.oxygenContent2 }}</td>
                <td>{{ cracker.efficiency2 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- 汽轮机表格 -->
      <div class="table-container single-table">
        <h2>汽轮机</h2>
        <table class="efficiency-table">
          <thead>
            <tr>
              <th>设备编号</th>
              <th>进汽流量 (t/h)</th>
              <th>进汽压力 (MPa)</th>
              <th>进汽温度 (℃)</th>
              <th>抽气流量 (t/h)</th>
              <th>抽气压力 (Mpa)</th>
              <th>抽汽温度 (℃)</th>
              <th>排汽流量 (t/h)</th>
              <th>排气温度 (℃)</th>
              <th>排汽压力 (MPa)</th>
              <th>等熵效率1</th>
              <th>等熵效率2</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(turbine, index) in turbines" :key="turbine.id" 
                :class="`row-${index % 2 === 0 ? 'odd' : 'even'}`">
                <td>{{ turbine.id }}</td>
                                    <td>{{ turbine.steamFlowjin }}</td>
                                    <td>{{ turbine.steamPressurejin }}</td>
                                    <td>{{ turbine.steamTemperaturejin }}</td>
                                    <td>{{ turbine.steamFlowchou }}</td>
                                    <td>{{ turbine.steamPressurechou }}</td>
                                  <td>{{ turbine.steamTemperaturechou }}</td>
                                    <td>{{ turbine.steamFlowpai }}</td>
                                    <td>{{ turbine.steamPressurepai }}</td>
                                    <td>{{ turbine.steamTemperaturepai }}</td>
                                    <td>{{ turbine.Efficiency1 }}</td>
                                    <td>{{ turbine.Efficiency2 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- 精馏塔表格 -->
      <div class="table-container single-table">
        <h2>精馏塔</h2>
        <table class="efficiency-table">
          <thead>
            <tr>
               <th>设备编号</th>
                  <th>进料流量 (t/h)</th>
                  <th>进料温度 (℃)</th>
                  <th>重组份分子分率</th>
                                    <th>最小分离功 (J/mol)</th>
                                    <th>塔顶温度 (℃)</th>
                                    <th>塔釜温度 (℃)</th>
                                    <th>加热物流压力 (Mpa)</th>
                                    <th>加热物流入口温度 (℃)</th>
                                    <th>加热物流出口温度 (℃)</th>
                                    <th>加热物流流量 (t/h)</th>
                                    <th>吸收功</th>
                                    <th>热效率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(distillationColumn, index) in distillationColumns" :key="distillationColumn.id" 
                :class="`row-${index % 2 === 0 ? 'odd' : 'even'}`">
              <td>{{ distillationColumn.id }}</td>
                                    <td>{{ distillationColumn.jinF }}</td>
                                    <td>{{ distillationColumn.jinT }}</td>
                                    <td>{{ distillationColumn.zhongfen }}</td>
                                    <td>{{ distillationColumn.wmin }}</td>
                                    <td>{{ distillationColumn.tadinT }}</td>
                                    <td>{{ distillationColumn.tafuT }}</td>
                                    <td>{{ distillationColumn.wuliuP }}</td>
                                    <td>{{ distillationColumn.wuliuruT }}</td>
                                    <td>{{ distillationColumn.wuliuchuT }}</td>
                                    <td>{{ distillationColumn.wuliuf }}</td>
                                    <td>{{ distillationColumn.wn }}</td>
                                    <td>{{ distillationColumn.rexiaolv }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  
  <script>
  export default {
    name: 'EfficiencyMonitor',
    data() {
      return {
        // 这里是您的数据模型
          crackers1: [
                { id1: 'BA101', temperature1: '120℃', oxygenContent1: '5%', efficiency1: '85%' },
                { id1: 'BA103', temperature1: '125℃', oxygenContent1: '6%', efficiency1: '88%' },
                { id1: 'BA101', temperature1: '120℃', oxygenContent1: '5%', efficiency1: '85%' },
                { id1: 'BA103', temperature1: '125℃', oxygenContent1: '6%', efficiency1: '88%' },
                { id1: 'BA101', temperature1: '120℃', oxygenContent1: '5%', efficiency1: '85%' },
                { id1: 'BA103', temperature1: '125℃', oxygenContent1: '6%', efficiency1: '88%' },
                { id1: 'BA101', temperature1: '120℃', oxygenContent1: '5%', efficiency1: '85%' },
                { id1: 'BA103', temperature1: '125℃', oxygenContent1: '6%', efficiency1: '88%' },
                { id1: 'BA101', temperature1: '120℃', oxygenContent1: '5%', efficiency1: '85%' },
                { id1: 'BA103', temperature1: '125℃', oxygenContent1: '6%', efficiency1: '88%' }
                // 其他裂解炉数据...
              ],
              crackers2: [
                { id2: 'BA102', temperature2: '120℃', oxygenContent2: '5%', efficiency2: '85%' },
                { id2: 'BA104', temperature2: '125℃', oxygenContent2: '6%', efficiency2: '88%' },
              { id2: 'BA102', temperature2: '120℃', oxygenContent2: '5%', efficiency2: '85%' },
              { id2: 'BA104', temperature2: '125℃', oxygenContent2: '6%', efficiency2: '88%' },
              { id2: 'BA102', temperature2: '120℃', oxygenContent2: '5%', efficiency2: '85%' },
              { id2: 'BA104', temperature2: '125℃', oxygenContent2: '6%', efficiency2: '88%' },
              { id2: 'BA102', temperature2: '120℃', oxygenContent2: '5%', efficiency2: '85%' },
              { id2: 'BA104', temperature2: '125℃', oxygenContent2: '6%', efficiency2: '88%' },
              { id2: 'BA102', temperature2: '120℃', oxygenContent2: '5%', efficiency2: '85%' },
              { id2: 'BA104', temperature2: '125℃', oxygenContent2: '6%', efficiency2: '88%' }
                // 其他裂解炉数据...
              ],
              turbines: [
                { id: 'E-GT201', steamFlow: '50 t/h', steamPressure: '2.5 MPa', steamTemperature: '450℃', isentropicEfficiency2: '82%' },
                { id: 'E-GT501', steamFlow: '60 t/h', steamPressure: '3.0 MPa', steamTemperature: '500℃', isentropicEfficiency2: '85%' },
                { id: 'E-GT201', steamFlow: '50 t/h', steamPressure: '2.5 MPa', steamTemperature: '450℃', isentropicEfficiency2: '82%' },
                { id: 'E-GT501', steamFlow: '60 t/h', steamPressure: '3.0 MPa', steamTemperature: '500℃', isentropicEfficiency2: '85%' },
                { id: 'E-GT201', steamFlow: '50 t/h', steamPressure: '2.5 MPa', steamTemperature: '450℃', isentropicEfficiency2: '82%' },
                { id: 'E-GT501', steamFlow: '60 t/h', steamPressure: '3.0 MPa', steamTemperature: '500℃', isentropicEfficiency2: '85%' },
                { id: 'E-GT201', steamFlow: '50 t/h', steamPressure: '2.5 MPa', steamTemperature: '450℃', isentropicEfficiency2: '82%' },
                { id: 'E-GT501', steamFlow: '60 t/h', steamPressure: '3.0 MPa', steamTemperature: '500℃', isentropicEfficiency2: '85%' },
                { id: 'E-GT201', steamFlow: '50 t/h', steamPressure: '2.5 MPa', steamTemperature: '450℃', isentropicEfficiency2: '82%' },
                { id: 'E-GT501', steamFlow: '60 t/h', steamPressure: '3.0 MPa', steamTemperature: '500℃', isentropicEfficiency2: '85%' },
                { id: 'E-GT201', steamFlow: '50 t/h', steamPressure: '2.5 MPa', steamTemperature: '450℃', isentropicEfficiency2: '82%' },
                { id: 'E-GT501', steamFlow: '60 t/h', steamPressure: '3.0 MPa', steamTemperature: '500℃', isentropicEfficiency2: '85%' },
                // 其他汽轮机数据...
              ],
              distillationColumns: [
                { id: 'DA-2440', feedFlow: '30 t/h', feedTemperature: '180℃', efficiency: '92%' },
                { id: 'DA-2440', feedFlow: '30 t/h', feedTemperature: '180℃', efficiency: '92%' },
                { id: 'DA-2440', feedFlow: '30 t/h', feedTemperature: '180℃', efficiency: '92%' },
                { id: 'DA-2440', feedFlow: '30 t/h', feedTemperature: '180℃', efficiency: '92%' },
                { id: 'DA-2440', feedFlow: '30 t/h', feedTemperature: '180℃', efficiency: '92%' },
                { id: 'DA-2440', feedFlow: '30 t/h', feedTemperature: '180℃', efficiency: '92%' },
                { id: 'DA-2440', feedFlow: '30 t/h', feedTemperature: '180℃', efficiency: '92%' },
                { id: 'DA-2440', feedFlow: '30 t/h', feedTemperature: '180℃', efficiency: '92%' },
                { id: 'DA-2440', feedFlow: '30 t/h', feedTemperature: '180℃', efficiency: '92%' },
                { id: 'DA-2440', feedFlow: '30 t/h', feedTemperature: '180℃', efficiency: '92%' },
                // 其他精馏塔数据...
              ]
      };
    }
  };
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
  }
  
  .efficiency-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .efficiency-table th, .efficiency-table td {
  
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
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
  }
  </style>