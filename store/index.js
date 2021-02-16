import Vuex from 'vuex'
import axios from 'axios'
import _ from "lodash"

const store = () => {
  return new Vuex.Store({
    state: {
      dataClub: {},
      dataMatch: {}


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
        dispatch('competitionMatch')

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

      competitionMatch(context) {
        const { state, commit , dispatch } = context
      }


    },
    getters: {
    
    },
  })
}

export default store