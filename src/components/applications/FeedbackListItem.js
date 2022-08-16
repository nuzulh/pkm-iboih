import React from 'react';
import { Card, CardBody, Badge, CustomInput, Button } from 'reactstrap';
import { Colxx } from '../common/CustomBootstrap';

const FeedbackListItem = ({ item, isSelected, handleCheckChange }) => {
  return (
    <Colxx xxs="6">
      <Card className="card d-flex mb-3">
        <div className="d-flex flex-grow-1 min-width-zero">
          <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
            <div className="list-item-heading mb-0 truncate w-40 w-xs-100 mb-1 mt-1 align-items-center d-flex">
              <span className="align-middle d-inline-block">{item.name}</span>
            </div>
            <p className="mb-1 text-muted text-small w-20 w-xs-100">
              {item.inserted_at}
            </p>
            <div className="w-20 w-xs-100">
              <Badge
                color={item.rating <= 3 ? 'warning' : 'success'}
                pill
                style={{ fontSize: '1rem' }}
              >
                {item.rating}
                <i className="simple-icon-star ml-2" />
              </Badge>
            </div>
          </CardBody>
          <div className="custom-control custom-checkbox pl-1 align-self-center mr-4">
            <CustomInput
              className="itemCheck mb-0"
              type="checkbox"
              id={`check_${item.id}`}
              checked={isSelected}
              onChange={(event) => handleCheckChange(event, item.id)}
              label=""
            />
          </div>
        </div>
        <div className="card-body pt-1">
          <p className="mb-0">
            <span className="text-muted">Kritik & Saran:</span>
            <br /> {item.text}
          </p>
        </div>
      </Card>
    </Colxx>
  );
};

export default React.memo(FeedbackListItem);
