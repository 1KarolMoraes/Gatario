import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "../pages/SignUp/SignUpPage";
import SignIn from "../pages/SignIn/SignInPage";
import HomePage from "../pages/Home/HomePage";
import Moodpage from "../pages/Mood/MoodPage";
import { AuthProvider } from '../contexts/AuthContext';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/mood" element={<Moodpage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
