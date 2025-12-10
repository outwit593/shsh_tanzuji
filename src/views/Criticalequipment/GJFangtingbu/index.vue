<template>
  <div>
    <h1>芳烃部工艺卡片基础信息</h1>
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
        { 位号: 'FTB.2ARO.HLB404.PV', 位号描述: 'DA-404回流比', 单位: 'm3/m3', 设备名称: null, 下限: 0.4, 上限: 2.0, 当天使用量: null },
        { 位号: 'FTB.2ARO.HLB409.PV', 位号描述: 'DA-409回流进料比', 单位: 'm3/m3', 设备名称: null, 下限: 0.7, 上限: 1.6, 当天使用量: null },
        { 位号: 'FTB.YJQ.AI310601A.PV', 位号描述: 'F3102氧含量', 单位: '百分比/%', 设备名称: null, 下限: 1.0, 上限: 3.0, 当天使用量: null },
        { 位号: 'FTB.2ARO.HLB505.PV', 位号描述: 'DA-505 回流比', 单位: null, 设备名称: 'DA-505塔', 下限: 0.8, 上限: 2.6, 当天使用量: null },
        { 位号: 'FTB.YJQ.AI310201A.PV', 位号描述: 'F3101氧含量', 单位: '百分比/%', 设备名称: null, 下限: 1.0, 上限: 3.0, 当天使用量: null },
        { 位号: 'FTB.4ARO.AC82203.PV', 位号描述: '加热炉氧含量AI82203', 单位: '%', 设备名称: null, 下限: 1.0, 上限: 4.0, 当天使用量: null },
        { 位号: 'FTB.4ARO.TC22103.PV', 位号描述: 'C-201灵敏板温度', 单位: '℃', 设备名称: null, 下限: 110.0, 上限: 130.0, 当天使用量: null },
        { 位号: 'FTB.2ARO.HLB301.PV', 位号描述: 'DA-301回流比', 单位: null, 设备名称: 'DA-301', 下限: 0.4, 上限: 3.0, 当天使用量: null },
        { 位号: 'FTB.4ARO.AC24051.PV', 位号描述: 'F205氧含量', 单位: '%', 设备名称: null, 下限: 1.0, 上限: 4.0, 当天使用量: null },
        { 位号: 'FTB.4ARO.HLB201.PV', 位号描述: '脱戊烷塔C-201回流比', 单位: null, 设备名称: null, 下限: 0.8, 上限: 3.5, 当天使用量: null },
        { 位号: 'FTB.2ARO.HLB302.PV', 位号描述: 'DA-302回流比', 单位: null, 设备名称: 'DA-302', 下限: 0.9, 上限: 3.0, 当天使用量: null },
        { 位号: 'FTB.2ARO.TI10128.PV', 位号描述: '制氢A系列转化炉 烟气排气温度', 单位: '℃', 设备名称: 'A系列', 下限: 115.0, 上限: 150.0, 当天使用量: null },
        { 位号: 'FTB.2ARO.TI10228.PV', 位号描述: '制氢B系列转化炉烟气排烟温度', 单位: '℃', 设备名称: 'B系列', 下限: 105.0, 上限: 150.0, 当天使用量: null },
        { 位号: 'FTB.4ARO.TE_51282A.PV', 位号描述: '引风机入口温度TE_51282A', 单位: '℃', 设备名称: null, 下限: 95.0, 上限: 140.0, 当天使用量: null },
        { 位号: 'FTB.4ARO.AI24031.PV', 位号描述: 'F-203氧含量', 单位: '%', 设备名称: null, 下限: 1.0, 上限: 4.0, 当天使用量: null },
        { 位号: 'FTB.4ARO.AI24021.PV', 位号描述: 'F-202氧含量', 单位: '%', 设备名称: null, 下限: 1.0, 上限: 4.0, 当天使用量: null },
        { 位号: 'FTB.2MTBE.HLB3501.PV', 位号描述: 'C-3501A回流比', 单位: null, 设备名称: null, 下限: 0.45, 上限: 0.95, 当天使用量: null },
        { 位号: 'FTB.4ARO.HLB202.PV', 位号描述: '脱丁烷塔C-202回流比', 单位: null, 设备名称: null, 下限: 1.0, 上限: 3.5, 当天使用量: null },
        { 位号: 'FTB.2ARO.QI3001.PV', 位号描述: 'BA302A /BA303氧含量', 单位: '%', 设备名称: 'BA-302A/BA-303', 下限: 1.0, 上限: 4.0, 当天使用量: null },
        { 位号: 'FTB.2ARO.QI3002.PV', 位号描述: 'BA302B氧含量', 单位: '%', 设备名称: 'BA-302B', 下限: 1.0, 上限: 4.0, 当天使用量: null },
        { 位号: 'FTB.4ARO.AI24041.PV', 位号描述: 'F-204氧含量', 单位: '%', 设备名称: null, 下限: 1.0, 上限: 4.0, 当天使用量: null },
        { 位号: 'FTB.2ARO.QI3003.PV', 位号描述: 'BA304氧含量', 单位: '%', 设备名称: 'BA-304', 下限: 1.0, 上限: 4.0, 当天使用量: null },
        { 位号: 'FTB.4ARO.AI24011.PV', 位号描述: 'F-201氧含量', 单位: '%', 设备名称: null, 下限: 1.0, 上限: 4.0, 当天使用量: null },
        { 位号: 'FTB.4ARO.TI24302C.PV', 位号描述: '烟道出口温度', 单位: '℃', 设备名称: null, 下限: 90.0, 上限: 110.0, 当天使用量: null },
        { 位号: 'FTB.4ARO.TI24072A.PV', 位号描述: 'F-205烟气经预热器后的温度', 单位: '℃', 设备名称: null, 下限: 90.0, 上限: 140.0, 当天使用量: null },
        { 位号: 'FTB.4ARO.TI82216.PV', 位号描述: '空气预热器烟气出口温度', 单位: '℃', 设备名称: null, 下限: 95.0, 上限: 140.0, 当天使用量: null },
        { 位号: 'FTB.2ARO.QI1001.PV', 位号描述: '循环氢加热炉BA-101烟气氧含量', 单位: '%', 设备名称: '循环氢出加热炉BA-101', 下限: 1.0, 上限: 3.0, 当天使用量: null },
        { 位号: 'FTB.2ARO.QI1002.PV', 位号描述: '循环氢加热炉BA-102烟气氧含量', 单位: '%', 设备名称: '循环氢出加热炉BA-102', 下限: 1.0, 上限: 3.0, 当天使用量: null },
        { 位号: 'FTB.2ARO.QI1003.PV', 位号描述: '脱戊烷塔底再沸炉BA-103烟气氧含量', 单位: '%', 设备名称: '加热炉BA-103', 下限: 1.0, 上限: 3.0, 当天使用量: null },
        { 位号: 'FTB.2ARO.QI1004.PV', 位号描述: '分馏底再沸炉BA-104烟气氧含量', 单位: '%', 设备名称: '加热炉BA-104', 下限: 1.0, 上限: 3.0, 当天使用量: null },
        { 位号: 'FTB.2ARO.QI1701.PV', 位号描述: '减压塔底再沸炉BA-105烟气氧含量', 单位: '%', 设备名称: '加热炉BA-105', 下限: 1.0, 上限: 3.0, 当天使用量: null },
        { 位号: 'FTB.2ARO.TI1866.PV', 位号描述: '余热回收排烟温度', 单位: '℃', 设备名称: '加热炉', 下限: 85.0, 上限: 120.0, 当天使用量: null },
        { 位号: 'FTB.3ZQ.TI20507.PV', 位号描述: '排烟温度', 单位: '℃', 设备名称: null, 下限: 105.0, 上限: 150.0, 当天使用量: null },
        { 位号: 'FTB.3ZQ.AI20502A.PV', 位号描述: '排烟氧含量', 单位: '%', 设备名称: null, 下限: 1.0, 上限: 4.0, 当天使用量: null },
        { 位号: 'FTB.3CZ.TI323005A.PV', 位号描述: '3#重整排烟温度', 单位: '摄氏 度', 设备名称: null, 下限: 110.0, 上限: 150.0, 当天使用量: null },
        { 位号: 'FTB.3CZ.AC330901B.PV', 位号描述: 'EH-3303出口氧气含量AC330901B', 单位: '百分比', 设备名称: null, 下限: 0.4, 上限: 1.2, 当天使用量: null },
        { 位号: 'FTB.3CZ.AI323031A.PV', 位号描述: 'F3203氧含量', 单位: '%', 设备名称: null, 下限: 1.0, 上限: 3.0, 当天使用量: null },
        { 位号: 'FTB.2ARO.TI3133.PV', 位号描述: '四合一炉排烟温度', 单位: '℃', 设备名称: null, 下限: 110.0, 上限: 170.0, 当天使用量: null },
        { 位号: 'FTB.3CZ.AI323041A.PV', 位号描述: 'F3204氧含量', 单位: '%', 设备名称: null, 下限: 1.0, 上限: 3.0, 当天使用量: null },
        { 位号: 'FTB.3CZ.AC323051.PV', 位号描述: 'F-3205氧含量', 单位: '%', 设备名称: null, 下限: 1.0, 上限: 3.0, 当天使用量: null },
        { 位号: 'FTB.2ARO.QI10101.PV', 位号描述: '制氢A系列转化炉烟道气氧分仪', 单位: '%', 设备名称: 'A系列', 下限: 1.0, 上限: 4.0, 当天使用量: null },
        { 位号: 'FTB.3CZ.TI323072.PV', 位号描述: 'F-3205烟气经预热器后的温度', 单位: '℃', 设备名称: null, 下限: 90.0, 上限: 130.0, 当天使用量: null },
        { 位号: 'FTB.2ARO.HLB506.PV', 位号描述: 'DA-506 回流比', 单位: null, 设备名称: 'DA-506塔', 下限: 0.7, 上限: 2.8, 当天使用量: null },
        { 位号: 'FTB.3CZ.AI323011A.PV', 位号描述: 'F3201氧含量', 单位: '%', 设备名称: null, 下限: 1.0, 上限: 3.0, 当天使用量: null },
        { 位号: 'FTB.2ARO.QI10201.PV', 位号描述: '制氢B系列转化炉烟道气氧分仪', 单位: '%', 设备名称: 'B系列', 下限: 1.0, 上限: 4.0, 当天使用量: null }
      ]
    };
  },
  mounted() {
    this.fetchDailyUsage();
  },
  methods: {
    async fetchDailyUsage() {
      try {
        const response = await axios.get('https://172.160.11.205:443/fangtingbu');
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