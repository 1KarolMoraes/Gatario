import { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import FormatDate from '../../utils/formatDate';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DiaryEntry from '../../components/DiaryEntry';
import api from '../../services/Api';
import Headbar from '../../components/HeadBar';

export default function HomePage() {
  const { username } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reload, setReload] = useState(0);

  useEffect(() => {

    if(!username) navigate('/');

    const fetchEntries = async () => {
      api.getDiaryByUsername(username)
         .then(res => setEntries(res.data))
         .catch(err => {})
    };

    fetchEntries();
  }, [reload]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date(); 
    const newEntry = {
      username: username,
      date: format(now, 'dd/MM/yyyy'),
      hour: format(now, 'HH:mm:ss'),
      message: newMessage
    };

    api.createDiaryMessage(newEntry)
       .then((res) => {
          setNewMessage('');
          setReload(prev => prev + 1);
       })
       .catch((err) => {
          alert(err.response)
       })
       .finally(() => {
          setNewMessage('');
       })
  };

  const handleReload = () => setReload(prev => prev + 1);

  const filteredEntries = entries.filter(
    (entry) => entry.date === format(selectedDate, 'dd/MM/yyyy')
  );

  return (
    <PageContainer>
      <Headbar></Headbar>
      <Container>
        <Title>
          Bem-vindo{'(a)'}, {username}
        </Title>

        <Form onSubmit={handleSubmit}>
          <TextArea
            placeholder="Escreva aqui o que achar necessário..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            required
          />
          <Button type="submit">Salvar anotação</Button>
        </Form>

        <Section>
          <Label>Selecionar data:</Label>
          <StyledDatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
          />
        </Section>

        <EntriesContainer>
          <DateTitle>{FormatDate(selectedDate)}</DateTitle>
          {filteredEntries.length === 0 ? (
            <NoEntry>Sem anotações para esta data.</NoEntry>
          ) : (
            filteredEntries.map((entry, index) => (
              <DiaryEntry filteredEntries={entry} key={index} onChange={handleReload}></DiaryEntry>
            ))
          )}
        </EntriesContainer>
      </Container>
    </PageContainer>
  );
}

// styled-components

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
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
`;

const StyledDatePicker = styled(DatePicker)`
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TextArea = styled.textarea`
  resize: none;
  height: 100px;
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

const EntriesContainer = styled.div`
  margin-top: 2rem;
`;

const DateTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const NoEntry = styled.div`
  font-style: italic;
  color: #999;
`;
