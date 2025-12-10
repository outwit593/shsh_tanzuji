<template>
  <div>
    <h1>储运部工艺卡片基础信息</h1>
    <table>
      <thead>
        <tr>
          <th>位号</th>
          <th>位号描述</th>
          <th>设备名称</th>
          <th>单位</th>
          <th>上限</th>
          <th>下限</th>
          <th>当天使用量</th>
          <th>报警提示</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.位号" class="table-row">
          <td class="bold-text">{{ item.位号 }}</td>
          <td>{{ item.位号描述 }}</td>
          <td>{{ item.设备名称 }}</td>
          <td>{{ item.单位 }}</td>
          <td>{{ item.上限 }}</td>
          <td>{{ item.下限 }}</td>
          <td>{{ item.当天使用量 }}</td>
          <td>{{ getAlarmMessage(item) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      tableData: [
        { 位号: 'CYB.5STO4.PIC1027A.PV', 位号描述: 'E42壳程丙烯压力', 单位: 'kPa', 设备名称: 'E42', 下限: 600, 上限: 1550, 当天使用量: null },
        { 位号: 'CYB.5STO4.TICA1020.PV', 位号描述: 'E43壳程水温', 单位: '°C', 设备名称: 'E43', 下限: 20, 上限: 70, 当天使用量: null },
        { 位号: 'CYB.5STO4.TICA1602.PV', 位号描述: 'E602壳程水温', 单位: '°C', 设备名称: 'E602', 下限: 45, 上限: 60, 当天使用量: null },
        { 位号: 'CYB.5STO1.PIC_007.PV', 位号描述: 'E52壳程乙醛压力', 单位: 'kPa', 设备名称: 'E52', 下限: 100, 上限: 800, 当天使用量: null },
        { 位号: 'CYB.1STO4.TIA_165.PV', 位号描述: 'T-165温度', 单位: '°C', 设备名称: null, 下限: null, 上限: 85, 当天使用量: null },
        { 位号: 'CYB.1STO4.TIA_162.PV', 位号描述: 'T-162温度', 单位: '°C', 设备名称: null, 下限: null, 上限: 40, 当天使用量: null },
        { 位号: 'CYB.1STO4.TT_102_1.PV', 位号描述: 'T-102温度', 单位: '°C', 设备名称: null, 下限: 80, 上限: 155, 当天使用量: null },
        { 位号: 'CYB.1STO4.TIA_156.PV', 位号描述: 'T-156温度', 单位: '°C', 设备名称: null, 下限: null, 上限: 40, 当天使用量: null },
        { 位号: 'CYB.1STO4.TIA_157.PV', 位号描述: 'T-157温度', 单位: '°C', 设备名称: null, 下限: null, 上限: 40, 当天使用量: null },
        { 位号: 'CYB.1STO4.PT_158_1.PV', 位号描述: 'T-158压力', 单位: 'MPa', 设备名称: null, 下限: 0.02, 上限: 0.07, 当天使用量: null },
        { 位号: 'CYB.1STO4.TIA_163.PV', 位号描述: 'T-163温度', 单位: '°C', 设备名称: null, 下限: null, 上限: 85, 当天使用量: null },
        { 位号: 'CYB.1STO4.TIA_181.PV', 位号描述: 'T-181温度', 单位: '°C', 设备名称: null, 下限: 70, 上限: 115, 当天使用量: null },
        { 位号: 'CYB.1STO4.TIA_147.PV', 位号描述: 'T-147温度', 单位: '°C', 设备名称: null, 下限: 65, 上限: 85, 当天使用量: null },
        { 位号: 'CYB.1STO4.TIA_155.PV', 位号描述: 'T-155温度', 单位: '°C', 设备名称: null, 下限: null, 上限: 40, 当天使用量: null },
        { 位号: 'CYB.1STO4.TIA_161.PV', 位号描述: 'T-161温度', 单位: '°C', 设备名称: null, 下限: null, 上限: 40, 当天使用量: null },
        { 位号: 'CYB.1STO5.TT121_1.PV', 位号描述: 'T-121温度', 单位: '°C', 设备名称: null, 下限: 50, 上限: 130, 当天使用量: null },
        { 位号: 'CYB.1STO5.TT123_1.PV', 位号描述: 'T-123温度', 单位: '°C', 设备名称: null, 下限: 50, 上限: 130, 当天使用量: null },
        { 位号: 'CYB.1STO4.TIA_150A.PV', 位号描述: 'T-150A温度', 单位: '°C', 设备名称: null, 下限: null, 上限: 40, 当天使用量: null },
        { 位号: 'CYB.1STO4.TIA_182.PV', 位号描述: 'T-182温度', 单位: '°C', 设备名称: null, 下限: 70, 上限: 115, 当天使用量: null },
        { 位号: 'CYB.1STO4.TIA_164.PV', 位号描述: 'T-164温度', 单位: '°C', 设备名称: null, 下限: null, 上限: 85, 当天使用量: null },
        { 位号: 'CYB.1STO4.TI141.PV', 位号描述: 'T-141温度', 单位: '°C', 设备名称: null, 下限: null, 上限: 58, 当天使用量: null },
        { 位号: 'CYB.1STO4.TIA_101.PV', 位号描述: 'T-101温度', 单位: '°C', 设备名称: null, 下限: null, 上限: 65, 当天使用量: null },
        { 位号: 'CYB.1STO4.TIAH_104_1.PV', 位号描述: 'T-104温度', 单位: '°C', 设备名称: null, 下限: null, 上限: 65, 当天使用量: null },
        { 位号: 'CYB.1STO4.TIA_154.PV', 位号描述: 'T-154温度', 单位: '°C', 设备名称: null, 下限: null, 上限: 40, 当天使用量: null },
      ]
    }
  },
  mounted() {
    this.fetchDailyUsage();
  },
  methods: {
    async fetchDailyUsage() {
      try {
        const response = await axios.get('https://172.160.11.205:443/chuyunbu');
        let dailyUsageList = response.data;
        dailyUsageList = JSON.parse(dailyUsageList)
        console.log(dailyUsageList); // 打印返回的数据
        dailyUsageList.forEach(data => {
          const item = this.tableData.find(item => item.位号 === data.位号);
          if (item) {
            this.$set(item, '当天使用量', data.数量);
          }
        });
      } catch (error) {
        console.error('Error fetching daily usage data:', error);
      }
    },
    getAlarmMessage(item) {
      if (item.当天使用量 === null) return '';
      if (item.当天使用量 > item.上限) return '超上限报警';
      if (item.当天使用量 < item.下限) return '超下限报警';
      return '正常';
    }
  }
}
</script>

<style>
h1 {
  text-align: center;
}

table {
  margin: auto;
  width: 80%;
  border-collapse: collapse;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 为表格添加阴影 */
}

th, td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

th {
  background-color: #f2f2f2; /* 标题行的灰色背景 */
}

tr:nth-child(even) {
  background-color: #f2f2f2; /* 为偶数行添加灰色背景 */
}

.bold-text {
  font-weight: bold; /* 加粗位号列的文字 */
}
</style>

