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

import {
  editWisataItem,
  getWisataList,
  selectedWisataItemsChange,
} from 'redux/actions';
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

const EditWisataModal = ({
  modalOpen,
  toggleModal,
  selectedItems,
  categories,
  editWisataItemAction,
  getWisataListAction,
  selectedWisataItemsChangeAction,
  wisataItems,
}) => {
  const [state, setState] = useState(initialState);

  const editItem = () => {
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
      editWisataItemAction([selectedItems[0], newItem]);
      toggleModal();
      setState(initialState);
      getWisataListAction();
      selectedWisataItemsChangeAction([]);
    }
  };

  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      wrapClassName="modal-right"
      backdrop="static"
    >
      <ModalHeader toggle={toggleModal}>Edit Wisata</ModalHeader>
      <ModalBody>
        <Label className="mt-4">
          <IntlMessages id="wisata.name" />
        </Label>
        <Input
          type="text"
          defaultValue={wisataItems
            .filter((x) => x.id === selectedItems[0])
            .map((i) => i.name)}
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
          defaultValue={{
            label: wisataItems
              .filter((x) => x.id === selectedItems[0])
              .map((i) => i.category),
            value: wisataItems
              .filter((x) => x.id === selectedItems[0])
              .map((i) => i.category),
            key: categories.indexOf(
              wisataItems
                .filter((x) => x.id === selectedItems[0])
                .map((i) => i.category)
            ),
          }}
          onChange={(val) => setState({ ...state, category: val })}
        />
        <Label className="mt-4">
          <IntlMessages id="wisata.link" />
        </Label>
        <InputGroup className="mb-3">
          <InputGroupAddon addonType="prepend">https://</InputGroupAddon>
          <Input
            type="text"
            defaultValue={wisataItems
              .filter((x) => x.id === selectedItems[0])
              .map((i) => i.link)}
            onChange={(event) => {
              if (
                event.target.value.includes('https://') ||
                event.target.value.includes('http://')
              ) {
                setState({ ...state, link: event.target.value });
              } else {
                setState({
                  ...state,
                  link: `https://${event.target.value}`,
                });
              }
            }}
          />
        </InputGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={toggleModal}>
          <IntlMessages id="wisata.cancel" />
        </Button>
        <Button color="primary" onClick={() => editItem()}>
          Edit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ wisataApp }) => {
  const { selectedItems, wisataItems, categories, loading } = wisataApp;
  return { selectedItems, wisataItems, categories, loading };
};
export default connect(mapStateToProps, {
  editWisataItemAction: editWisataItem,
  getWisataListAction: getWisataList,
  selectedWisataItemsChangeAction: selectedWisataItemsChange,
})(EditWisataModal);
