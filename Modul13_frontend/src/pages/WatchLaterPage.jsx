import { useEffect, useState } from "react";
import {
  Alert,
  Col,
  Container,
  Row,
  Spinner,
  Stack,
  Button,
  Form,
} from "react-bootstrap";
import { GetMyWatchLater, DeleteWatchLater } from "../api/apiWatchLater";
import { getThumbnail } from "../api";
import ModalDeleteWatchLater from "../components/modals/ModalDeleteWatchLater";

const WatchLaterPage = () => {
  const [watchLater, setWatchLater] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");

  const fetchContents = (filter = "") => {
    setIsLoading(true);
    GetMyWatchLater(filter)
      .then((data) => {
        setWatchLater(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFilterChange = (event) => {
    const filterValue = event.target.value;
    setSelectedFilter(filterValue);
    fetchContents(filterValue);
  };

  useEffect(() => {
    fetchContents();
  }, []);
  return (
    <Container className="mt-4">
      <Stack direction="horizontal" gap={3} className="mb-3">
        <h1 className="h4 fw-bold mb-0 text-nowrap text-light">
          Watch Later Videos
        </h1>
        <hr className="border-top border-light opacity-50 w-100" />
        <Form.Select
          size="sm"
          className="w-25"
          onChange={handleFilterChange}
          value={selectedFilter}>
          <option selected disabled>
            Filter Watch Later
          </option>
          <option value="">Semua Video</option>
          <option value="today">Hari ini</option>
          <option value="yesterday"> Kemarin</option>
          <option value="this_month">Bulan ini</option>
          <option value="this_year">Tahun ini</option>
        </Form.Select>
      </Stack>
      {isLoading ? (
        <div className="text-center">
          <Spinner
            as="span"
            animation="border"
            variant="primary"
            size="lg"
            role="status"
            aria-hidden="true"
          />
          <h6 className="mt-2 mb-0">Loading...</h6>
        </div>
      ) : watchLater?.length > 0 ? (
        <div className="">
          {watchLater?.map((watchLater) => (
            <Row className="mt-1" key={watchLater.id}>
              <Col className="mb-3">
                <div className="card h-100 justify-content-center">
                  <div className="card-body m-0 p-0">
                    <Row>
                      <Col className="col-auto">
                        <img
                          src={getThumbnail(watchLater.content.thumbnail)}
                          className="card-img object-fit-cover bg-light"
                          alt="..."
                          style={{ maxWidth: "200px", aspectRatio: "16 / 9" }}
                        />
                      </Col>
                      <Col className="p-2">
                        <Row>
                          <h5 className="card-title text-truncate">
                            {watchLater.content.title}
                          </h5>
                        </Row>
                        <Row>
                          <Col>
                            <p className="card-text">
                              {watchLater.content.description}
                            </p>
                          </Col>
                        </Row>
                      </Col>
                      <Col className="m-2">
                        <Row>
                          <Col>
                            <p className="text-end">
                              Tanggal Ditambahkan: {watchLater.date_added}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="text-end">
                            <ModalDeleteWatchLater
                              id={watchLater.id}
                              onClose={fetchContents}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          ))}
        </div>
      ) : (
        <Alert variant="dark" className="text-center">
          Tidak ada video untukmu saat ini ☹️
        </Alert>
      )}
    </Container>
  );
};
export default WatchLaterPage;
