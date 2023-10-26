'use strict';
import { useNavigate, useParams } from "react-router-dom";
import { listAllBlocks, updateBlocks, addBlocks, deleteBlocks, modifyPage, addPage, getUsers, listAllPages } from "./API";
import { useEffect, useState } from "react";
import { Button, Card, CardGroup, Row, Form, Col, ButtonGroup, Alert, Modal } from 'react-bootstrap';
import { Block } from "./modelsFront";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import dayjs from 'dayjs';


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

function EditOrAddPage(props) {

    const navigate = useNavigate();
    const userR = useContext(UserContext);

    const { pageId } = useParams();
    const [blocks, setBlocks] = useState([]);
    const [blockCopy, setCopyBlocks] = useState([]);
    const [errMsg, setErrMsg] = useState('');

    const [pageTitle, setPageTitle] = useState("");
    const [publicationDate, setPublicationDate] = useState("");
    const [author, setAuthor] = useState("")
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState();
    const [hoveredImage, setHoveredImage] = useState();

    useEffect(() => {
        if (typeof pageId !== 'undefined') {
            //I have a page to edit
            const myPage = props.pages.find((p) => p.pageId == pageId);
            if (myPage) {
                setPageTitle(myPage.title);
                setPublicationDate(myPage.publicationDate);
                setAuthor(myPage.author);
            }
            listAllBlocks(pageId).then((result) => {
                setBlocks(result.sort((a, b) => a.position - b.position));
                setCopyBlocks(result);

            });

        } else {
            setAuthor(userR.username);
        }
    }, [pageId, props.pages]);

    useEffect(() => {
        if (errMsg) {
            setTimeout(() => { setErrMsg('') }, 2000);
        }
    }, [errMsg]);

    const handleSwap = (blockA, val) => {
        const sorted = [...blocks];
        const index = sorted.indexOf(blockA);
        if ((index == 0 && val == -1) || (index == sorted.length - 1 && val == 1)) {

        } else {
            [sorted[index], sorted[index + val]] = [sorted[index + val], sorted[index]];
        }
        setBlocks(sorted);
    };


    const handleContentChange = (blockId, newContent) => {
        setBlocks((prevBlocks) => {
            const updatedBlocks = prevBlocks.map((block) => {
                if (block.blockId === blockId) {
                    return {
                        ...block,
                        content: newContent,
                    };
                }
                return block;
            });
            return updatedBlocks;
        });
    };

    const deletedElements = [];
    const newElements = [];
    const oldElements = [];


    const countTypes = () => {
        let n_headers = 0;
        let n_extras = 0;
        blocks.forEach(element => {
            if (element.type == "header" || element.type == "Header") {
                n_headers += 1;
            }
            else if (element.type == "paragraph" || element.type == "Paragraph" || element.type == 'image' || element.type == 'Image') {
                n_extras += 1;
            }
        });
        if (n_headers == 0 || n_extras == 0) {
            return false;
        }
        else {
            return true;
        }
    };

    const checkFilling = () => {
        let flag = true;
        blocks.forEach((block) => {
            if (block.content.length == 0) {
                flag = false;
            }
        })
        if (pageTitle == "") {
            flag = false;
        }
        return flag;
    }

    const handleAddHeader = () => {
        const updated = [...blocks];
        const maxBlockId = updated.reduce((maxId, obj) => {
            return obj.blockId > maxId ? obj.blockId : maxId;
        }, 0);
        const newHeader = new Block(maxBlockId + 1, pageId, blockCopy.length, "header", "", "")
        updated.push(newHeader);
        setBlocks(updated);
    }

    const handleAddParagraph = () => {
        const updated = [...blocks];
        const maxBlockId = updated.reduce((maxId, obj) => {
            return obj.blockId > maxId ? obj.blockId : maxId;
        }, 0);
        const newParagraph = new Block(maxBlockId + 1, pageId, blockCopy.length, "paragraph", "", "");
        updated.push(newParagraph);
        setBlocks(updated);
    }

    const handleAddImage = () => {
        if (selectedImage) {
            const updated = [...blocks];
            const maxBlockId = updated.reduce((maxId, obj) => {
                return obj.blockId > maxId ? obj.blockId : maxId;
            }, 0);
            const newImage = new Block(maxBlockId + 1, pageId, blockCopy.length, "image", selectedImage, "");
            updated.push(newImage);
            setBlocks(updated);
            setShowModal(false);
            setSelectedImage(null);
        }
    }
    const handleNewImage = () => {
        setShowModal(true);
    };

    const handleImageSelect = (imageKey) => {
        setSelectedImage(imageKey);
    };

    const handleDelete = (block) => {
        const updated = [...blocks];
        updated.splice(updated.indexOf(block), 1);
        setBlocks(updated);
    }

    const handleSave = async () => {


        if (countTypes() == true && checkFilling() == true) {

            for (var i = 0; i < blocks.length; i++) {
                blocks[i].position = i;
            }

            //I look for new blocks and old blocks
            blocks.forEach((block) => {
                const matchingBlock = blockCopy.find((b) => b.blockId === block.blockId);
                //If I can't find the blocks among the original ones the block is new
                if (!matchingBlock) {
                    newElements.push(block);
                } else {
                    oldElements.push(block);
                }
            });

            //I look for the removed blocks
            blockCopy.forEach((block) => {
                const matchingBlock = blocks.find((b) => b.blockId == block.blockId);
                if (!matchingBlock) {
                    deletedElements.push(block);
                }
            })

            try {
                const finalUser = props.realUsers.filter((u) => (u.username == author)).map((u) => u.username)[0];

                if (blockCopy.length == 0) {

                    const pubDate = publicationDate ? publicationDate : "";
                    const newPageId = await addPage(1, pageTitle, finalUser, dayjs().format("YYYY-MM-DD"), pubDate);
                    for (const element of newElements) {
                        element.pageId = newPageId;
                    }
                    addBlocks(newElements);

                }
                else {

                    modifyPage(pageId, pageTitle, finalUser, publicationDate);
                    if (deletedElements.length != 0) {
                        deleteBlocks(deletedElements);
                    }
                    updateBlocks(oldElements);
                    if (newElements.length != 0) {
                        addBlocks(newElements);
                    }

                    const allPages = await listAllPages();
                    props.setPagesHash(allPages.map((p) => {
                        return p.pageId + p.title + p.author + p.publicationDate;
                    }));
                }

            } catch (err) {
                throw new Error(err.message, { cause: err });
            }
            const allPages = await listAllPages();
            props.setPages(allPages);
            navigate('/');
        } else {
            setErrMsg("! FIASCO !");
        }

    }

    const handleCancel = () => {
        if (pageId) {
            navigate(`/blocks/${pageId}`);
        } else {
            navigate(-1);
        }
    }

    const user = useContext(UserContext);

    return (
        <div className="page-container text-center">
            <Row className="mb-4">
                <Col md={6}>
                    <Form.Group controlId="formPageTitle">
                        <Form.Label>Page Title:</Form.Label>
                        <Form.Control
                            type="text"
                            value={pageTitle}
                            onChange={(e) => setPageTitle(e.target.value)}
                            placeholder="Enter page title"
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="formPublicationDate">
                        <Form.Label>Publication Date:</Form.Label>
                        <Form.Control
                            type="date"
                            value={publicationDate}
                            onChange={(e) => setPublicationDate(e.target.value)}
                            placeholder="Enter publication date"
                        />
                    </Form.Group>
                </Col>
            </Row>
            {userR.type === 'admin' ? (
                <Form.Group controlId="formAuthor">
                    <Form.Label>Author:</Form.Label>
                    <Form.Control
                        as="select"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    >
                        {props.realUsers.map((user) => (
                            <option key={user.username} value={user.username}>
                                {user.username}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
            ) : (
                <Form.Group controlId="formAuthor">
                    <Form.Label>Author:</Form.Label>
                    <Form.Control type="text" defaultValue={userR.username} disabled />
                </Form.Group>
            )}
            <div>
                <p></p>
            </div>
            <div className="blocks-container">
                {blocks.map((block) => (
                    <div key={block.blockId} className="block-item">
                        <Row className="block-row">
                            <Form.Group controlId={`formControl-${block.blockId}`}>
                                <div className="debugging">
                                    <Form.Label className="block-label text-center">
                                        {block.type === 'header' && 'Header'}
                                        {block.type === 'paragraph' && 'Paragraph'}
                                        {block.type === 'image' && 'Image'}
                                    </Form.Label>
                                    <Row>
                                        <Col md={2} />
                                        <Col md={7}>
                                            {block.type === 'image' ? (
                                                <div className="image-container">
                                                    <img
                                                        src={imageMap[block.content]}
                                                        alt="Block Image"
                                                        className="block-image"
                                                    />
                                                </div>
                                            ) : (
                                                <Form.Control
                                                    value={block.content}
                                                    onChange={(e) =>
                                                        handleContentChange(block.blockId, e.target.value)
                                                    }
                                                    type="text"
                                                    name="content"
                                                    placeholder={block.content}
                                                    className="content-input"
                                                />
                                            )}
                                        </Col>
                                        <Col md={1} />
                                        <Col md={2}>
                                            <div className="button-container">
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => handleSwap(block, -1)}
                                                >
                                                    UP
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDelete(block)}
                                                >
                                                    DELETE
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => handleSwap(block, 1)}
                                                >
                                                    DOWN
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Form.Group>
                        </Row>
                    </div>
                ))}
            </div>
            <Row className="mt-4">
                <p>
                    <Button onClick={handleAddHeader}>ADD HEADER</Button>{" "}
                    <Button onClick={handleAddParagraph}>ADD PARAGRAPH</Button>{" "}
                    <Button onClick={handleNewImage}>ADD IMAGE</Button>
                </p>
                {errMsg && (
                    <div className="error-message-wrapper">
                        <Alert variant="danger" className="error-message">
                            {errMsg}
                        </Alert>
                    </div>
                )}
                <p>
                    <Button onClick={() => handleSave()}>SAVE</Button>{" "}
                    <Button onClick={handleCancel}>CANCEL</Button>
                </p>
            </Row>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Select an Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="image-options">
                        {Object.keys(imageMap).map((imageKey) => (
                            <img
                                key={imageKey}
                                src={imageMap[imageKey]}
                                alt={`Image ${imageKey}`}
                                className={`image-option ${selectedImage === imageKey ? 'selected' : ''
                                    } ${hoveredImage === imageKey ? 'hovered' : ''}`}
                                onMouseEnter={() => setHoveredImage(imageKey)}
                                onMouseLeave={() => setHoveredImage(null)}
                                onClick={() => handleImageSelect(imageKey)}
                            />
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddImage}>
                        Add Image
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );



}


export { EditOrAddPage }