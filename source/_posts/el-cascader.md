---
title: el-cascader组件扩展
date: 2022-04-27
categories:
  - 技术
tags:
  - vue
---
在`Vue`中使用`ElementUI`的级联选择省市区组件时，会出现一些不同需求及该组件内部一些bug的问题，以下列举部分问题
## 1.同级多选、一条链路单选
链路单选：['北京', '北京市', '北京市/东城区']类似这样一条链路只能单选存在其一
<!--more-->
```
<el-cascader ref="cascader" />
change事件时重设value
rewriteSetValue() {
  const result = [];
  const paths = [];
  const checkedNodes = this.$refs.cascader.getCheckedNodes();
  // 获取当前点击checked
  const focusDOM = document.getElementsByClassName("el-checkbox__input is-focus")[0]
  if (!focusDOM) return;
  const curName = focusDOM.parentElement.nextElementSibling.innerHTML;
  const curData = checkedNodes.find(v=>v.label===curName);

  if (!curData) return;
  this.setTreeCheckedValue(curData);

  this.value.forEach(node => {
    let id = node[node.length - 1];
    let nodes = this.$refs.cascader.$children[1].getNodeByValue(id);
    if (nodes.checked) {
      result.push(node);
      paths.push(curData);
    }
  })
  this.$refs.cascader.$children[1].checkedNodePaths = paths;
  this.$refs.cascader.$children[1].checkedValue = result;
  this.value = result;
},
```
## 2.多选lazyLoad模式change值问题
当选中父节点通过`lazyLoad`加载子节点时，会触发`change`事件，传入的值不包含当前选中的子节点。可通过在lazyLoad模式的方法中设置一个状态阻止`change`之后的操作
```
options: {
  lazy: true,
  lazyLoad: loadCity
}
loadCity(node, resolve) {
  if (node.level !== 0 && node.checked) this.mulLazyChangeFlag = false;
}
change() {
  if (this.multiple && !this.mulLazyChangeFlag) {
    this.mulLazyChangeFlag = true;
    return;
  };
}
```
## 3.多选模式下，删除tag时触发change会传回上一次数据
通过`$nextTick`来包装`change`事件
```
this.$nextTick(() => this.$emit('change'))
```
## 4.多选折叠模式控制展示数量
可通过重写tags方法
```
<el-cascader ref="cascader">

mounted() {
  this.$refs.cascader.computePresentTags = this.rewriteComputedTags;
}
rewriteComputedTags() {
  const _this = this.$refs.cascader;
  const { isDisabled, leafOnly, showAllLevels, separator } = _this;
  const checkedNodes = _this.getCheckedNodes(leafOnly);
  const tags = [];

  const genTag = node => ({
    node,
    key: node.uid,
    text: node.getText(showAllLevels, separator),
    hitState: false,
    closable: !isDisabled && !node.isDisabled,
  });

  if (checkedNodes.length) tags.push(...this.formatComputedTags(checkedNodes, genTag));

  _this.checkedNodes = checkedNodes;
  _this.presentTags = tags;
},
formatComputedTags(tagsList, callback) {
  const tags = [];
  if (this.collapseTags) {
    tagsList.forEach((node, index) => {
      if (index < this.tagsNum) {
        tags.push(callback ? callback(node) : node)
      }
    });
    if (tagsList.length > this.tagsNum) {  // tagsNum：控制折叠下展示的tag数量
      tags.push({
        key: -1,
        text: `+ ${tagsList.length - this.tagsNum}`,
        closable: false,
      });
    }
    return tags;
  }
  tagsList.forEach(node => tags.push(callback ? callback(node) : node));
  return tags;
},
```