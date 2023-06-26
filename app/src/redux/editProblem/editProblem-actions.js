import * as actionTypes from "./editProblem-types";

export function setProblem(problem) {
  return {
    type: actionTypes.SET_PROBLEM,
    payload: {
      problem: problem,
    },
  };
}

export function setEditProblemVisibility(visibility) {
  console.log("changing edit modal visibility:"+visibility)
  return {
    type: actionTypes.SET_EDIT_PROBLEM_VISIBILITY,
    payload: {
      visibility: visibility,
    },
  };
}


