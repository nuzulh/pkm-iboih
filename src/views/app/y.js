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
  Card,
  CardBody,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import IntlMessages from 'helpers/IntlMessages';
import {
  getPhPendapatanList,
  getPhPendapatanListWithOrder,
  getPhPendapatanListSearch,
  selectedPhPendapatanItemsChange,
  addLoiItem,
  postPhItems,
  getPageItems,
} from 'redux/actions';
import PhPendapatanListItem from 'components/applications/PhPendapatanListItem';
import AddNewPhPendapatanModal from 'containers/applications/AddNewPhPendapatanModal';
import Pagination from 'containers/pages/Pagination';
import Select from 'react-select';
import CustomSelectInput from 'components/common/CustomSelectInput';
import { AvField, AvForm, AvGroup } from 'availity-reactstrap-validation';
import ReactDatePicker from 'react-datepicker';
import CurrencyFormat from 'react-currency-format';
import terbilangRupiah from 'terbilang-rupiah';
import { getPhTemp, setPhTemp } from 'helpers/Utils';
import { useHistory } from 'react-router-dom';
import { adminRoot } from 'constants/defaultValues';
import { NotificationManager } from 'components/common/react-notifications';

const getIndex = (value, arr, prop) => {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][prop] === value) {
      return i;
    }
  }
  return -1;
};

const selectData = [
  { label: 'Penawaran Harga', value: 'ph', key: 0 },
  { label: 'Surat Minat Pembelian', value: 'loi', key: 1 },
  { label: 'Berita Acara Emergency', value: 'bae', key: 2 },
];

const Pendapatan = ({
  match,
  intl,
  phPendapatanItems,
  searchKeyword,
  loading,
  orderColumn,
  orderColumns,
  selectedItems,
  getPhPendapatanListAction,
  getPhPendapatanListWithOrderAction,
  getPhPendapatanListSearchAction,
  selectedPhPendapatanItemsChangeAction,
  addLoiItemAction,
  postPhItemsAction,
  output_schema,
  error,
  token,
  getPageItemsAction,
  pageItems,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownSplitOpen, setDropdownSplitOpen] = useState(false);
  const [displayOptionsIsOpen, setDisplayOptionsIsOpen] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [numberLimit, setNumberLimit] = useState(3);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [phPendapatanPages, setPhPendapatanPages] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedPh, setSelectedPh] = useState(false);
  const [selectedLoi, setSelectedLoi] = useState(false);
  const [selectedBae, setSelectedBae] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [modalAddConfirmOpen, setModalAddConfirmOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [modalSubmitOpen, setModalSubmitOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (phPendapatanItems) {
      setTotalPage(phPendapatanItems.length / 5);
      const filteredItems = phPendapatanItems.slice(
        (currentPage - 1) * 5,
        currentPage * 5
      );
      getPageItemsAction(filteredItems);
    }
  }, [phPendapatanItems, numberLimit, currentPage, getPageItemsAction]);

  useEffect(() => {
    document.body.classList.add('right-menu');
    getPhPendapatanListAction();

    return () => {
      document.body.classList.remove('right-menu');
    };
  }, [getPhPendapatanListAction]);

  useEffect(() => {
    selectedOption.value === 'ph' ? setSelectedPh(true) : setSelectedPh(false);
    selectedOption.value === 'loi'
      ? setSelectedLoi(true)
      : setSelectedLoi(false);
    selectedOption.value === 'bae'
      ? setSelectedBae(true)
      : setSelectedBae(false);
  }, [selectedOption]);

  useEffect(() => {
    if ((output_schema || error) && selectedPh) {
      toggleModalSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [output_schema, error]);

  const onChangePage = (page) => {
    setCurrentPage(page);
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
    selectedPhPendapatanItemsChangeAction(selectedList);

    if (event.shiftKey) {
      let items = phPendapatanItems;
      const start = getIndex(id, items, 'id');
      const end = getIndex(lastChecked, items, 'id');
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedList.push(
        ...items.map((item) => {
          return item.id;
        })
      );
      selectedList = Array.from(new Set(selectedList));
      selectedPhPendapatanItemsChangeAction(selectedList);
    }
  };

  const onLoiSubmit = (event, errors, values) => {
    if (errors.length === 0) {
      const newLoiItems = {
        product: values.product,
        specification: values.specification,
        volume: parseInt(values.volume),
        frequency: parseInt(values.frequency),
        date: startDate,
        delivery: values.delivery,
        payment: values.payment,
      };
      addLoiItemAction(newLoiItems);
    }
  };

  const handleChangeSelectAll = () => {
    if (loading) {
      if (selectedItems.length >= phPendapatanItems.length) {
        selectedPhPendapatanItemsChangeAction([]);
      } else {
        selectedPhPendapatanItemsChangeAction(
          phPendapatanItems.map((x) => x.id)
        );
      }
    }
  };

  const toggleAddConfirm = () => {
    if (selectedItems.length > 0) {
      calculateTotal();
      setModalAddConfirmOpen(!modalAddConfirmOpen);
    } else {
      NotificationManager.warning(
        'Pilih setidaknya 1 (satu) item!',
        'Warning',
        3000,
        null,
        null,
        ''
      );
    }
  };

  const calculateTotal = () => {
    let result = 0;
    phPendapatanItems
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => {
        const price = parseInt(item.price) * parseInt(item.quantity);
        const priceTax = price + price * 0.1;
        result += priceTax;
      });
    setTotal(result);
  };

  const onPhSubmit = () => {
    const payload = phPendapatanItems
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => {
        return {
          quantity: item.quantity,
          price: item.price,
          product_name: item.product_name,
          brand_name: item.brand_name,
        };
      });
    payload.push(token);
    postPhItemsAction(payload);
    toggleAddConfirm();
  };

  const handleDelete = () => {
    const phTemp = getPhTemp();
    let result = [];
    if (phTemp.length > 0) {
      phTemp.map((x) => {
        if (!selectedItems.includes(x.id)) {
          result.push(x);
        }
      });
      setPhTemp(result);
      getPhPendapatanListAction();
      selectedPhPendapatanItemsChangeAction([]);
    }
  };

  const handleChecked = () => {
    if (phPendapatanItems.length === 0) {
      return false;
    } else {
      return selectedItems.length >= phPendapatanItems.length;
    }
  };

  const toggleModalSubmit = () => setModalSubmitOpen(!modalSubmitOpen);

  const { messages } = intl;

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.pendapatan" match={match} />
          <Select
            components={{ Input: CustomSelectInput }}
            className="react-select"
            classNamePrefix="react-select"
            name="form-field-name"
            value={selectedOption}
            onChange={setSelectedOption}
            options={selectData}
          />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        {selectedPh && (
          <Colxx xxs="12" className="mb-4">
            {loading && (
              <div className="text-zero top-right-button-container">
                <Button
                  color="primary"
                  size="lg"
                  className="top-right-button"
                  onClick={() => setModalOpen(true)}
                >
                  <IntlMessages id="ph-pendapatan.add-new" />
                </Button>{' '}
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
                            selectedItems.length < phPendapatanItems.length
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
                    <DropdownItem>
                      <IntlMessages id="ph-pendapatan.edit" />
                    </DropdownItem>
                    <DropdownItem onClick={handleDelete}>
                      <IntlMessages id="ph-pendapatan.delete" />
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
                      <IntlMessages id="ph-pendapatan.orderby" />
                      {orderColumn ? orderColumn.label : ''}
                    </DropdownToggle>
                    <DropdownMenu>
                      {orderColumns.map((o, index) => {
                        return (
                          <DropdownItem
                            key={index}
                            onClick={() =>
                              getPhPendapatanListWithOrderAction(o.column)
                            }
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
                      placeholder={messages['menu.search']}
                      defaultValue={searchKeyword}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          getPhPendapatanListSearchAction(e.target.value);
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
                pageItems.map((item, index) => (
                  <PhPendapatanListItem
                    key={`phPendapatan_item_${index}`}
                    item={item}
                    handleCheckChange={handleCheckChange}
                    isSelected={
                      loading ? selectedItems.includes(item.id) : false
                    }
                  />
                ))
              ) : (
                <div className="loading" />
              )}
            </Row>
            {loading && phPendapatanItems.length > 0 && (
              <div className="d-flex justify-content-end">
                <Button
                  color="success"
                  size="lg"
                  className="top-right-button"
                  onClick={toggleAddConfirm}
                >
                  <IntlMessages id="ph-pendapatan.add-items" />
                </Button>
              </div>
            )}
            <Pagination
              totalPage={totalPage}
              currentPage={currentPage}
              numberLimit={numberLimit}
              lastIsActive={false}
              firstIsActive={false}
              onChangePage={onChangePage}
            />
          </Colxx>
        )}
        {selectedLoi && (
          <Colxx xxs="12" className="mb-4">
            <Card className="mb-5">
              <CardBody>
                <AvForm
                  className="av-tooltip tooltip-label-right"
                  onSubmit={(event, errors, values) =>
                    onLoiSubmit(event, errors, values)
                  }
                >
                  <AvGroup className="error-t-negative">
                    <Label>
                      <IntlMessages id="loi.product" />
                    </Label>
                    <AvField
                      name="product"
                      type="text"
                      validate={{
                        required: {
                          value: true,
                          errorMessage: 'Isian tidak boleh kosong',
                        },
                      }}
                    />
                  </AvGroup>
                  <AvGroup className="error-t-negative">
                    <Label>
                      <IntlMessages id="loi.specification" />
                    </Label>
                    <AvField
                      name="specification"
                      type="text"
                      validate={{
                        required: {
                          value: true,
                          errorMessage: 'Isian tidak boleh kosong',
                        },
                      }}
                    />
                  </AvGroup>
                  <AvGroup className="error-t-negative">
                    <Label>
                      <IntlMessages id="loi.volume" />
                    </Label>
                    <AvField
                      name="volume"
                      type="number"
                      validate={{
                        required: {
                          value: true,
                          errorMessage: 'Isian tidak boleh kosong',
                        },
                      }}
                    />
                  </AvGroup>
                  <AvGroup className="error-t-negative">
                    <Label>
                      <IntlMessages id="loi.frequency" />
                    </Label>
                    <AvField
                      name="frequency"
                      type="number"
                      validate={{
                        required: {
                          value: true,
                          errorMessage: 'Isian tidak boleh kosong',
                        },
                      }}
                    />
                  </AvGroup>
                  <AvGroup className="error-t-negative">
                    <Label>
                      <IntlMessages id="loi.date" />
                    </Label>
                    <ReactDatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                  </AvGroup>
                  <AvGroup className="error-t-negative">
                    <Label>
                      <IntlMessages id="loi.delivery" />
                    </Label>
                    <AvField
                      name="delivery"
                      type="text"
                      validate={{
                        required: {
                          value: true,
                          errorMessage: 'Isian tidak boleh kosong',
                        },
                      }}
                    />
                  </AvGroup>
                  <AvGroup className="error-t-negative">
                    <Label>
                      <IntlMessages id="loi.payment" />
                    </Label>
                    <AvField
                      name="payment"
                      type="text"
                      validate={{
                        required: {
                          value: true,
                          errorMessage: 'Isian tidak boleh kosong',
                        },
                      }}
                    />
                  </AvGroup>
                  <Button color="primary">Submit</Button>
                </AvForm>
              </CardBody>
            </Card>
          </Colxx>
        )}
        {selectedBae && (
          <Colxx xxs="12" className="mb-4">
            <p>BAE</p>
          </Colxx>
        )}
      </Row>
      <AddNewPhPendapatanModal
        toggleModal={() => setModalOpen(!modalOpen)}
        modalOpen={modalOpen}
      />
      <Modal
        isOpen={modalSubmitOpen}
        toggle={toggleModalSubmit}
        wrapClassName="basic"
        backdrop="static"
      >
        <ModalHeader>
          <IntlMessages id={error ? 'general.error' : 'general.success'} />
        </ModalHeader>
        <ModalBody>
          {error ? (
            <p>{error}</p>
          ) : (
            <p>
              Reference Number:
              <br />
              {output_schema}
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              if (!error) handleDelete();
              history.push(adminRoot);
            }}
          >
            OK
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={modalAddConfirmOpen}
        toggle={toggleAddConfirm}
        wrapClassName="basic"
        backdrop="static"
      >
        <ModalHeader toggle={toggleAddConfirm}>
          <IntlMessages id="ph-pendapatan.confirm-add-title" />
        </ModalHeader>
        <ModalBody>
          <IntlMessages id="ph-pendapatan.confirm-add-text-1" />
          <CurrencyFormat
            value={total}
            thousandSeparator={true}
            prefix={'Rp'}
            suffix={',00'}
            displayType={'text'}
            renderText={(value) => <strong>{value}</strong>}
          />
          {` (${terbilangRupiah(total).trim()})`}
          <IntlMessages id="ph-pendapatan.confirm-add-text-2" />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" outline onClick={toggleAddConfirm}>
            <IntlMessages id="ph-pendapatan.cancel" />
          </Button>
          <Button color="success" onClick={onPhSubmit}>
            <IntlMessages id="ph-pendapatan.submit" />
          </Button>{' '}
        </ModalFooter>
      </Modal>
    </>
  );
};

const mapStateToProps = ({ pendapatanApp }) => {
  const {
    phPendapatanItems,
    searchKeyword,
    loading,
    orderColumn,
    orderColumns,
    selectedItems,
    output_schema,
    error,
    token,
    pageItems,
  } = pendapatanApp;
  return {
    phPendapatanItems,
    searchKeyword,
    loading,
    orderColumn,
    orderColumns,
    selectedItems,
    output_schema,
    error,
    token,
    pageItems,
  };
};
export default injectIntl(
  connect(mapStateToProps, {
    getPhPendapatanListAction: getPhPendapatanList,
    getPhPendapatanListWithOrderAction: getPhPendapatanListWithOrder,
    getPhPendapatanListSearchAction: getPhPendapatanListSearch,
    selectedPhPendapatanItemsChangeAction: selectedPhPendapatanItemsChange,
    addLoiItemAction: addLoiItem,
    postPhItemsAction: postPhItems,
    getPageItemsAction: getPageItems,
  })(Pendapatan)
);
