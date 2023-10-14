import React from 'react'

function DeleteChallengeComponent({challenge}) {

  console.log(challenge)
  return (
    <div class="flex w-full p-2 bg-gray-200 rounded-md m-2 align-middle">
      <div class="flex w-4/5 justify-start align-middle">
        <p class="font-semibold">{challenge.title}</p>
      </div>
      <div class="w-1/5 flex ">
        <button class="bg-red-500 rounded-md p-2 flex w-1/3 h-1/2  shadow-xl">
          <p class="text-white font-bold text-center">x</p>
        </button>
      </div>

    </div>
  )
}

export default DeleteChallengeComponent