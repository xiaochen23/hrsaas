<template>
  <div>
    <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
      <!-- 多选框组 v-model双向绑定-->
      <el-checkbox-group v-model="roleIds">
        <!-- 要循环的选项 -->
        <!-- 要 显示角色名称 存储角色id label表示要存储的值 -->
        <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <!-- 定义footer插槽 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      // 当前用户的id
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], // 负责存储所有的角色id
      roleIds: [] // 存储当前用户所拥有的角色id
    }
  },
  created() {
    // 获取所有角色
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 }) // 默认只取10条数据 rows是要循环的记录
      this.list = rows
    },
    // props传值是异步的 所以这里不能用userId
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id) // 将用户所拥有的角色赋值给当前用户的对象
      this.roleIds = roleIds
    },
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$emit('update:showRoleDialog', false) // 关闭弹层
    },
    btnCancel() {
      this.roleIds = [] // 清空原来的数组
      this.$emit('update:showRoleDialog', false) // 关闭弹层
    }
  }
}
</script>

<style>

</style>
