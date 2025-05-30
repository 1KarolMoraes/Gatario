import { useState, useEffect } from 'react';
import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/Api';
import Headbar from '../../components/HeadBar';

export default function Moodpage() {
  const { username } = useAuth();
  const navigate = useNavigate();
  const [moods, setMoods] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reload, setReload] = useState(0);

  useEffect(() => {

    if(!username) navigate('/');

    const fetchMood = async () => {
      api.getMoodByUsername(username)
         .then(res => setMoods(res.data))
         .catch(err => {})
    };

    fetchMood();
  }, [reload]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date(); 
    const newMood = {
      username: username,
      date: format(now, 'dd/MM/yyyy'),
      image_url: newImageUrl
    };

    api.createMood(newMood)
       .then((res) => {
          setNewImageUrl('');
          setReload(prev => prev + 1);
       })
       .catch((err) => {
          alert(err.response)
       })
       .finally(() => {
          setNewImageUrl('');
       })
  };

  const handleReload = () => setReload(prev => prev + 1);

  const filteredEntries = moods.filter(
    (entry) => entry.date === format(selectedDate, 'dd/MM/yyyy')
  );

  return (
    <PageContainer>
      <Headbar></Headbar>
      <Container>
        <Title>
          Seu humor de hoje
        </Title>
        <ImageContainer>
            {filteredEntries[0] ? <Image src={filteredEntries[0].image_url}></Image> : <TextImage>Adicione algo para representar você no dia de hoje</TextImage>}
        </ImageContainer>
        <Form onSubmit={handleSubmit}>
          <TextArea
            placeholder="Escreva aqui a url da imagem que te representa hoje"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            required
          />
          <Button type="submit">Salvar imagem</Button>
        </Form>
      </Container>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  width: auto;
  height: auto;
`

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  margin-top: 60px;
  padding: 1rem;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  text-align: center;
  color: #333;
`;

const TextImage = styled.div`
  font-size: 1.8rem;
  text-align: center;
  color: #ccc;
  padding: 50px;
`

const ImageContainer = styled.div`
    display: flex;
    justify-content: center;
    padding: 20px;
`

const Image = styled.img`
    width: 500px;
    height: 500px;
    object-fit: contain;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TextArea = styled.textarea`
  resize: none;
  height: 20px;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  align-self: flex-end;
  padding: 0.5rem 1rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #357ABD;
  }
`;
