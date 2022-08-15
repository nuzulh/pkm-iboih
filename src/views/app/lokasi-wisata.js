/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import {
  Row,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  ButtonDropdown,
  CustomInput,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import {
  getWisataList,
  getWisataWithOrder,
  getWisataSearch,
  selectedWisataItemsChange,
} from 'redux/actions';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import WisataListItem from 'components/applications/WisataListItem';
import AddWisataModal from 'containers/applications/AddWisataModal';
import api from 'data/api';
import { getCurrentUser } from 'helpers/Utils';
import { NotificationManager } from 'components/common/react-notifications';
import EditWisataModal from 'containers/applications/EditWisataModal';

const getIndex = (value, arr, prop) => {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][prop] === value) {
      return i;
    }
  }
  return -1;
};

const LokasiWisata = ({
  match,
  loading,
  selectedItems,
  wisataItems,
  searchKeyword,
  orderColumn,
  orderColumns,
  getWisataListAction,
  getWisataWithOrderAction,
  getWisataSearchAction,
  selectedWisataItemsChangeAction,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownSplitOpen, setDropdownSplitOpen] = useState(false);
  const [displayOptionsIsOpen, setDisplayOptionsIsOpen] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [selectedNames, setSelectedNames] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    getWisataListAction();
  }, [getWisataListAction]);

  useEffect(() => {
    if (wisataItems !== null) {
      const names = wisataItems
        .filter((item) => selectedItems.includes(item.id))
        .map((x) => x.name);
      setSelectedNames(names);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  const handleChangeSelectAll = () => {
    if (loading) {
      if (selectedItems.length >= wisataItems.length) {
        selectedWisataItemsChangeAction([]);
      } else {
        selectedWisataItemsChangeAction(wisataItems.map((x) => x.id));
      }
    }
  };

  const handleChecked = () => {
    if (wisataItems.length === 0) {
      return false;
      // eslint-disable-next-line no-else-return
    } else {
      return selectedItems.length >= wisataItems.length;
    }
  };

  const handleCheckChange = (event, id) => {
    if (lastChecked == null) {
      setLastChecked(id);
    }

    let selectedList = Object.assign([], selectedItems);
    if (selectedList.includes(id)) {
      selectedList = selectedList.filter((x) => x !== id);
    } else {
      selectedList.push(id);
    }
    selectedWisataItemsChangeAction(selectedList);

    if (event.shiftKey) {
      let items = wisataItems;
      const start = getIndex(id, items, 'id');
      const end = getIndex(lastChecked, items, 'id');
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedList.push(
        ...items.map((item) => {
          return item.id;
        })
      );
      selectedList = Array.from(new Set(selectedList));
      selectedWisataItemsChangeAction(selectedList);
    }
  };

  const handleDelete = () => {
    const user = getCurrentUser();
    selectedItems.map(async (id) => {
      await api
        .delete(`service/site.php?id=${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((response) => {
          if (response.data.error) {
            NotificationManager.error(
              response.data.data.message,
              'Gagal',
              2000,
              null,
              null,
              ''
            );
          } else {
            NotificationManager.success(
              `Lokasi ${response.data.data.name} Berhasil dihapus!`,
              'Berhasil',
              2000,
              null,
              null,
              ''
            );
            setDeleteModalOpen(!deleteModalOpen);
            selectedWisataItemsChangeAction([]);
            getWisataListAction();
          }
        })
        .catch((error) => console.log(error));
    });
  };

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.lokasi-wisata" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12" className="mb-4">
          {loading && (
            <div className="text-zero top-right-button-container">
              <Button
                color="primary"
                size="lg"
                className="top-right-button mr-2"
                onClick={() => setModalOpen(true)}
              >
                <IntlMessages id="wisata.add-new" />
              </Button>
              <ButtonDropdown
                isOpen={dropdownSplitOpen}
                toggle={() => setDropdownSplitOpen(!dropdownSplitOpen)}
              >
                <div className="btn btn-primary btn-lg pl-4 pr-0 check-button check-all">
                  <CustomInput
                    className="custom-checkbox mb-0 d-inline-block"
                    type="checkbox"
                    id="checkAll"
                    checked={handleChecked()}
                    onClick={() => handleChangeSelectAll()}
                    onChange={() => handleChangeSelectAll()}
                    label={
                      <span
                        className={`custom-control-label ${
                          selectedItems.length > 0 &&
                          selectedItems.length < wisataItems.length
                            ? 'indeterminate'
                            : ''
                        }`}
                      />
                    }
                  />
                </div>
                <DropdownToggle
                  caret
                  color="primary"
                  className="dropdown-toggle-split btn-lg"
                />
                <DropdownMenu right>
                  <DropdownItem
                    onClick={() => {
                      if (selectedItems.length > 1) {
                        NotificationManager.warning(
                          'Pilih hanya 1 item untuk edit!',
                          'Warning',
                          3000,
                          null,
                          null,
                          ''
                        );
                      } else if (selectedItems.length < 1) {
                        NotificationManager.warning(
                          'Pilih 1 item!',
                          'Warning',
                          3000,
                          null,
                          null,
                          ''
                        );
                      } else {
                        setEditModalOpen(!editModalOpen);
                      }
                    }}
                  >
                    <IntlMessages id="wisata.edit" />
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      if (selectedItems.length > 0) {
                        setDeleteModalOpen(!deleteModalOpen);
                      } else {
                        NotificationManager.warning(
                          'Pilih setidaknya 1 item!',
                          'Warning',
                          3000,
                          null,
                          null,
                          ''
                        );
                      }
                    }}
                  >
                    <IntlMessages id="wisata.delete" />
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </div>
          )}
          <div className="mb-2">
            <Button
              color="empty"
              className="pt-0 pl-0 d-inline-block d-md-none"
              onClick={() => setDisplayOptionsIsOpen(!displayOptionsIsOpen)}
            >
              <i className="simple-icon-arrow-down align-middle" />
            </Button>
            <Collapse
              id="displayOptions"
              className="d-md-block"
              isOpen={displayOptionsIsOpen}
            >
              <div className="d-block mb-2 d-md-inline-block">
                <UncontrolledDropdown className="mr-1 float-md-left btn-group mb-1">
                  <DropdownToggle caret color="outline-dark" size="xs">
                    <IntlMessages id="wisata.orderby" />
                    {orderColumn ? orderColumn.label : ''}
                  </DropdownToggle>
                  <DropdownMenu>
                    {orderColumns.map((o) => {
                      return (
                        <DropdownItem
                          key={o.label}
                          onClick={() => getWisataWithOrderAction(o.column)}
                        >
                          {o.label}
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </UncontrolledDropdown>
                <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                  <input
                    type="text"
                    name="keyword"
                    id="search"
                    placeholder="Cari..."
                    defaultValue={searchKeyword}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        getWisataSearchAction(e.target.value);
                      }
                    }}
                  />
                </div>
              </div>
            </Collapse>
          </div>
          <Separator className="mb-5" />
          <Row>
            {loading ? (
              wisataItems.map((item) => (
                <WisataListItem
                  key={item.id}
                  item={item}
                  category={item.category}
                  handleCheckChange={handleCheckChange}
                  isSelected={loading ? selectedItems.includes(item.id) : false}
                />
              ))
            ) : (
              <div className="loading" />
            )}
          </Row>
        </Colxx>
      </Row>
      <AddWisataModal
        toggleModal={() => setModalOpen(!modalOpen)}
        modalOpen={modalOpen}
      />
      <EditWisataModal
        toggleModal={() => setEditModalOpen(!editModalOpen)}
        modalOpen={editModalOpen}
      />
      <Modal isOpen={deleteModalOpen}>
        <ModalHeader toggle={() => setDeleteModalOpen(!deleteModalOpen)}>
          Hapus lokasi wisata
        </ModalHeader>
        <ModalBody>
          <strong>Yakin menghapus lokasi wisata berikut?</strong>
          {selectedNames.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button
            outline
            onClick={() => {
              setDeleteModalOpen(!deleteModalOpen);
              selectedWisataItemsChangeAction([]);
            }}
          >
            Batal
          </Button>
          <Button color="danger" onClick={handleDelete}>
            Hapus
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

const mapStateToProps = ({ wisataApp }) => {
  const {
    wisataItems,
    searchKeyword,
    loading,
    orderColumn,
    orderColumns,
    selectedItems,
    icon,
    error,
  } = wisataApp;
  console.log(wisataApp);
  return {
    wisataItems,
    searchKeyword,
    loading,
    orderColumn,
    orderColumns,
    selectedItems,
    icon,
    error,
  };
};
export default injectIntl(
  connect(mapStateToProps, {
    getWisataListAction: getWisataList,
    getWisataWithOrderAction: getWisataWithOrder,
    getWisataSearchAction: getWisataSearch,
    selectedWisataItemsChangeAction: selectedWisataItemsChange,
  })(LokasiWisata)
);
