import { useRoutes} from 'react-router-dom';
import Company from '../components/pages/Company';
import Contact from '../components/pages/Contact';
import Home from '../components/pages/Home';
import NewProject from '../components/pages/NewProject';



export const MainRoutes = () => {
    return useRoutes([
        { path: '/', element: <Home /> },
        { path: '/contact', element: <Contact /> },
        { path: '/company', element: <Company /> },
        { path: '/newproject', element: <NewProject /> },
    ]);
}