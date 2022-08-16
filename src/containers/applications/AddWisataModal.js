import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap';
import Select from 'react-select';
import CustomSelectInput from 'components/common/CustomSelectInput';
import IntlMessages from 'helpers/IntlMessages';
import { addWisataItem } from 'redux/actions';
import { NotificationManager } from 'components/common/react-notifications';

const initialState = {
  name: '',
  category: {
    label: '',
    value: '',
    key: 0,
  },
  link: '',
};

const AddWisataModal = ({
  modalOpen,
  toggleModal,
  categories,
  addWisataItemAction,
}) => {
  const [state, setState] = useState(initialState);

  const addNewItem = () => {
    if (state.name === '' || state.category.value === '' || state.link === '') {
      NotificationManager.error(
        'Isian tidak boleh kosong!',
        'Error',
        3000,
        null,
        null,
        ''
      );
    } else {
      const newItem = {
        name: state.name,
        category: state.category.value,
        link: state.link,
      };
      addWisataItemAction(newItem);
      toggleModal();
      setState(initialState);
    }
  };

  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      wrapClassName="modal-right"
      backdrop="static"
    >
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id="wisata.add-new-title" />
      </ModalHeader>
      <ModalBody>
        <Label className="mt-4">
          <IntlMessages id="wisata.name" />
        </Label>
        <Input
          type="text"
          defaultValue={state.name}
          onChange={(event) => setState({ ...state, name: event.target.value })}
        />
        <Label className="mt-4">
          <IntlMessages id="wisata.category" />
        </Label>
        <Select
          components={{ Input: CustomSelectInput }}
          className="react-select"
          classNamePrefix="react-select"
          name="form-field-name"
          options={categories.map((x, i) => {
            return { label: x, value: x, key: i };
          })}
          value={state.category}
          onChange={(val) => setState({ ...state, category: val })}
        />
        <Label className="mt-4">
          <IntlMessages id="wisata.link" />
        </Label>
        <InputGroup className="mb-3">
          <InputGroupAddon addonType="prepend">https://</InputGroupAddon>
          <Input
            type="text"
            defaultValue={state.link}
            onChange={(event) => {
              if (
                event.target.value.includes('https://') ||
                event.target.value.includes('http://')
              ) {
                setState({ ...state, link: event.target.value });
              } else {
                setState({ ...state, link: `https://${event.target.value}` });
              }
            }}
          />
        </InputGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={toggleModal}>
          <IntlMessages id="wisata.cancel" />
        </Button>
        <Button color="primary" onClick={() => addNewItem()}>
          <IntlMessages id="wisata.submit" />
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ wisataApp }) => {
  return wisataApp;
};
export default connect(mapStateToProps, {
  addWisataItemAction: addWisataItem,
})(AddWisataModal);
