import {combineReducers} from 'redux'
import { editProblemReducer } from './editProblem/editProblem-reducer'
import { leetcodeProblemReducer } from './addLeetcodeProblem.js/addLeetcodeProblem-actions'
import { editUserReducer } from './user/editUser-reducer'
import { settingsReducer } from './settings/settings-reducer'
import { editChallengeReducer } from './editChallenge.js/editChallenge-reducer'
import { editFollowersAndFollowingReducer } from './editFollowersAndFollowing/editFollowersAndFollowing-reducer'
import { addOtherUsersProblemReducer } from './addOtherUsersProblem/addOtherUsersProblem-actions'
import { groupChallengeReducer } from './groupChallangeRequest/groupChallenge-reducer'
export const rootReducer=combineReducers({
  editProblem:editProblemReducer,
  user:editUserReducer,
  leetcodeProblem:leetcodeProblemReducer,
  settings:settingsReducer,
  editChallenge:editChallengeReducer,
  editFollowersAndFollowing:editFollowersAndFollowingReducer,
  addOtherUsersProblem:addOtherUsersProblemReducer,
  groupChallenge:groupChallengeReducer
})