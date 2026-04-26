import { BrowserRouter, Route, Routes } from 'react-router-dom';
import routers from '@/routers/routers';
import { SideBarProvider } from '@/contexts/SideBarProvider';
import SideBar from '@components/SideBar/SideBar';
import { ToastProvider } from '@/contexts/ToastProvider';
import { StoreProvider } from '@/contexts/StoreProvider';

function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <SideBarProvider>
          <BrowserRouter>
            <SideBar />
            <Routes>
              {routers.map((item, index) => {
                return (
                  <Route
                    path={item.path}
                    element={<item.component />}
                    key={index}
                  />
                );
              })}
            </Routes>
          </BrowserRouter>
        </SideBarProvider>
      </ToastProvider>
    </StoreProvider>
  );
}

export default App;
