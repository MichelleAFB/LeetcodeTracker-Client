import {combineReducers} from 'redux'
import { editProblemReducer } from './editProblem/editProblem-reducer'
import { leetcodeProblemReducer } from './addLeetcodeProblem.js/addLeetcodeProblem-actions'
export const rootReducer=combineReducers({
  editProblem:editProblemReducer,
  leetcodeProblem:leetcodeProblemReducer
})