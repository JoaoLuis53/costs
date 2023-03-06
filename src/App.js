import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Container from './components/Layout/Container';
import Footer from './components/Layout/Footer';
import { NavBar } from './components/Layout/NavBar';
import Company from './components/pages/Company';
import Contact from './components/pages/Contact';
import  Home  from './components/pages/Home';
import NewProject from './components/pages/NewProject';
import Project from './components/pages/Project';
import Projects from './components/pages/projects';

function App() {
  return (
    <div>
        <Router>
                 <NavBar />
                 <Container customClass="min-height">
                     <Routes>
                         <Route exact path={"/"} element={<Home />} />
                         <Route path={"/projects"} element={<Projects/>} /> 
                         <Route path={"/company"} element={<Company />} />  
                         <Route path={"/contact"} element={<Contact />}/>
                         <Route path={"/newproject"} element={<NewProject />}/>
                         <Route path={"/project/:id"} element={<Project />}/>
                     </Routes>
             </Container>
             <Footer />
             
        </Router>
    </div>
  
  );
}

export default App;
