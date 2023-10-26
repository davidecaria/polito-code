import { Link, useNavigate } from "react-router-dom";
import { Card, CardGroup, Button, ListGroup, Row, Col, Badge } from 'react-bootstrap';
import { useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { React } from 'react';
import dayjs from 'dayjs';


function PageList(props) {

  const navigate = useNavigate();
  const [sortedPages, setSortedPages] = useState([]);
  const handleCreatePage = () => {
    navigate(`/addPage`);
  };
  const user = useContext(UserContext);
  let index = 0;



  useEffect(() => {

    const notDraft = props.pages.filter((p) => p.publicationDate != "Invalid Date").sort((a, b) => dayjs(a.publicationDate).diff(dayjs(b.publicationDate)));
    const draft = (props.pages.filter((p) => p.publicationDate == "Invalid Date"))
    console.log(notDraft);
    const concatenated = notDraft.concat(draft)
    setSortedPages(concatenated);
  }, [props.pages]);

  // Divide the pages into groups of two
  const groupedPages = [];
  for (let i = 0; i < sortedPages.length; i += 2) {
    groupedPages.push(sortedPages.slice(i, i + 2));
  }

  return (
    <div>
      {groupedPages.map((row, index) => (
        <Row key={index} className="mb-3">
          {row.map((page) => (
            <Col md={6} key={page.pageId}>
              <Card>
                <Card.Body>
                  <div className="d-flex flex-column">
                    <div className="d-flex align-items-center">
                      <h4 className="me-2">{page.title}</h4>
                      <Badge pill bg="primary" className="mb-2">
                        {page.author}
                      </Badge>
                    </div>
                    {page.publicationDate !== "Invalid Date" ? (
                      <p>Publication date: {dayjs(page.publicationDate).format('DD-MM-YYYY')}</p>
                    ) : (
                      <p>Publication date: To be decided</p>
                    )}
                    <p>Creation date : {dayjs(page.creationDate).format('DD-MM-YYYY')}</p>
                    <div className="d-flex align-items-center">
                      <Button variant="primary" href={`/blocks/${page.pageId}`}>
                        Explore Page
                      </Button>
                      <Badge
                        className="ms-2"
                        pill
                        bg={
                          page.publicationDate === "Invalid Date"
                            ? "danger"
                            : page.publicationDate > dayjs().format("YYYY-MM-DD")
                            ? "warning"
                            : "success"
                        }
                      >
                        {page.publicationDate === "Invalid Date"
                          ? "DRAFT"
                          : page.publicationDate > dayjs().format("YYYY-MM-DD")
                          ? "SCHEDULED"
                          : "PUBLISHED"}
                      </Badge>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ))}
      {user.userId && (
        <div className="text-center">
          <Button variant="primary" onClick={handleCreatePage}>
            Create Page
          </Button>
        </div>
      )}
    </div>
  );
  
  
  
}


export { PageList };
