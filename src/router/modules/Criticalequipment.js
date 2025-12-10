/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const CriticalequipmentRouter = {
  path: '/criticalequipment',
  redirect: '/criticalequipment/GJlianyoubu/lyjiarelu',
  component: Layout,
  name: 'Criticalequipment',
  meta: { title: '关键设备能效监控', icon: 'nested' },
  children: [
    {
      path: 'gjlianyoubu',
      name: 'GJLianyoubu',
      component: () => import('@/views/Criticalequipment/GJLianyoubu/main'), // Parent router-view
      meta: { title: '炼油部' },
      redirect: '/criticalequipment/gjlianyoubu',
      children: [
        {
          path: 'lynenghao',
          name: 'LYShebei',
          component: () => import('@/views/Criticalequipment/GJLianyoubu/index'),
          meta: { title: '部门关键能耗信息' }
        },
        {
          path: 'lyshebei',
          name: 'LYShebei',
          component: () => import('@/views/Criticalequipment/GJLianyoubu/index2'),
          meta: { title: '部门关键设备信息' }
        }
      ]
    },
    {
      path: 'gjxitingbu',
      name: 'GJXitingbu',
      component: () => import('@/views/Criticalequipment/GJXitingbu/main'), // Parent router-view
      meta: { title: '烯烃部' },
      redirect: '/criticalequipment/xitingbu',
      children: [
        {
          path: 'xtnenghao',
          name: 'XTNenghao',
          component: () => import('@/views/Criticalequipment/GJXitingbu/index'),
          meta: { title: '部门关键能耗信息' }
        },
        {
          path: 'xtshebei',
          name: 'XTShebei',
          component: () => import('@/views/Criticalequipment/GJXitingbu/index2'),
          meta: { title: '部门关键设备信息' }
        }
      ]
    },
    {
      path: 'gjchuyunbu',
      name: 'GJChuyunbu',
      component: () => import('@/views/Criticalequipment/GJChuyunbu/main'), // Parent router-view
      meta: { title: '储运部' },
      redirect: '/criticalequipment/chuyunbu',
      children: [
        {
          path: 'cynenghao',
          name: 'CYNenghao',
          component: () => import('@/views/Criticalequipment/GJChuyunbu/index'),
          meta: { title: '部门关键能耗信息' }
        },
        {
          path: 'cyshebei',
          name: 'CYShebei',
          component: () => import('@/views/Criticalequipment/GJChuyunbu/index2'),
          meta: { title: '部门关键设备信息' }
        }
      ]
    },
    {
      path: 'gjfangtingbu',
      name: 'GJFangtingbu',
      component: () => import('@/views/Criticalequipment/GJFangtingbu/main'), // Parent router-view
      meta: { title: '芳烃部' },
      redirect: '/criticalequipment/fangtingbu',
      children: [
        {
          path: 'ftnenghao',
          name: 'FTNenghao',
          component: () => import('@/views/Criticalequipment/GJFangtingbu/index'),
          meta: { title: '部门关键能耗信息' }
        },
        {
          path: 'ftshebei',
          name: 'FTShebei',
          component: () => import('@/views/Criticalequipment/GJFangtingbu/index2'),
          meta: { title: '部门关键设备信息' }
        }
      ]
    },
    {
      path: 'gjhechengshuzhibu',
      name: 'GJHechengshuzhibu',
      component: () => import('@/views/Criticalequipment/GJHechengshuzhibu/main'), // Parent router-view
      meta: { title: '合成树脂部' },
      redirect: '/criticalequipment/hechengshuzhibu',
      children: [
        {
          path: 'hcsznenghao',
          name: 'HCSZNenghao',
          component: () => import('@/views/Criticalequipment/GJHechengshuzhibu/index'),
          meta: { title: '部门关键能耗信息' }
        },
        {
          path: 'hcszshebei',
          name: 'hcszShebei',
          component: () => import('@/views/Criticalequipment/GJHechengshuzhibu/index2'),
          meta: { title: '部门关键设备信息' }
        }
      ]
    },
    {
      path: 'gjhuagongbu',
      name: 'GJHuagongbu',
      component: () => import('@/views/Criticalequipment/GJHuagongbu/main'), // Parent router-view
      meta: { title: '化工部' },
      redirect: '/criticalequipment/huagongbu',
      children: [
        {
          path: 'hgnenghao',
          name: 'HGNenghao',
          component: () => import('@/views/Criticalequipment/GJHuagongbu/index'),
          meta: { title: '部门关键能耗信息' }
        },
        {
          path: 'hgshebei',
          name: 'HGShebei',
          component: () => import('@/views/Criticalequipment/GJHuagongbu/index2'),
          meta: { title: '部门关键设备信息' }
        }
      ]
    },
    {
      path: 'gjredianbu',
      name: 'GJRedianbu',
      component: () => import('@/views/Criticalequipment/GJRedianbu/main'), // Parent router-view
      meta: { title: '热电部' },
      redirect: '/criticalequipment/redianbu',
      children: [
        {
          path: 'rdnenghao',
          name: 'RDNenghao',
          component: () => import('@/views/Criticalequipment/GJRedianbu/index'),
          meta: { title: '部门关键能耗信息' }
        },
        {
          path: 'rdshebei',
          name: 'RDShebei',
          component: () => import('@/views/Criticalequipment/GJRedianbu/index2'),
          meta: { title: '部门关键设备信息' }
        }
      ]
    },
    {
      path: 'gjtanxianweishiyebu',
      name: 'GJTanxianweishiyebu',
      component: () => import('@/views/Criticalequipment/GJTanxianweishiyebu/main'), // Parent router-view
      meta: { title: '碳纤维事业部' },
      redirect: '/criticalequipment/tanxianweishiyebu',
      children: [
        {
          path: 'txwsynenghao',
          name: 'TXWSYNenghao',
          component: () => import('@/views/Criticalequipment/GJTanxianweishiyebu/index'),
          meta: { title: '部门关键能耗信息' }
        },
        {
          path: 'txwsyshebei',
          name: 'TXWSYShebei',
          component: () => import('@/views/Criticalequipment/GJTanxianweishiyebu/index2'),
          meta: { title: '部门关键设备信息' }
        }
      ]
    }
  ]
}

export default CriticalequipmentRouter
