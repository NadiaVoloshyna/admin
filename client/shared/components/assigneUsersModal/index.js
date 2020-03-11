import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import UsersApi from 'shared/api/users';
import PersonApi from 'pages/person/api';
import { actions } from 'pages/person/actions';
import { actions as sharedActions } from 'shared/actions';

const AssigneUsersModal = ({ personId, documentId, role, as, assignedUsers = [] }) => {
  const dispatch = useDispatch();
  const [ isOpen, setIsOpen ] = useState(false);
  const [ users, setUsers ] = useState([]);

  const toggleIsOpen = () => setIsOpen(!isOpen);

  const getUsers = () => {
    dispatch(sharedActions.toggleIsLoading());

    UsersApi.getUsersByRole(role)
      .then(response => response.json())
      .then(users => {
        const availableForAssignment = users.map(({ _id, email }) => ({
          _id,
          email,
          assigned: assignedUsers.some(item => item.user._id === _id)
        }))
        setUsers(availableForAssignment);
        dispatch(sharedActions.toggleIsLoading());
      })
      .catch(error => {
        // TODO: handle error
        console.error(error);
        dispatch(sharedActions.toggleIsLoading());
      });
  };

  const assignUsers = () => {
    dispatch(sharedActions.toggleIsLoading());
    toggleIsOpen();

    PersonApi.updatePermissions(role, users, documentId, personId)
      .then(response => response.json())
      .then(response => {
        dispatch(actions.setPermission(response));
        dispatch(sharedActions.toggleIsLoading());
      })
      .catch(error => {
        // TODO: handle error
        console.error(error);
        dispatch(sharedActions.toggleIsLoading());
      });
  }

  const onUserSelect = ({ _id }) => {
    const selectedUsers = users.map(item => {
      return {
        ...item,
        assigned: item._id === _id && !item.assigned
      }
    })
    setUsers(selectedUsers);
  }

  return (
    <>
      { as &&
        <div onClick={toggleIsOpen}>
          { as }
        </div>
      }

      { !as &&
        <Button 
          size="sm"
          variant="outline-secondary" 
          onClick={toggleIsOpen}
        >
          Assign { role }
        </Button>
      }
      
      <Modal 
        show={isOpen}
        onHide={toggleIsOpen}
        onEntering={getUsers}
        size="lg"
      >
        <Modal.Body>
          <ListGroup>
            { users.map(item => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col> { item.fullName } </Col>
                  <Col className="text-right">
                    <Form.Check
                      type="checkbox"
                      id={`checkbox-${item._id}`}
                      checked={item.assigned}
                      onChange={() => onUserSelect(item)}
                    />
                  </Col>
                </Row>
              </ListGroup.Item>
            )) }
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="success"
            onClick={assignUsers}
          >Assign</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AssigneUsersModal;