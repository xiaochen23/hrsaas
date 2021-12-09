<template>
  <div>
    <el-dropdown trigger="click" @command="changeLanguage">
      <!-- 显一个图标 -->
      <div>
        <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :disabled="this.$i18n.locale==='zh'" command="zh">中文</el-dropdown-item>
        <el-dropdown-item :disabled="this.$i18n.locale==='en'" command="en">en</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  methods: {
    changeLanguage(type) {
      Cookie.set('language', type)
      this.$i18n.locale = type
      this.$message.success('切换语言成功')
    }
  }
}
</script>

<style>

</style>
