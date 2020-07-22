import React from 'react';
import { number } from 'prop-types';
import PersonAPI from 'pages/Person/api';
import ProfessionsAPI from 'pages/Professions/api';
import PersonPage from 'pages/Person';
import WithError from 'shared/components/withError';
import logger from 'utils/logger';

const Person = (props) => (
  <WithError statusCode={props.statusCode}>
    <PersonPage {...props} />
  </WithError>
);

Person.getInitialProps = async (ctx) => {
  const { query, req } = ctx;

  try {
    const personReq = PersonAPI.setCookie(req).getPerson(query.id);
    const professionsReq = ProfessionsAPI.getAllProfessions();
    const { data: person } = await personReq;
    const { data: { professions } } = await professionsReq;

    return {
      person,
      professions
    };
  } catch (error) {
    logger.error(error);
    return {
      statusCode: (error.response && error.response.status) || 500
    };
  }
};

Person.propTypes = {
  statusCode: number
};

Person.defaultProps = {
  statusCode: null
};

export default Person;
