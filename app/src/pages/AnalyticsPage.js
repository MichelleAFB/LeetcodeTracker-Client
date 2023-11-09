import React from 'react'
import StreakChart from '../components/StreakChart'
import Challenges from '../components/Challenges'
import { MonthChart } from '../components/MonthChart'


function AnalyticsPage() {
  return (
    <div class="flex w-full h-screen justify-center ">
     <div class="flex-col ">
        
      <MonthChart/>
      <StreakChart/>
     </div>
      




    </div>
  )
}

export default AnalyticsPage