import { createSelector } from 'reselect'
import moment from 'moment'
import 'moment-duration-format'
import {indexOf} from 'lodash'

const getEntries = (state) => state.report.entries
const getStartDate = (state) => state.report.startDate
const getEndDate = (state) => state.report.endDate

//Get total effort by day which will show in a bar chart later
export const getSummaryReport = createSelector(
  [getEntries, getStartDate, getEndDate],
  (entries, filterStartDate, filterEndDate) => {
    
    const formatData = (totalDuration, labels, data) => {
      return  {
        totalEffort: moment.duration(totalDuration, "minutes").format("hh:mm"), 
        effortByDayForBarChart: {
          labels,
          data
        }
      }
    }

    const startDate = new Date(filterStartDate)
    const endDate = new Date(filterEndDate)
    if (startDate > endDate) {
      return formatData(0, [], [])
    }

    if (entries && entries.length === 0) {
      let labels = [], data = []

      while (startDate <= endDate) {
        labels.push(moment(startDate).format('Do MMM'))
        data.push(0)
        startDate.setDate(startDate.getDate() + 1)
      }
      return formatData(0, labels, data)
    }

    let labels = [], data = []
    let totalDuration = moment.duration()
    while (startDate <= endDate) {
      labels.push(moment(startDate).format('Do MMM'))

      //sum effort by startDate
      let totalDurationByDay = moment.duration()
      Object.keys(entries).forEach((key) => {
        const entry = entries[key]
        if (moment(entry.startTime).isSame(startDate, 'day')) {
          const ms = moment(entry.endTime).diff(moment(entry.startTime))
          const duration = moment.duration(ms)
          totalDurationByDay.add(duration)
        }
      })
      data.push(totalDurationByDay.asMilliseconds())

      totalDuration.add(totalDurationByDay)

      startDate.setDate(startDate.getDate() + 1)
    }

    return formatData(totalDuration, labels, data)
  }
)

//Get total effort by tag, to show on a doughnut chart
export const getEffortByLangForDoughnutChart = createSelector(
  [getEntries],
  (entries) => {
    const formatData = (langNames, effortByLang, langColors) => {
      return {
        labels: langNames,
        datasets: [{
          data: effortByLang,
          backgroundColor: langColors
        }]
      }
    }

    //get tag list, and effort by tag
    let langNames = [], langColors = [], effortByLang = []
    if (!entries || (entries && entries.length === 0)) {
      return formatData(langNames, effortByLang, langColors)
    }

    const sumEffortByLang = (langId) => {
      let totalDurationByLang = moment.duration()
      Object.keys(entries).forEach(key => {
        const entry = entries[key]
        if (entry.lang === langId) {
          const ms = moment(entry.endTime).diff(moment(entry.startTime))
          const duration = moment.duration(ms)
          totalDurationByLang.add(duration)
        }
      })
      return totalDurationByLang.asMilliseconds()
    }

    Object.keys(entries).forEach(key => {
      const {langName, langColor, lang} = entries[key]
      if (langName && indexOf(langNames, langName) === -1) {
        langNames.push(langName)
        langColors.push(langColor)
        effortByLang.push(sumEffortByLang(lang))
      }
    })

    return formatData(langNames, effortByLang, langColors)
  }
)

