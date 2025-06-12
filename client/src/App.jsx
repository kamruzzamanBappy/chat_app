import { useContext } from "react"
import { Toaster } from "react-hot-toast"
import { Navigate, Route, Routes } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
  

//toast use for notification
 const App = () => {
const {authUser} = useContext(AuthContext)

   return (
     <div className="bg-[url('./src/assets/bgImage.svg')]">
     <Toaster /> 
     
      <Routes>
        <Route path='/' element={authUser ?    <HomePage /> : <Navigate to="/login"/>} />
  <Route path='/login' element={!authUser ?<LoginPage /> : <Navigate to="/"/> } />
    <Route path='/profile' element={authUser ?<ProfilePage />: <Navigate to="/login"/>} />

      </Routes>
     </div>
   )
 }
 
 export default App