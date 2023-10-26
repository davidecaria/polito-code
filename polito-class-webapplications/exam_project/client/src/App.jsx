import { Navbar } from 'react-bootstrap';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { BrowserRouter, Link, Outlet, Route, Routes, useParams } from 'react-router-dom';
import { listAllPages, listPubPages, checkLogin, doLogout, getUsers, getTitle, updateTitle } from './API';
import { useContext, useEffect, useState } from "react";
import { UserContext } from './UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PageList } from './PageList';
import { ExplorePage } from './ExplorePage';
import { EditOrAddPage } from './EditOrAddPage';
import { LoginForm } from './LoginForm';
import { User } from './modelsFront';


function App() {

  const [pages, setPages] = useState([]);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : {};
  });
  const [realUsers, setRealUsers] = useState([]);
  const [pagesHash, setPagesHash] = useState([]);

  const validateLogin = async (username, password) => {
    const user = await checkLogin(username, password);
    const castedUser = new User(user.userId, user.username, user.name, user.surname, user.type);
    setUser(castedUser);
    localStorage.setItem('user', JSON.stringify(castedUser));
  }

  const handleLogout = async () => {
    await doLogout();
    setUser({});
    localStorage.removeItem('user');
  }

  useEffect(() => {

    if (!user.userId) {
      listPubPages().then((listOfPages) => {
        setPages(listOfPages);
        setPagesHash(listOfPages.map((p) => {
          return p.pageId + p.title + p.author + p.publicationDate;
        }))
      })
    } else {
      listAllPages().then((listOfPages) => {
        setPages(listOfPages);
        setPagesHash(listOfPages.map((p) => {
          return p.pageId + p.title + p.author + p.publicationDate;
        }))
      })
    }
  }, [user]);

  useEffect(() => {
    getUsers().then((res) => {
      // console.log(res);
      setRealUsers(res);
    })
  }, []);

  return <UserContext.Provider value={user}>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout handleLogout={handleLogout} />}>
          <Route index element={<PageList pages={pages} />} />
          <Route path='/login' element={<LoginForm validateLogin={validateLogin} />} />
          <Route path='/blocks/:pageId' element={<ExplorePage pages={pages} setPages={setPages} />} />
          <Route path='/editPage/:pageId' element={<EditOrAddPage pages={pages} realUsers={realUsers} setPages={setPages} setPagesHash={setPagesHash} />} />
          <Route path='/addPage' element={<EditOrAddPage pages={[]} realUsers={realUsers} setPages={setPages} setPagesHash={setPagesHash} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </UserContext.Provider>
}


function MainLayout(props) {

  const user = useContext(UserContext);
  const [oldBrandName, setOldBrandName] = useState('');
  const [editingBrand, setEditingBrand] = useState(false);
  const [brandName, setBrandName] = useState('');

  useEffect(() => {
    getTitle().then((res) => {
      setBrandName(res);
      setOldBrandName(res);
    })
  }, []);

  const handleBrandEdit = () => {
    setEditingBrand(true);
  };

  const handleBrandSave = () => {
    updateTitle(brandName);
    setOldBrandName(brandName);
    setEditingBrand(false);
  };

  const handleBrandCancel = () => {
    setEditingBrand(false);
    setBrandName(oldBrandName);
    // If the user cancels the edit, you can reset the brandName to its previous value
    // You can retrieve the previous value from a state variable or make an API call to fetch it again
  };

  //console.log(user) ;
  return (
    <>
      <header>
        <Navbar sticky="top" variant="dark" bg="primary" expand="lg" className="mb-3">
          <Container>
            {editingBrand ? (
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="form-control mr-2"
              />
            ) : (
              <Navbar.Brand>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                  {brandName}
                </Link>
              </Navbar.Brand>
            )}
            {editingBrand ? (
              <>
                <Button variant="outline-light" onClick={handleBrandCancel} className="mr-2">
                  Cancel
                </Button>
                <Button variant="outline-light" onClick={handleBrandSave}>
                  Save
                </Button>
              </>
            ) : (
              user.type === 'admin' && (
                <Button variant="outline-light" onClick={handleBrandEdit}>
                  Edit Title
                </Button>
              )
            )}

            <Navbar.Text>
              {user.userId ? <span>{user.username} <Link to='/' onClick={props.handleLogout}>Logout</Link></span> : <Link to='/login'>Login</Link>}
            </Navbar.Text>
          </Container>
        </Navbar>
      </header>
      <main>
        <Container>
          <Outlet />
        </Container>
      </main>
    </>
  );
}

export default App