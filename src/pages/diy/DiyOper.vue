<template>
  <div class="diyoper-wrap">
    <el-tabs :value="activeTab" @tab-click="handleClick" class="wrap-tabs">
      <el-tab-pane label="基础配置" name="base">
        <el-form ref="form" label-width="80px" style="width:80%" v-if="pageInfo">
          <el-form-item label="页面编号">
            <el-input v-model="pageInfo.code" placeholder="请输入落地页编号"></el-input>
          </el-form-item>
          <el-form-item label="页面名称">
            <el-input v-model="pageInfo.name" placeholder="请输入落地页名称"></el-input>
          </el-form-item>
          <el-form-item label="页面状态">
            <el-radio-group v-model="pageInfo.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="布局编辑" name="wrap">
        <el-form ref="form" label-width="80px" style="width:80%">
          <el-form-item label="操作">
            <el-button :disabled="!operItem.sort" @click="operUp" type="primary">向上</el-button>
            <el-button :disabled="!operItem.sort" @click="operDown" type="primary">向下</el-button>
            <el-button :disabled="!operItem.sort" @click="delOper" type="danger">删除</el-button>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="operItem.type" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片url">
            <el-input v-model="operItem.url" placeholder="请输入图片url"></el-input>
          </el-form-item>
          <el-form-item label="背景图">
            <el-upload class="avatar-uploader" :show-file-list="false" :on-success="handleAvatarSuccess" :action="`http://127.0.0.1:7002/page/upload`" :on-remove="handleRemove" :file-list="fileList">
              <!-- <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              <img v-if="imgUrl" :src="imgUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="数据管理" name="second">
        status
      </el-tab-pane>
    </el-tabs>
    <div class="clear"></div>
    <div class="opers">
      <el-button :disabled="isedit" @click="saveOper" type="primary">保存</el-button>
      <el-button>取消</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import axios from 'axios'
const staticHost = 'http://127.0.0.1:7002/public/'
export default {
  name: 'DiyOper',
  data() {
    return {
      isedit: false,
      fileList: [],
      csrf: null,
      imgUrl: null,
      form: { name: '', type: 'img', status: 1 },
      options: [
        { label: '图片', value: 'img' },
        { label: '图层', value: 'layout' }
      ]
    }
  },
  computed: {
    ...mapState({
      operItem: state => state.diypage.operItem,
      pageInfo: state => state.diypage.pageInfo,
      pageWrapList: state => state.diypage.pageWrapList,
      activeTab: state => state.diypage.activeTab
    })
  },
  mounted() {
    // xhr.setRequestHeader('x-csrf-token', csrftoken);
  },
  watch: {
    operItem(val) {
      if (val.info) {
        this.imgUrl = `${staticHost}${val.info}`
      } else {
        this.imgUrl = null
      }
    }
  },
  methods: {
    ...mapMutations({
      setOperItem: 'diypage/setOperItem',
      setPageWrapList: 'diypage/setPageWrapList'
    }),
    delOper() {
      let tempList = this.pageWrapList.filter(item => item.id !== this.operItem.id).sort((a, b) => a.sort - b.sort)
      let sort = 1
      tempList = tempList.map(item => {
        return { ...item, sort: sort++ }
      })
      this.setPageWrapList(tempList)
      this.setOperItem({})
    },
    saveOper() {
      // savePageInfo
      this.isedit = true
      let saveJson = {}
      if (this.pageWrapList.length == 0) {
        // 删除所有wrap
        saveJson = {
          pageInfo: this.pageInfo,
          wrapList: []
        }
      } else {
        let tempInfoIndex = this.pageWrapList.findIndex(item => item.id == this.operItem.id)
        if (this.imgUrl) {
          let tempImg = this.imgUrl.replace(staticHost, '')
          if (this.imgUrl && tempImg !== this.operItem.info && tempInfoIndex !== -1) {
            this.$set(this.pageWrapList, tempInfoIndex, Object.assign({}, this.pageWrapList[tempInfoIndex], { info: tempImg }))
          }
        }
        let filterList = this.filterByKey(this.pageWrapList, 'sort')
        saveJson = {
          pageInfo: this.pageInfo,
          wrapList: filterList.map(item => {
            const { type, info, id, pageid, sort, url } = item
            return { type, info, id, pageid, sort, url }
          })
        }
      }
      axios
        .post('http://127.0.0.1:7002/pagewrap/update', saveJson)
        .then(res => {
          // this.pageWrapList = res.data.data
          console.log(res)
          this.$message('修改成功')
          this.isedit = false
        })
        .catch(err => {
          console.log(err)
          this.isedit = false
        })
    },
    filterByKey(lists, key) {
      const obj = {}
      let temp = lists.reduce((item, next) => {
        obj[next[key]] ? '' : (obj[next[key]] = true && item.push(next))
        return item
      }, [])
      return temp
    },
    handleAvatarSuccess(res, file) {
      console.log(res, file)
      this.imgUrl = staticHost + res.info.fileName

      // this.setPageWrapList()
    },
    operUp() {
      this.$emit('onChange', {
        type: 'up'
      })
    },
    operDown() {
      this.$emit('onChange', {
        type: 'down'
      })
    },
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
    }
  }
}
</script>

<style scoped>
.diyoper-wrap {
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 15px;
}
.wrap-tabs {
  width: 100%;
  display: block;
}
.clear {
  clear: both;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin: 15px auto;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
