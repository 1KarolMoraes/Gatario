import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import styled from 'styled-components';
import catSvg from '/cat.svg';

export default function Headbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteAccount = () => {
    alert('Função de excluir conta ainda não implementada.');
  };

  return (
    <Header>
        <Logotype>
          Gatário
          <CatImage src={catSvg} alt="Gatinho" />
        </Logotype>
        <Nav>
            <NavItem onClick={() => navigate('/home')}>Início</NavItem>
            <NavItem onClick={() => navigate('/reminders')}>Lembretes</NavItem>
            <NavItem onClick={() => navigate('/mood')}>Humor</NavItem>
        </Nav>
        <UserMenu>
            <UserButton onClick={() => setMenuOpen(prev => !prev)}>
            <FaUserCircle size={24} />
            <IoMdArrowDropdown />
            </UserButton>
            {menuOpen && (
            <Dropdown>
                <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                <DropdownItem onClick={handleDeleteAccount} danger>Excluir conta</DropdownItem>
            </Dropdown>
            )}
        </UserMenu>
    </Header>
  );
}

const Header = styled.header`
  background-color: #16223A;
  color: white;
  padding: 16px 0px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 100;
`;

const Logotype = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  font-weight: bold;
  font-size: 20px;
  color: white;
  gap: 15px;
`

const CatImage = styled.img`
  width: 30px;
  height: 30px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 200px;
`;

const NavItem = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: 40px;
  background: white;
  color: black;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
  overflow: hidden;
  z-index: 10;
`;

const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 10px 16px;
  border: none;
  background: ${({ danger }) => (danger ? '#fee2e2' : 'white')};
  color: ${({ danger }) => (danger ? '#b91c1c' : 'black')};
  cursor: pointer;

  &:hover {
    background: ${({ danger }) => (danger ? '#fecaca' : '#f3f4f6')};
  }
`;
