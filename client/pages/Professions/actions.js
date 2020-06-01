import actionCreator from 'utils/actionCreator';

export const actionTypes = {
  PROFESSIONS_INITIAL_STATE: 'PROFESSIONS_INITIAL_STATE',
  
  GET_PROFESSIONS: 'GET_PROFESSIONS',
  GET_PROFESSIONS_SUCCESS: 'GET_PROFESSIONS_SUCCESS',
  GET_PROFESSIONS_FAIL: 'GET_PROFESSIONS_FAIL',

  GET_ALL_PROFESSIONS: 'GET_ALL_PROFESSIONS',
  GET_ALL_PROFESSIONS_SUCCESS: 'GET_ALL_PROFESSIONS_SUCCESS',
  GET_ALL_PROFESSIONS_FAIL: 'GET_ALL_PROFESSIONS_FAIL',

  CREATE_PROFESSION: 'CREATE_PROFESSION',
  CREATE_PROFESSION_SUCCESS: 'CREATE_PROFESSION_SUCCESS',
  CREATE_PROFESSION_FAIL: 'CREATE_PROFESSION_FAIL',

  DELETE_PROFESSIONS: 'DELETE_PROFESSIONS',
  DELETE_PROFESSIONS_SUCCESS: 'DELETE_PROFESSIONS_SUCCESS',
  DELETE_PROFESSIONS_FAIL: 'DELETE_PROFESSIONS_FAIL'
}

export const actions = actionCreator(actionTypes);