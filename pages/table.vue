<template>
  <div class="container">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Team</th>
          <th scope="col">Match</th>
          <th scope="col">W</th>
          <th scope="col">D</th>
          <th scope="col">L</th>
          <th scope="col">ได้</th>
          <th scope="col">เสีย</th>
          <th scope="col">ต่าง</th>
          <th scope="col">score</th>
          <th scope="col">5 เกมล่าสุด</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(team, $teamIndex) in computeEachTeamData" :key="$teamIndex">
          <td>
            {{$teamIndex+1}} {{ team.name }}
          </td>
          <td>
            {{ team.match }}
          </td>
          <td>
            {{ team.w }}
          </td>
          <td>
            {{ team.d }}
          </td>
          <td>
            {{ team.l }}
          </td>
          <td>
            {{ team.gain }}
          </td>
          <td>
            {{ team.lose }}
          </td>
          <td>
            {{ calDiff(team) }}
          </td>
          <td>
            {{ team.score }}
          </td>
           <td>
             <template  v-for="(record,$recordIndex) in team.records">
              <i 
             :key="'win'+$recordIndex"
             v-if="record=='win'"
             class="bi bi-check"
             />
              <i 
             :key="'lose'+$recordIndex"
             v-if="record=='lose'"
             class="bi bi-x"
             />
            <i 
             :key="'draw'+$recordIndex"
             v-if="record=='draw'"
             class="bi bi-dash"
             />
             </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      footballMatchDatas: [],
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    computeEachTeamData() {
      const computedData= this.footballMatchDatas.reduce((acc, match) => {
        let initialForm = {
          match: 0,
          w: 0,
          d: 0,
          l: 0,
          score: 0,
          gain: 0,
          lose: 0,
          recordIndex:0,
          records:[]
        };
        if (!acc[match.team1]) {
          acc[match.team1] = {
            ...initialForm,
            name: match.team1,
          };
        }
        if (!acc[match.team2]) {
          acc[match.team2] = {
            ...initialForm,
            name: match.team2
          };
        }
        acc[match.team1].match += 1;
        acc[match.team2].match += 1;
        this.computeGainLose(acc, match);
        this.computeMatchScore(acc, match);
        return acc;
      }, {});
      const teamData=Object.values(computedData).sort((a,b)=>a.score>b.score?-1:1)
      return teamData
    },
  },
  methods: {
    async fetchData() {
      try {
        const { data } = await this.$axios.get(
          "https://raw.githubusercontent.com/openfootball/football.json/master/2014-15/en.1.json"
        );
        this.footballMatchDatas = data.rounds.reduce((acc, round) => {
        acc = [...acc, ...round.matches];
        return acc;
      }, []);
      } catch (error) {
        console.log(error);
      }
    },
    calDiff(data) {
      return data.gain - data.lose;
    },
    computeGainLose(acc, match) {
      acc[match.team1].gain += match.score.ft[0];
      acc[match.team1].lose += match.score.ft[1];
      acc[match.team2].gain += match.score.ft[1];
      acc[match.team2].lose += match.score.ft[0];
    },
    computeMatchScore(acc,match) {
      if (match.score.ft[0] > match.score.ft[1]) {
        acc[match.team1].w += 1;
        acc[match.team1].score += 3;
        acc[match.team2].l += 1;
        this.writeRecord(acc[match.team1],'win')
        this.writeRecord(acc[match.team2],'lose')
      }
      if (match.score.ft[0] == match.score.ft[1]) {
        acc[match.team1].d += 1;
        acc[match.team2].d += 1;
        acc[match.team1].score += 1;
        acc[match.team2].score += 1;
       this.writeRecord(acc[match.team1],'draw')
        this.writeRecord(acc[match.team2],'draw')
      }
      if (match.score.ft[0] < match.score.ft[1]) {
        acc[match.team1].l += 1;
        acc[match.team2].w += 1;
        acc[match.team2].score += 3;
        this.writeRecord(acc[match.team1],'lose')
        this.writeRecord(acc[match.team2],'win')
      }
    },
    writeRecord(data,result){
      if(data.recordIndex==5){
        data.recordIndex=0
      }
      data.records[data.recordIndex]=result
      data.recordIndex+=1
    }
  },
};
</script>