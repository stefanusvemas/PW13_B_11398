import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { useState } from "react";
import { DeleteWatchLater } from "../../api/apiWatchLater";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const ModalDeleteWatchLater = ({ id, onClose }) => {
  const [show, setShow] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const handleClose = () => {
    setShow(false);
    onClose();
  };
  const hapusWatchLater = async (id) => {
    console.log(id);
    setIsPending(true);
    DeleteWatchLater(id)
      .then((response) => {
        setIsPending(false);
        toast.success(response.message);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        setIsPending(false);
        toast.warning(err.message);
      });
  };
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        className="btn btn-danger btn-sm position-absolute bottom-0 end-0 m-3"
        onClick={handleShow}>
        <FaTrashAlt />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <p>Apakah kamu yakin ingin menghapus ini dari watch later?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Batal
          </Button>
          <Button
            variant="danger"
            type="submit"
            disabled={isPending}
            onClick={() => hapusWatchLater(id)}>
            {isPending ? (
              <>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Loading...
              </>
            ) : (
              <span>Hapus</span>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalDeleteWatchLater;
