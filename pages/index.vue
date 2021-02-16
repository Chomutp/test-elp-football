<template>
  <div style="margin: 20px">
    <table>
      <thead style="text-align: left">
        <tr>
          <th>No.</th>
          <th style="width: 300px">สโมสร</th>
          <th style="width: 50px">แข่ง</th>
          <th style="width: 50px">ชนะ</th>
          <th style="width: 50px">เสมอ</th>
          <th style="width: 50px">แพ้</th>
          <th style="width: 50px">ได้</th>
          <th style="width: 50px">เสีย</th>
          <th style="width: 50px">ต่าง</th>
          <th style="width: 50px">แต้ม</th>
          <th>5 เกมส์ล่าสุด</th>
        </tr>
      </thead>

      <tbody v-for="(item, index) in fanClubs" :key="index" >
        <tr>
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.games }}</td>
          <td>{{ item.win }}</td>
          <td>{{ item.draw }}</td>
          <td>{{ item.lose }}</td>
          <td>{{ item.gf }}</td>
          <td>{{ item.ga }}</td>
          <td>{{ item.gd }}</td>
          <td>{{ item.point }}</td>
          <td>{{ item.history.slice(-5).reverse() }}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      fanClubs: state => state.fanClubs
    })

  },
  mounted() {
    this.$store.dispatch('init')
  },



}
</script>

<style scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tbody > tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
