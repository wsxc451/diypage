<template>
  <div class="wrap">
    <el-tabs v-model="activeName" @tab-click="handleClick" class="wrap-tabs">
      <el-tab-pane label="基础配置" name="first">
        <el-upload
          class="upload-demo"
          :action="`http://127.0.0.1:7002/page/upload`"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="内容管理" name="second">内容管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from "axios"
export default {
  name: "DiyOper",
  data() {
    return {
      activeName: "first",
      fileList: [],
      csrf: null,
    }
  },
  mounted() {
    // xhr.setRequestHeader('x-csrf-token', csrftoken);
    axios.get("http://127.0.0.1:7002/img/lists", {}).then((res) => {
      console.log(res)
    })
  },
  methods: {
    handleClick(e) {},
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
  },
}
</script>

<style scoped>
.wrap {
  background: #fff;
  width: 100%;
  padding: 15px;
}
.wrap-tabs {
  width: 100%;
  display: block;
}
</style>
