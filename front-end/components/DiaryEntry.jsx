import { FaTrash } from "react-icons/fa";
import { RxUpdate } from "react-icons/rx";
import styled from 'styled-components';
import api from "../services/Api";
import { useState } from "react";

export default function DiaryEntry({ filteredEntries, onChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(filteredEntries.message);

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleUpdate = () => {
    const body = { 
      username: filteredEntries.username,
      date: filteredEntries.date,
      hour: filteredEntries.hour,
      new_message: editedMessage
    };

    api.updateDiaryMessage(body)
      .then((res) => {
        setIsEditing(false);
        onChange();
      })
      .catch(() => console.log("Erro ao atualizar"));
  };

  const handleDelete = () => {
    const body = { 
      username: filteredEntries.username,
      date: filteredEntries.date,
      hour: filteredEntries.hour
    };

    api.deleteDiaryByUsernameAndDate(body)
      .then(() => onChange())
      .catch(() => console.log("Erro ao deletar"));
  };

  return (
    <Entry>
      <Infos>
        <EntryHeader>{filteredEntries.hour}</EntryHeader>
        {isEditing ? (
          <>
            <textarea
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              rows={3}
            />
            <button onClick={handleUpdate}>Salvar</button>
          </>
        ) : (
          <Message>{filteredEntries.message}</Message>
        )}
      </Infos>
      <Actions>
        <RxUpdate onClick={handleEditToggle} />
        <FaTrash onClick={handleDelete} />
      </Actions>
    </Entry>
  );
}

const Entry = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f8f8f8;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
`;

const EntryHeader = styled.div`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 0.5rem;
`;

const Message = styled.div`
  font-size: 1.1rem;
  color: #333;
`;

const Infos = styled.div`
    display: flex;
    flex-direction: column;
`

const Actions = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;