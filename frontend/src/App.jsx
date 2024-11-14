import './App.css'
import {createBrowserRouter,createRoutesFromElements,Route,RouterProvider} from 'react-router-dom';
import Navbar from './components/common/Navbar';
import AdminHome from './components/auth/AdminHome';
import Error from './components/common/Error';
import Register from './components/auth/Register';
import UserDashboard from './components/auth/UserDashboard';
import UpdatePassword from './components/auth/UpdatePassword';
import Login from './components/auth/Login';
import LoginUser from './components/auth/LoginUser';
import UserLogin from './components/auth/UserLogin';
import UserRegister from './components/auth/UserRegister';
import ProtectedRoute from './components/protected/ProtectedRoute';
import ForgotPass from './components/auth/ForgotPass';
import ResetPass from './components/auth/ResetPass';
import ProtectedAdminRoute from './components/protected/ProtectedAdminRoute';
import ProtectedUserRoute from './components/protected/ProtectedUserRoute';


const routerObj = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Navbar/>}>
      <Route index element={<Login/>}/>
      <Route path="/admin/register" element={<Register/>}/>
      <Route path="/user/register" element={<ProtectedAdminRoute><UserRegister/></ProtectedAdminRoute>}/>
      <Route path="/login/user" element={<LoginUser/>}/>
      <Route path="/:role/login" element={<UserLogin/>}/>
      <Route path="/dashboard" element={<ProtectedAdminRoute><AdminHome/></ProtectedAdminRoute>}/>
      <Route path="/user/dashboard" element={<ProtectedUserRoute><UserDashboard/></ProtectedUserRoute>}/>
      <Route path="/update-password" element={<ProtectedRoute><UpdatePassword/></ProtectedRoute>}/>
      <Route path="/forgot-password" element={<ForgotPass/>}/>
      <Route path="/reset-password/:token/:role" element={<ResetPass/>}/>
      <Route path="*" element={<Error/>}/>
    </Route>
  )
)

function App() {


  return (
    <>
      <RouterProvider router={routerObj}/>
    </>
  )
}

export default App