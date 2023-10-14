import React from 'react'
import SettingsSideBar from '../components/SettingsSideBar'
import EnvironmentVariables from '../components/Settings/EnvironmentVariables'
import Billing from '../components/Settings/Billing'
import { useState } from 'react'
function SettingsPage() {
  const[environmentVariables,setEnvironmentVariables]=useState(true)
  
  const [billing,setBilling]=useState(false)
  return (
    <div class="flex h-screen">
      <div class="ml-0 mt-0 mb=0 h-screen w-1/6 bg-gray-200">
        <div class="flex-col p-3 w-full">
          <button class="flex w-full" onClick={()=>{
              setEnvironmentVariables(true)
              setBilling(false)
          }}>
            <p class="font-semibold text-center">Environment</p>
          </button>
          <button class="flex w-full" onClick={()=>{
            setBilling(true)
            setEnvironmentVariables(false)
          }}>
            <p class="font-semibold text-center">Billing</p>
          </button>
        </div> 
    </div>
    <div class="flex w-5/6">
          {
            environmentVariables?
            <EnvironmentVariables/>
            :
            <div></div>
          }
          {
            billing ?
            <Billing/>
            :
            <div></div>
          }

        </div>
    </div>
  )
}

export default SettingsPage