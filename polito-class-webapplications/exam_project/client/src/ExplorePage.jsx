import { useNavigate, useParams } from "react-router-dom";
import { Button, Row, Col, Badge, Table, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import { listAllBlocks, deleteBlocks, deletePage, updateTitle, getTitle } from "./API";
import { useContext } from "react";
import { UserContext } from "./UserContext";

import im1 from './images/im1.jpg';
import im2 from './images/im2.jpg';
import im3 from './images/im3.jpg';
import im4 from './images/im4.jpg';

const imageMap = {
  im1: im1,
  im2: im2,
  im3: im3,
  im4: im4,
};

function ExplorePage(props) {
  const { pageId } = useParams();
  const navigate = useNavigate();

  const user = useContext(UserContext);

  const [blocks, setBlocks] = useState([]);
  const [waiting, setWaiting] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [author, setAuthor] = useState();

  let currentPage = props.pages.filter((p) => (p.pageId == pageId))[0];
  useEffect(() => {
    listAllBlocks(pageId).then((list) => {
      setBlocks(list);
      setWaiting(false);
    })
    currentPage = props.pages.filter((p) => (p.pageId == pageId))[0];
    if (currentPage) {
      setAuthor(currentPage.author);
    }

  }, [pageId, props.pages]);

  // auto-delete the error message after 2 seconds
  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => { setErrorMsg('') }, 2000);
    }
  }, [errorMsg]);

  const handleReturnHome = () => {
    navigate('/');
  }

  const checkUserOrAdmin = () => {
    //const currentPage = props.pages.filter((p) => (p.pageId == pageId))[0];
    if (user.type == "Admin" || user.type == "admin") {
      return false;
    }
    if (user.username == author) {
      return false;
    }
    return true;
  }
  const handleDelete = async () => {
    try {
      const deletedBlocks = blocks.filter((b) => b.pageId === currentPage.pageId);
      let x = await deleteBlocks(deletedBlocks);
      // After blocks are deleted, delete the page
      let b = await deletePage(pageId);
      // Frontend visualization
      props.setPages(prevPages => prevPages.filter(page => page.pageId !== currentPage.pageId));
      navigate('/');
    } catch (error) {
      throw new Error(error.message, { cause: error });
    }
  };


  return <div>
    <PageDetails page={currentPage} />
    {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
    <BlockDetails blocks={blocks} />
    <div className="button-container">
      <Button onClick={handleReturnHome}>HOME</Button>
      {!checkUserOrAdmin() ? (
        <div className="admin-buttons" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <Button variant="primary" href={`/editPage/${pageId}`} style={{ flex: '0 0 auto' }}>
            EDIT
          </Button>
          <Button variant="danger" onClick={handleDelete} style={{ flex: '0 0 auto' }}>
            DELETE
          </Button>
        </div>
      ) : null}
    </div>
  </div>
}


function PageDetails(props) {
  return <div className="page-details">
    <Row>
      <Col md={12} className="text-center">
        <h1 className='title'>{props.page ? props.page.title : "Loading..."}</h1>
      </Col>
    </Row>
    <Row>
      <Col md={12} className='text-center'>
        Created by <Badge pill bg='secondary' className="author-boxed">{props.page ? props.page.author : "Loading..."}</Badge>
      </Col>
    </Row>
  </div>
}

function BlockDetails(props) {
  const allBlocks = props.blocks;

  return <div className="block-details">
    {allBlocks
      .sort((a, b) => a.position - b.position) // Sort blocks based on position
      .map((block) => (
        <div key={block.blockId} className="block-item" style={{ marginBottom: '10px' }}>
          <Row className="block-row">
            {block.type === 'header' && (
              <h2 className='header'>{block.content}</h2>
            )}
            {block.type === 'paragraph' && (
              <p>{block.content}</p>
            )}
            {block.type === 'image' && (
              <img src={imageMap[block.content]} alt="Block Image" />
            )}
          </Row>
        </div>
      ))}
  </div>
}


export { ExplorePage };