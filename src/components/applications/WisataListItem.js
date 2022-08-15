import React, { useState } from 'react';
import { Card, CardBody, Badge, CustomInput, Button } from 'reactstrap';
import { Colxx } from '../common/CustomBootstrap';

const WisataListItem = ({ item, handleCheckChange, isSelected }) => {
  const [baseUrl] = useState('https://api.qrserver.com/v1/create-qr-code/');
  const [siteId] = useState(item.id);
  const [articleUrl] = useState(item.link);
  const [countUrl] = useState(
    `https://api.visitiboih.com/app.php?visit=${siteId}&link=${articleUrl}`
  );
  const [qrUrl] = useState(
    `${baseUrl}?data=${encodeURIComponent(countUrl)}!&size=400x400`
  );

  return (
    <Colxx xxs="12">
      <Card className="card d-flex mb-3">
        <div className="d-flex flex-grow-1 min-width-zero">
          <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
            <div className="list-item-heading mb-0 truncate w-40 w-xs-100 mb-1 mt-1 align-items-center d-flex">
              {item.category === 'Alam' && (
                <i
                  style={{ fontSize: '2rem' }}
                  className="mr-2 text-primary iconsminds-palm-tree"
                />
              )}
              {item.category === 'Monumen' && (
                <i
                  style={{ fontSize: '2rem' }}
                  className="mr-2 text-primary iconsminds-eifel-tower"
                />
              )}
              {item.category === 'Kuliner' && (
                <i
                  style={{ fontSize: '2rem' }}
                  className="mr-2 text-primary iconsminds-cocktail"
                />
              )}
              <span className="align-middle d-inline-block">{item.name}</span>
            </div>
            <p className="mb-1 text-muted text-small w-15 w-xs-100">
              {item.category}
            </p>
            <p className="mb-1 text-muted text-small w-30 w-xs-100">
              https://visitiboih.com/{item.link}
            </p>
            <div className="w-25 w-xs-100">
              {
                // eslint-disable-next-line react/jsx-no-target-blank
                <a href={qrUrl} target="_blank" download={item.name}>
                  <Button outline color="dark">
                    <i className="iconsminds-qr-code"> QR Code</i>
                  </Button>
                </a>
              }
            </div>
            <div className="w-15 w-xs-100">
              <Badge color="warning" pill>
                Pengunjung: {item.visit_count}
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
      </Card>
    </Colxx>
  );
};

export default React.memo(WisataListItem);
