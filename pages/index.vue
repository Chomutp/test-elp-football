<template>
  <div>
    <h3>{{ dataClub.name }}</h3>

    <table>
      <thead>
        <tr>
          <th style="width: 300px">สโมสร</th>
          <th>แข่ง</th>
          <th>ชนะ</th>
          <th>เสมอ</th>
          <th>แพ้</th>
          <th>ได้</th>
          <th>เสีย</th>
          <th>ต่าง</th>
          <th>แต้ม</th>
          <th>5 เกมส์ล่าสุด</th>
        </tr>
      </thead>

      <tbody v-for="(item, index) in dataClub.clubs" :key="index" >
        <tr>
          <td>{{ item.name }}</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
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
      dataClub: state => state.dataClub
    })

  },
  mounted() {
    this.$store.dispatch('init')
  },



}
</script>

<style scoped>
</style>
