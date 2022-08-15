import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from 'reactstrap';
import { Colxx } from '../common/CustomBootstrap';

const CampingListItem = ({ item, changeStatusAction }) => {
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [reason, setReason] = useState('');

  return (
    <Colxx xxs="12">
      <Card className="card d-flex mb-3">
        <div className="d-flex flex-grow-1 min-width-zero">
          <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
            <div className="list-item-heading mb-0 truncate w-20 w-xs-100 mb-1 mt-1 align-items-center d-flex">
              {item.status === 'pending' && (
                <i
                  style={{ fontSize: '1.5rem' }}
                  className="mr-2 text-primary iconsminds-arrow-refresh"
                />
              )}
              {item.status === 'approved' && (
                <i
                  style={{ fontSize: '1.5rem' }}
                  className="mr-2 text-primary iconsminds-yes"
                />
              )}
              {item.status === 'rejected' && (
                <i
                  style={{ fontSize: '1.5rem' }}
                  className="mr-2 text-primary iconsminds-close"
                />
              )}
              <span className="align-middle d-inline-block">{item.name}</span>
            </div>
            <p className="mb-1 text-muted text-small w-15 w-xs-100">
              {item.pj_name}
            </p>
            <p className="mb-1 text-muted text-small w-15 w-xs-100">
              ID: {item.identity_number}
            </p>
            <p className="mb-1 text-muted text-small w-15 w-xs-100">
              {item.email}
            </p>
            <p className="mb-1 text-muted text-small w-10 w-xs-100">
              {item.inserted_at.split('-').reverse().join('-')}
            </p>
            <div className="w-20 w-xs-100">
              {item.status === 'pending' && (
                <>
                  <Button
                    color="success mr-2"
                    onClick={() => setApproveModalOpen(!approveModalOpen)}
                  >
                    <i className="iconsminds-yes" /> Terima
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => setRejectModalOpen(!rejectModalOpen)}
                  >
                    <i className="iconsminds-close" /> Tolak
                  </Button>
                </>
              )}
              {item.status === 'approved' && (
                <Badge pill color="success">
                  Diterima
                </Badge>
              )}
              {item.status === 'rejected' && (
                <Badge pill color="danger">
                  Ditolak
                </Badge>
              )}
            </div>
          </CardBody>
        </div>
        {item.status === 'rejected' && (
          <div className="card-body pt-1">
            <p className="mb-0">
              <span className="text-muted">Alasan penolakan:</span>
              <br /> {item.reject_reason}
            </p>
          </div>
        )}
      </Card>
      <Modal isOpen={approveModalOpen}>
        <ModalHeader toggle={() => setApproveModalOpen(!approveModalOpen)}>
          Yakin menerima permintaan izin?
        </ModalHeader>
        <ModalBody>
          <li>Nama: {item.name}</li>
          <li>Penanggung Jawab: {item.pj_name}</li>
          <li>No. Identitas: {item.identity_number}</li>
          <li>email: {item.email}</li>
        </ModalBody>
        <ModalFooter>
          <Button
            outline
            onClick={() => setApproveModalOpen(!approveModalOpen)}
          >
            Batal
          </Button>
          <Button
            color="success"
            onClick={() =>
              changeStatusAction({
                id: item.id,
                status: 'approved',
                reject_reason: '',
              })
            }
          >
            Terima
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={rejectModalOpen}>
        <ModalHeader toggle={() => setRejectModalOpen(!rejectModalOpen)}>
          Yakin menolak permintaan izin?
        </ModalHeader>
        <ModalBody>
          <li>Nama: {item.name}</li>
          <li>Penanggung Jawab: {item.pj_name}</li>
          <li>No. Identitas: {item.identity_number}</li>
          <li>email: {item.email}</li>
          <p className="mt-2">Silahkan memasukkan alasan penolakan: </p>
          <Input
            type="textarea"
            onChange={(e) => setReason(e.target.value)}
            value={reason}
          />
        </ModalBody>
        <ModalFooter>
          <Button outline onClick={() => setRejectModalOpen(!rejectModalOpen)}>
            Batal
          </Button>
          <Button
            color="danger"
            onClick={() =>
              changeStatusAction({
                id: item.id,
                status: 'rejected',
                reject_reason: reason,
              })
            }
          >
            Tolak
          </Button>
        </ModalFooter>
      </Modal>
    </Colxx>
  );
};

export default React.memo(CampingListItem);
