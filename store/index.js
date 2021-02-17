import Vuex from 'vuex'
import axios from 'axios'
import _ from "lodash"

const store = () => {
  return new Vuex.Store({
    state: {
      fetchData: {},
      allMatches: [],
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
        dispatch('allCompetition')
        dispatch('calculateMatches')
      },
      fetchMatchData(context) {
        const p = new Promise(async (resolve) => {
          const { state, commit , dispatch } = context
          const response = await axios.get(
            'https://raw.githubusercontent.com/openfootball/football.json/master/2014-15/en.1.json',
          )

          if(response.status == 200) {
            commit('setState', { key: 'fetchData', payload: response.data.rounds})
            resolve()
          }
        })
        return p
      },
      allCompetition(context) {
        const { state, commit } = context
        let allMatches = []

        state.fetchData.forEach(item => {
          const matches = item.matches
          allMatches.push(...matches)
        });

        const sortedDate = allMatches.sort((a, b) => {
          const dateA = a.date.replace('-', '')
          const dateB = b.date.replace('-', '')
          return dateA.localeCompare(dateB)
        })

        commit('setState', { key: 'allMatches', payload: sortedDate })
      },
      calculateMatches(context) {
        const { state, commit } = context

        state.allMatches.forEach(match => {
          const team1 = match.team1
          const team2 = match.team2
          const team1_score = match.score.ft[0]
          const team2_score = match.score.ft[1]

          if(state.fanClubs.find(fc => fc.name == team1) == null) {
            const newClubData = checkClub(team1)
            commit('setState', { key: 'fanClubs', payload: [...state.fanClubs, newClubData]})
          }

          if(state.fanClubs.find(fc => fc.name == team2) == null) {
            const newClubData = checkClub(team2)
            commit('setState', { key: 'fanClubs', payload: [...state.fanClubs, newClubData]})
          }

          const team1_data = state.fanClubs.find(fc => fc.name == team1)
          const gf_team1 = team1_data.gf + team1_score
          const ga_team1 = team1_data.ga + team2_score

          const team2_data = state.fanClubs.find(fc => fc.name == team2)
          const gf_team2 = team2_data.gf + team2_score
          const ga_team2 = team2_data.ga + team1_score


          const new_team1_data = {
            name: team1,
            games: team1_data.games + 1,
            win: team1_score > team2_score ? team1_data.win + 1 : team1_data.win ,
            draw: team1_score == team2_score ? team1_data.draw + 1 : team1_data.draw,
            lose: team1_score < team2_score ? team1_data.lose + 1 : team1_data.lose,
            gf: gf_team1,
            ga: ga_team1,
            gd: gf_team1 - ga_team1,
            point: team1_score > team2_score ? team1_data.point + 3 : team1_score == team2_score ? team1_data.point + 1 : team1_data.point,
            history: team1_score > team2_score ? [...team1_data.history, 'WIN'] : team1_score == team2_score ? [...team1_data.history, 'DRAW'] : [...team1_data.history, 'LOSE']
          }

          const new_team2_data = {
            name: team2,
            games: team2_data.games + 1,
            win: team1_score < team2_score ? team2_data.win + 1 : team2_data.win,
            draw: team1_score == team2_score ? team2_data.draw + 1 : team2_data.draw,
            lose: team1_score > team2_score ? team2_data.lose + 1 : team2_data.lose,
            gf: gf_team2,
            ga: ga_team2,
            gd: gf_team2 - ga_team2,
            point: team1_score < team2_score ? team2_data.point + 3 : team1_score == team2_score ? team2_data.point + 1 : team2_data.point,
            history: team1_score < team2_score ? [...team2_data.history, 'WIN'] : team1_score == team2_score ? [...team2_data.history, 'DRAW'] : [...team2_data.history, 'LOSE']
          }

          const filtered= state.fanClubs.filter(fc => fc.name !== team1 && fc.name !== team2)
          commit('setState', { key: 'fanClubs', payload: [...filtered, new_team1_data, new_team2_data]})

        })

        const sorted = state.fanClubs.sort((a, b) => b.point - a.point)
        commit('setState', { key: 'fanClubs', payload: sorted})
      },
    },
  })
}

export default store

function checkClub(teamName) {
  const newFanClub = {
    name: teamName,
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

  return newFanClub
  
}



function calMatchScore(params) {
  
}
