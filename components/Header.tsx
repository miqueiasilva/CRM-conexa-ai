import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="p-4 bg-card rounded-lg shadow-md mb-6">
      <h1 className="text-3xl font-bold text-primary">
        Convexa.AI
      </h1>
      <p className="text-text-secondary mt-1">Painel de Atendimento Inteligente e CRM com WhatsApp</p>
    </header>
  );
};

export default Header;