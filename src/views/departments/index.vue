<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 - 头部 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <TreeTools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 放置一个el-tree -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容，插槽内容会循环多次，有多少节点就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据 data每个节点上的数据对象 -->
          <TreeTools slot-scope="{data}" :tree-node="data" @editDepts="editDepts" @delDepts="getDepartments" @addDepts="addDepts" />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增弹层组件 -->
    <AddDepts ref="addDepts" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDepts from './components/add-depts.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'

export default {
  components: {
    TreeTools,
    AddDepts
  },
  data() {
    return {
      defaultProps: {
        label: 'name', // 从这个属性显示内容
        children: 'children' // 从这个属性去找子节点
      },
      company: { },
      departs: [],
      showDialog: false, // 默认不显示弹层
      node: null
    }
  },
  created() {
    this.getDepartments() // 调用自身的方法
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(result.depts, '')// 需要将其转化为树形结构
      console.log(result)
    },
    // 监听tree-tools中触发的点击添加子部门的事件
    // node是我们点击的部门
    addDepts(node) {
      this.showDialog = true // 显示弹层
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true
      this.node = node
      // 在这里调用获取部门详情的方法
      this.$refs.addDepts.getDepartDetail(node.id)
    }
  }
}
</script>
result.depts
<style scoped>
  .tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
