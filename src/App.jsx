import { useContext, useState } from 'react';
import './App.css'
import Tablero from './components/Tablero.jsx'
import injectContext, { Context } from './context/appContext';
import { useEffect } from 'react';

function App() {

  const { store, actions } = useContext(Context);

  //Estados de la matrix:
  //0 = Vacío (No ha habido interacción)
  //1 = Tiro al agua (No le he dado a ningun barco)
  //2 = Hay una sección del barco
  //3 = Tiro en el blanco
  //4 = Disabled
  useEffect(() => {

    if (store.gameSteps > 1 && store.shifter === false) {
      let randomThinkingTime = Math.floor(Math.random() * 2) + 2
      setTimeout(() => {
        actions.iaRandomFirePostition()
        actions.setShifter(!store.shifter)
      }, 500); // `${randomThinkingTime}000`
    }

  }, [store.shifter, store.gameSteps])

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          {
            store.gameSteps === 2 ?
              <>
                <div className='offset-2 col-8 d-flex flex-column'>
                  <h1 className='text-center'>Instrucciones</h1>
                  <ul>
                    <li>
                      Debes atacar el tablero enemigo.
                    </li>
                    <li>
                      El inicio del juego sera para un jugador aleatorio
                    </li>
                    <li>
                      Una vez marcado un slot del tablero enemigo, la CPU empezara a calcular su siguiente movimiento para atacar tu tablero.
                    </li>
                    <li>
                      La CPU disparara aleatoriamente, dependiendo si encuentra una parte de un barco en la posicion marcada, buscara en los slots adyacentes
                    </li>
                    <li>
                      Una vez encontrados todos los barcos en cualquiera de los dos tableros, se mostrara el ganador!
                    </li>
                  </ul>
                </div>
                <hr />
              </>
              : null
          }
          <div className={`col-12 d-flex mt-3 ${store.gameSteps < 2 ? "min-vh-100" : ""}`}>
            {
              store.gameSteps >= 2 ?
                <>
                  <Tablero key={2} player={2} chosenPositionsMatrix={store.iaTable} />
                  <hr />
                </>
                : null
            }
            <Tablero player={1} chosenPositionsMatrix={store.gameSteps < 1 ? store.baseMatrix : store.personalTable} />
          </div>
          {
            store.gameSteps === 2 ?
              <div className='d-flex justify-content-center'>
                <h1>{store.shifter ? "Te toca atacar" : "CPU analizando..."}</h1>
              </div>
              : null
          }
          {
            store.gameSteps === 3 ?
              <div className='text-center mt-2'>
                <h1>{`${store.winner} ha ganado!`}</h1>
                <h4>Puedes reiniciar eñ juego <a href=".">AQUI</a></h4>
              </div>
              : null
          }
        </div>
      </div >
    </>
  )
}

export default injectContext(App)
