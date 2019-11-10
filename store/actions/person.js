export const actionTypes = {
  GET_PERSON: 'GET_PERSON',
  GET_PERSON_SUCCESS: 'GET_PERSON_SUCCESS',
  GET_PERSON_FAIL: 'GET_PERSON_FAIL',

  GET_PERSONS: 'GET_PERSONS',
  GET_PERSONS_SUCCESS: 'GET_PERSONS_SUCCESS',
  GET_PERSONS_FAIL: 'GET_PERSONS_FAIL',

  CREATE_PERSON: 'CREATE_PERSON',
  CREATE_PERSON_SUCCESS: 'CREATE_PERSON_SUCCESS',
  CREATE_PERSON_FAIL: 'CREATE_PERSON_FAIL',

  UPDATE_PERSON: 'UPDATE_PERSON',

  DELETE_PERSONS: 'DELETE_PERSONS',
  DELETE_PERSONS_SUCCESS: 'DELETE_PERSONS_SUCCESS',
  DELETE_PERSONS_FAILED: 'DELETE_PERSONS_FAILED',
  SHOW_DUPLICATE_PERSON_MODAL: 'SHOW_DUPLICATE_PERSON_MODAL',
  SET_DUPLICATE_DATA: 'SET_DUPLICATE_DATA',
  PERSONS_INITIAL_STATE: 'PERSONS_INITIAL_STATE',
  UPDATE_PAGINATION: 'UPDATE_PAGINATION',
  UPDATE_SEARCH_TERM: 'UPDATE_SEARCH_TERM',
  UPDATE_SORT: 'UPDATE_SORT',
  UPLOAD_PORTRAIT: 'UPLOAD_PORTRAIT',
  UPLOAD_PORTRAIT_SUCCESS: 'UPLOAD_PORTRAIT_SUCCESS',
  GET_PROFESSIONS: 'GET_PROFESSIONS',
  GET_PROFESSIONS_SUCCESS: 'GET_PROFESSIONS_SUCCESS',
  GET_PROFESSIONS_FAIL: 'GET_PROFESSIONS_FAIL',
  PROFESSIONS_INITIAL_STATE: 'PROFESSIONS_INITIAL_STATE',
  CREATE_PROFESSION: 'CREATE_PROFESSION',
  CREATE_PROFESSION_SUCCESS: 'CREATE_PROFESSION_SUCCESS',
  CREATE_PROFESSION_FAIL: 'CREATE_PROFESSION_FAIL'
}

export const actionCreator = (actionName, payload) => {
  if (!actionTypes[actionName]) {
    throw new Error(`Couldn't find action: ${actionName} in actions`);
  }
  
  return {
    type: actionName,
    payload
  }
}