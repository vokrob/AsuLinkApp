import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MenuContextType {
  rightMenuVisible: boolean;
  setRightMenuVisible: (visible: boolean) => void;
  toggleRightMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

interface MenuProviderProps {
  children: ReactNode;
}

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const [rightMenuVisible, setRightMenuVisible] = useState(false);

  const toggleRightMenu = () => {
    setRightMenuVisible(!rightMenuVisible);
  };

  return (
    <MenuContext.Provider value={{
      rightMenuVisible,
      setRightMenuVisible,
      toggleRightMenu,
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
