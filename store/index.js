import Vuex from 'vuex'
import axios from 'axios'
import _ from "lodash"

const store = () => {
  return new Vuex.Store({
    state: {
      dataMatch: {},
      fanClubs: []
    },
    mutations: {
      setState(state, { key, payload }) {
        state[key] = payload
      },
    },
    actions: {
      async init({dispatch}) {
        await dispatch('fetchMatchData')
        dispatch('competition')

      },
      fetchMatchData(context) {
        const p = new Promise(async (resolve) => {
          const { state, commit , dispatch } = context
          const response = await axios.get(
            'https://raw.githubusercontent.com/openfootball/football.json/master/2014-15/en.1.json',
          )

          if(response.status == 200) {
            commit('setState', { key: 'dataMatch', payload: response.data.rounds})
            resolve()
          }
        })
        
        return p
      },

      competition(context) {
        const { state, commit , dispatch } = context

        let allMatches = []

        state.dataMatch.forEach(item => {
          const matches = item.matches
          allMatches.push(...matches)
        });

        const sortedDate = allMatches.sort((a, b) => {
          const dateA = a.date.replace('-', '')
          const dateB = b.date.replace('-', '')

          return dateA.localeCompare(dateB)
        })


        console.log("allMatches ===>",allMatches)
        console.log("sortedDate ====>", sortedDate)

        const mockData = [{
          name: 'xxxx',
          games: 10,
          win: 12,
          draw: 3,
          lose: 2,
          gf: 45,
          ga: 8,
          gd: 37,
          point: 89,
          history: ['win', 'lose', 'win']
        }]


        sortedDate.forEach(match => {
          // console.log(match.date)
          const team1 = match.team1
          const team2 = match.team2
          const team1_score = match.score.ft[0]
          const team2_score = match.score.ft[1]

          if(state.fanClubs.find(fc => fc.name == team1) == null) {
            const newFanClub = {
              name: team1,
              games: 0,
              win: 0,
              draw: 0,
              lose: 0,
              gf: 0,
              ga: 0,
              gd: 0,
              point: 0,
              history: []
            }

            commit('setState', { key: 'fanClubs', payload: [...state.fanClubs, newFanClub]})
          }

          if(state.fanClubs.find(fc => fc.name == team2) == null) {
            const newFanClub = {
              name: team2,
              games: 0,
              win: 0,
              draw: 0,
              lose: 0,
              gf: 0,
              ga: 0,
              gd: 0,
              point: 0,
              history: []
            }

            commit('setState', { key: 'fanClubs', payload: [...state.fanClubs, newFanClub]})
          }

          if(team1_score > team2_score) {
            const team1_data = state.fanClubs.find(fc => fc.name == team1)
            const gf_team1 = team1_data.gf + team1_score
            const ga_team1 = team1_data.ga + team2_score

            const team2_data = state.fanClubs.find(fc => fc.name == team2)
            const gf_team2 = team2_data.gf + team2_score
            const ga_team2 = team2_data.ga + team1_score

            const new_team1_data = {
              name: team1,
              games: team1_data.games + 1,
              win: team1_data.win + 1,
              draw: team1_data.draw ,
              lose: team1_data.lose,
              gf: gf_team1,
              ga: ga_team1,
              gd: gf_team1 - ga_team1,
              point: team1_data.point + 3,
              history: [...team1_data.history, 'WIN']
            }

            const new_team2_data = {
              name: team2,
              games: team2_data.games + 1,
              win: team2_data.win,
              draw: team2_data.draw ,
              lose: team2_data.lose + 1,
              gf: gf_team2,
              ga: ga_team2,
              gd: gf_team2 - ga_team2,
              point: team2_data.point,
              history: [...team2_data.history, 'LOSE']
            }


            const filtered= state.fanClubs.filter(fc => fc.name !== team1 && fc.name !== team2)
            commit('setState', { key: 'fanClubs', payload: [...filtered, new_team1_data, new_team2_data]})

          } else if (team1_score == team2_score){
            const team1_data = state.fanClubs.find(fc => fc.name == team1)
            const gf_team1 = team1_data.gf + team1_score
            const ga_team1 = team1_data.ga + team2_score

            const team2_data = state.fanClubs.find(fc => fc.name == team2)
            const gf_team2 = team2_data.gf + team2_score
            const ga_team2 = team2_data.ga + team1_score

            const new_team1_data = {
              name: team1,
              games: team1_data.games + 1,
              win: team1_data.win,
              draw: team1_data.draw + 1,
              lose: team1_data.lose,
              gf: gf_team1,
              ga: ga_team1,
              gd: gf_team1 - ga_team1,
              point: team1_data.point + 1,
              history: [...team1_data.history, 'DRAW']
            }

            const new_team2_data = {
              name: team2,
              games: team2_data.games + 1,
              win: team2_data.win,
              draw: team2_data.draw + 1,
              lose: team2_data.lose,
              gf: gf_team2,
              ga: ga_team2,
              gd: gf_team2 - ga_team2,
              point: team2_data.point + 1,
              history: [...team2_data.history, 'DRAW']
            }



            const filtered= state.fanClubs.filter(fc => fc.name !== team1 && fc.name !== team2)
            commit('setState', { key: 'fanClubs', payload: [...filtered, new_team1_data, new_team2_data]})


          } else {

            const team1_data = state.fanClubs.find(fc => fc.name == team1)
            const gf_team1 = team1_data.gf + team1_score
            const ga_team1 = team1_data.ga + team2_score

            const team2_data = state.fanClubs.find(fc => fc.name == team2)
            const gf_team2 = team2_data.gf + team2_score
            const ga_team2 = team2_data.ga + team1_score

            const new_team1_data = {
              name: team1,
              games: team1_data.games + 1,
              win: team1_data.win,
              draw: team1_data.draw,
              lose: team1_data.lose + 1,
              gf: gf_team1,
              ga: ga_team1,
              gd: gf_team1 - ga_team1,
              point: team1_data.point,
              history: [...team1_data.history, 'LOSE']
            }

            const new_team2_data = {
              name: team2,
              games: team2_data.games + 1,
              win: team2_data.win + 1,
              draw: team2_data.draw,
              lose: team2_data.lose,
              gf: gf_team2,
              ga: ga_team2,
              gd: gf_team2 - ga_team2,
              point: team2_data.point + 3,
              history: [...team2_data.history, 'WIN']
            }

            const filtered= state.fanClubs.filter(fc => fc.name !== team1 && fc.name !== team2)
            commit('setState', { key: 'fanClubs', payload: [...filtered, new_team1_data, new_team2_data]})

          }
        })

        const sorted = state.fanClubs.sort((a, b) => b.point - a.point)
        commit('setState', { key: 'fanClubs', payload: sorted})

        console.log(state.fanClubs)





      },
    },
  })
}

export default store
