import { useContext, useState } from 'react';
import './App.css'
import Tablero from './components/Tablero.jsx'
import injectContext, { Context } from './context/appContext';
import FirstStep from './components/FirstStep';

function App() {

  const { store, actions } = useContext(Context);
  //Estados de la matrix:
  //0 = Vacío (No ha habido interacción)
  //1 = Tiro al agua (No le he dado a ningun barco)
  //2 = Hay una sección del barco
  //3 = Tiro en el blanco
  //4 = Disabled

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className='col-12 d-flex flex-column mt-5 min-vh-100'>

            <Tablero player={1} chosenPositionsMatrix={store.baseMatrix} />
            <hr />
            {
              store.gameSteps == 2 ? <Tablero player={2} chosenPositionsMatrix={store.iaTable} /> : null
            }
            {/* <h1 className='text-center'>PC</h1> */}
            {/* <Tablero chosenPositionsMatrix={iaMatrix} /> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default injectContext(App)
