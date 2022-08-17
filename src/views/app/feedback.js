import React, { useEffect, useState } from 'react';
import {
  Row,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
  CustomInput,
} from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import FeedbackListItem from 'components/applications/FeedbackListItem';
import api from 'data/api';
import { getCurrentUser } from 'helpers/Utils';
import { NotificationManager } from 'components/common/react-notifications';

const getIndex = (value, arr, prop) => {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][prop] === value) {
      return i;
    }
  }
  return -1;
};

const Feedback = ({ match }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [lastChecked, setLastChecked] = useState(null);
  const [dropdownSplitOpen, setDropdownSplitOpen] = useState(false);

  const getData = async () => {
    setLoading(true);
    const user = getCurrentUser();
    await api
      .get('service/feedback.php', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        if (!response.error && response.data.data !== null) {
          setData(response.data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async () => {
    const user = getCurrentUser();
    selectedItems.map(async (id) => {
      await api
        .delete(`service/feedback.php?id=${id}`, {
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
              `Feedback Berhasil dihapus!`,
              'Berhasil',
              2000,
              null,
              null,
              ''
            );
            setSelectedItems([]);
            setData([]);
            getData();
          }
        })
        .catch((error) => console.log(error));
    });
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
    setSelectedItems(selectedList);

    if (event.shiftKey) {
      let items = data;
      const start = getIndex(id, items, 'id');
      const end = getIndex(lastChecked, items, 'id');
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedList.push(
        ...items.map((item) => {
          return item.id;
        })
      );
      selectedList = Array.from(new Set(selectedList));
      setSelectedItems(selectedList);
    }
  };

  const handleChecked = () => {
    if (data.length === 0) {
      return false;
      // eslint-disable-next-line no-else-return
    } else {
      return selectedItems.length >= data.length;
    }
  };

  const handleChangeSelectAll = () => {
    if (!loading) {
      if (selectedItems.length >= data.length) {
        setSelectedItems([]);
      } else {
        setSelectedItems(data.map((x) => x.id));
      }
    }
  };

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.feedback" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12" className="mb-4">
          {!loading && (
            <div className="text-zero top-right-button-container">
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
                          selectedItems.length < data.length
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
                  <DropdownItem onClick={handleDelete}>
                    <IntlMessages id="wisata.delete" />
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </div>
          )}
        </Colxx>
        {loading ? (
          <div className="loading" />
        ) : (
          <Colxx>
            <Row>
              {data.map((item) => (
                <FeedbackListItem
                  key={item.id}
                  item={item}
                  handleCheckChange={handleCheckChange}
                  isSelected={
                    !loading ? selectedItems.includes(item.id) : false
                  }
                />
              ))}
            </Row>
          </Colxx>
        )}
      </Row>
    </>
  );
};

export default Feedback;
