import * as actionTypes from "./addLeetcodeProblem-types";

export function setLeetcodeProblem(problem) {
  return {
    type: actionTypes.SET_LEETCODE_PROBLEM,
    payload: {
      problem: problem,
    },
  };
}

export function setLeetcodeProblemVisibility(visibility) {
  console.log("changing edit modal visibility:"+visibility)
  return {
    type: actionTypes.SET_LEETCODE_PROBLEM_VISIBILITY,
    payload: {
      visibility: visibility,
    },
  };
}