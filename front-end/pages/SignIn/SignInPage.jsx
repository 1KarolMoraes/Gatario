import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/Api';
import ToastifyContainer from '../../components/Toastify';
import { toast } from 'react-toastify';
import catSvg from '/cat.svg';

export default function SignIn() {
  const { login, username } = useAuth();
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if(username){
      navigate("/home");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    api.signIn(formData)
       .then((res) => {
          login(res.data.user.username);
          setFormData({ email: '', password: '' });
          navigate("/home");
       })
       .catch((err) => {
          const errorMsg = err.response?.data?.message || 'E-mail ou senha incorretos';
          toast.error(errorMsg);
       })
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Logotype>
          Gatário
          <CatImage src={catSvg} alt="Gatinho" />
        </Logotype>
        <Input 
          type="email" 
          name="email" 
          placeholder="E-mail" 
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input 
          type="password" 
          name="password" 
          placeholder="Senha" 
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button type="submit">Entrar</Button>
        <StyledLink to='/signUp'>Ainda não tem conta? Clique aqui</StyledLink>
      </Form>
      <ToastifyContainer/>
    </Container>
  );
}

// styled-components

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background-color: #eef2f3;
`;

const Logotype = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-weight: bold;
  font-size: 4em;
  color: #16223A;
  gap: 10px;
`

const CatImage = styled.img`
  width: 175px;
  height: 175px;
`;

const Form = styled.form`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #16223A;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #357ABD;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  text-align: center;
  color: #16223A;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;
