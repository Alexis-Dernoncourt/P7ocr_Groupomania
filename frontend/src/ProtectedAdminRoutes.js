import { Navigate, Outlet } from 'react-router-dom';
import { useSelector} from 'react-redux';

const ProtectedAdminRoutes = () => {
    const { userInfos } = useSelector((state) => state.user);
    return userInfos.role === 'moderator' ? <Outlet /> : <Navigate to='/articles' />;
}

export default ProtectedAdminRoutes;
