import Vuex from 'vuex'
import axios from 'axios'
import _ from "lodash"

const store = () => {
  return new Vuex.Store({
    state: {
      dataClub: {},
      dataMatch: {},
      fanClubs: []


    },
    mutations: {
      setState(state, { key, payload }) {
        state[key] = payload
      }
    },
    actions: {
      async init({dispatch}) {
        await dispatch('fetchClubData')
        await dispatch('fetchMatchData')
        dispatch('competition')

      },
      fetchClubData(context) {
        const p = new Promise(async (resolve) => {
          const { state, commit , dispatch } = context
          const response = await axios.get(
            'https://raw.githubusercontent.com/openfootball/football.json/master/2014-15/en.1.clubs.json',
          )

          if(response.status == 200) {
            commit('setState', { key: 'dataClub', payload: response.data})
            resolve()
          }
        })
        
        return p
      },
      fetchMatchData(context) {
        const p = new Promise(async (resolve) => {
          const { state, commit , dispatch } = context
          const response = await axios.get(
            'https://raw.githubusercontent.com/openfootball/football.json/master/2014-15/es.1.json',
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

        console.log(allMatches)

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


        allMatches.forEach(match => {
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

            const new_team1_data = {
              name: team1,
              games: team1_data.games + 1,
              win: team1_data.win + 1,
              draw: team1_data.draw ,
              lose: team1_data.lose,
              gf: gf_team1,
              ga: ga_team1,
              gd: gf_team1 - ga_team1,
              point: team1_data.win + 3,
              history: ['WIN']
            }





          } else if (team1_score == team2_score){


          } else {

          }
        })

        console.log(fanClubs)





      },
    },
  })
}

export default store
