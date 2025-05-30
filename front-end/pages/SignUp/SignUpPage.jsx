import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/Api';
import ToastifyContainer from '../../components/Toastify';
import { toast } from 'react-toastify';
import catSvg from '/cat.svg';

export default function SignUp() {
  const navigate = useNavigate()
  const { username } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if(username){
      navigate("/home");
    }
  }, [])

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    api.signUp(formData)
       .then((res) => {
          alert(res.data)
          setFormData({ username: '', email: '', password: '' });
          navigate("/");
       })
       .catch((err) => {
        toast.error(err.response.data.error)
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
          type="text" 
          name="username" 
          placeholder="Apelido" 
          value={formData.username}
          onChange={handleChange}
          required
        />
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
        <Button type="submit">Cadastrar</Button>
        <StyledLink to='/'>Já possui conta? Clique aqui</StyledLink>
      </Form>
      <ToastifyContainer></ToastifyContainer>
    </Container>
  );
}

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
  background-color: #fff;
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