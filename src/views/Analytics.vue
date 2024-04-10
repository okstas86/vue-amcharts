<template>
  <div class="container">
    <h1 class="title">Analytics</h1>
    <div id="chartdiv"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import store from '../store/index'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'

const data = prepareData(store.state.data)

onMounted(() => {
  let root = am5.Root.new(document.getElementById('chartdiv'))

  const myTheme = am5.Theme.new(root)
  myTheme.rule('AxisLabel', ['minor']).setAll({ dy: 1 })
  myTheme.rule('Grid', ['minor']).setAll({ strokeOpacity: 0.08 })
  root.setThemes([am5themes_Animated.new(root), myTheme])

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: 'panX',
      wheelY: 'zoomX',
      paddingLeft: 0
    })
  )

  const xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      maxDeviation: 0,
      baseInterval: { timeUnit: 'day', count: 1 },
      renderer: am5xy.AxisRendererX.new(root, {
        minorGridEnabled: true,
        minGridDistance: 200,
        minorLabelsEnabled: true,
        labelFunction: (value) => {
          const date = new Date(value)
          return date.toLocaleString('default', { month: 'short', day: 'numeric' })
        }
      }),
      tooltip: am5.Tooltip.new(root, {})
    })
  )
  xAxis.set('minorDateFormats', { day: 'dd', month: 'MM' })

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    })
  )

  const series = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: 'Series',
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: 'visits',
      valueXField: 'date',
      tooltip: am5.Tooltip.new(root, { labelText: '{valueY}' })
    })
  )
  series.bullets.push(() => {
    const bulletCircle = am5.Circle.new(root, {
      radius: 5,
      fill: series.get('fill')
    })
    return am5.Bullet.new(root, { sprite: bulletCircle })
  })

  chart.set('scrollbarX', am5.Scrollbar.new(root, { orientation: 'horizontal' }))

  series.data.setAll(data)

  series.appear(1000)
  chart.appear(1000, 100)

  const cursor = chart.set(
    'cursor',
    am5xy.XYCursor.new(root, {
      behavior: 'zoomX'
    })
  )
  cursor.lineY.set('visible', false)
})

function prepareData(data) {
  return data.map((item) => ({
    ...item,
    date: new Date(item.date).getTime()
  }))
}
</script>

<style scoped>
#chartdiv {
  width: 100%;
  height: 500px;
}
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
