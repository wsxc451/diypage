# vue-diypage

做专题页面或者可视化diy页面时,牵涉到一些解决思路;
demo
![vue-diypage](https://github.com/wsxc451/diypage/blob/master/docs/diypage-1.png?raw=true "vue-diypage")

视频演示(上传一个视频,可以看下动态效果)
https://v.qq.com/x/page/w0953z3jf8q.html
#### 1.页面布局
##### a.可以分类三栏,左侧组件栏,右侧数据编辑栏,中级,页面效果展示栏
#### 2.动画效果
##### 如果直接用数据驱动,动画比较僵硬,建议用一些弹性动画效果
##### 如果拖拽函数使用html5,drag函数,不好用,而且拖起来有个很难看的一块,不方便自定义;建议自己改用onmouesemove/start/end来原生书写
##### 移动时建议transform加上一个动画延迟,这样会有一些缓冲的效果,不生硬,而且动画渲染更流畅;如在拖拽元素上加上 transition-duration: 50ms;
#### 3.数据存储方式
##### 我这里是用json存储到localStorage里面,保存时再序列化到后端,每一个可以拖拽的(上下拖拽)我起名为wrap, 每个wrap只能上下拖拽,来调整排序; 上下调整是改变transform: 'translateY(' + wrap.originTop + 'px)' ;原理就是动态改变每个wrap的originTop,来实现绝对对位,达到排序效果;
## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run serve

# build for production with minification
npm run build
```

