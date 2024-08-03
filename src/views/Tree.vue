<template>
  <div class="container">
    <h1 class="title">TREE</h1>
    <div ref="chartdiv" style="width: 100%; height: 550px"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as am5 from '@amcharts/amcharts5'
import * as am5hierarchy from '@amcharts/amcharts5/hierarchy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'

const chartdiv = ref(null) // Создаем ref для элемента chartdiv

onMounted(() => {
  if (chartdiv.value) {
    const root = am5.Root.new(chartdiv.value)

    root.setThemes([am5themes_Animated.new(root)])

    const zoomableContainer = root.container.children.push(
      am5.ZoomableContainer.new(root, {
        width: am5.p100,
        height: am5.p100,
        wheelable: true,
        pinchZoom: true
      })
    )

    zoomableContainer.children.push(am5.ZoomTools.new(root, { target: zoomableContainer }))

    const series = zoomableContainer.contents.children.push(
      am5hierarchy.Tree.new(root, {
        singleBranchOnly: false,
        downDepth: 1,
        initialDepth: 10,
        valueField: 'value',
        categoryField: 'name',
        childDataField: 'children'
      })
    )

    series.labels.template.set('minScale', 0)

    const maxLevels = 4
    const maxNodes = 4
    const maxValue = 100

    const data = { name: 'Root', children: [] }
    generateLevel(data, '', 0)

    series.data.setAll([data])
    series.set('selectedDataItem', series.dataItems[0])

    function generateLevel(data, name, level) {
      for (let i = 0; i < Math.ceil(maxNodes * Math.random()) + 1; i++) {
        const nodeName = name + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i]
        let child
        if (level < maxLevels) {
          child = { name: nodeName + level }

          if (level > 0 && Math.random() < 0.5) {
            child.value = Math.round(Math.random() * maxValue)
          } else {
            child.children = []
            generateLevel(child, nodeName + i, level + 1)
          }
        } else {
          child = { name: name + i, value: Math.round(Math.random() * maxValue) }
        }
        data.children.push(child)
      }
      level++
      return data
    }

    series.appear(1000, 100)
  } else {
    console.error('Element "chartdiv" is not available.')
  }
})
</script>

<style scoped>
.container {
  text-align: center;
  margin-top: 2rem;
}
.title {
  text-transform: uppercase;
  font-size: 2rem;
  letter-spacing: 1rem;
}
</style>
