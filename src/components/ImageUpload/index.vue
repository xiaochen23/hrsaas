<template>
  <div>
    <!-- action给#号防止报错 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      :file-list="fileList"
      :class="{ disabled: fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" :percentage="percent" style="width: 180px" />
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width: 100%">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云cos包
// 实例化COS对象
const cos = new COS({
  SecretId: 'AKIDaz81dy3rOeeNp0uXtxkHXXGjvrb5IEtG', // 身份识别id
  SecretKey: '8zZsuf9MIzOWT9XeU3LMfmcBTUFiupTq' // 身份密钥
})

export default {
  data() {
    return {
      showDialog: false,
      imgUrl: '',
      currentFileUid: null, // 记录正在上传的uid
      fileList: [],
      percent: 0, // 上传进度条百分比
      showPercent: false
    }
  },
  computed: {
    // 如果为true 表示就不应该显示 + 上传了
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击预览事件
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 点击移除事件
    // file是要删除的文件
    // fileList是删除之后的文件
    handleRemove(file, fileList) {
      // this.fileList = fileList
      this.fileList = this.fileList.filter(item => item.uid !== file.uid) // 将当前的删除文件排除在外
    },
    changeFile(file, fileList) {
      // file是当前的文件，fileList是当前的最新数组
      // 如果当前fileList中没有该文件的话，就往里进行追加
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      // 先检查文件类型
      const types = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp']
      if (!types.some(item => item === file.type)) {
        // 如果不存在
        this.$message.error('上传文件只能是 JPG、GIF、BMP、PNG 格式！')
        return false // 终止上传
      }
      // 检查文件的大小
      const maxSize = 5 * 1024 * 1024 // 最大5M
      if (file.size > maxSize) {
        this.$message.error('上传的图片大小不能大于5M')
        return false
      }
      // 确定当前上传的就是当前的这个file
      this.currentFileUid = file.uid
      this.showPercent = true
      return true // 最后记得return true
    },
    // 进行上传操作
    upload(params) {
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'cjs-01-1308596985', // 存储桶名称
          Region: 'ap-guangzhou', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 要上传的模式类型 直接默认标准模式
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          console.log(err || data)
          // statusCode===200说明上传成功
          if (!err && data.statusCode === 200) {
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
            setTimeout(() => {
              this.showPercent = false // 关闭进度条
              this.percent = 0 // 重置百分比
            }, 1000)
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled  .el-upload--picture-card {
  display: none;
}
</style>
