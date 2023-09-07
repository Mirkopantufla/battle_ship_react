import { useContext, useEffect, useState } from 'react'
import { Context } from '../context/appContext'
import Ships from './Ships'
import '../styles/tablero.css'
import Square from './Square'

const Tablero = ({ chosenPositionsMatrix, player }) => {

    const initialShips = [
        { id: 0, name: 'extraLargeShip', slots: 5, positionX: 0, positionY: 0, direction: true, setted: false },
        { id: 1, name: 'largeShip', slots: 4, positionX: 0, positionY: 0, direction: true, setted: false },
        { id: 2, name: 'mediumShip1', slots: 3, positionX: 0, positionY: 0, direction: true, setted: false },
        { id: 3, name: 'mediumShip2', slots: 3, positionX: 0, positionY: 0, direction: true, setted: false },
        { id: 4, name: 'smallShip', slots: 2, positionX: 0, positionY: 0, direction: true, setted: false }
    ]

    const { store, actions } = useContext(Context);

    const [ships, setShips] = useState(initialShips);

    const [table, setTable] = useState(JSON.parse(JSON.stringify(chosenPositionsMatrix)));

    const [showMyShips, setShowMyShips] = useState(false);

    useEffect(() => {

        if (store.gameSteps <= 1) {
            checkAllSelected()
        }

        if (checkWinner() === true) {
            actions.setSteps(store.gameSteps + 1)
            player === 1 ? actions.setWinner("CPU") : actions.setWinner("Player 1")
        }

    }, [table])

    useEffect(() => {

        if (store.gameSteps > 1 && player === 1) {
            setTable(store.personalTable)
        }

    }, [store.personalTable])

    //Estados de la matrix:
    //0 = Vacío (No ha habido interacción)
    //1 = Tiro al agua (No le he dado a ningun barco)
    //2 = Hay una sección del barco
    //3 = Tiro en el blanco
    //4 = Disabled

    const checkAllSelected = () => {
        let counter = 0

        ships.map((ship) => {
            ship.setted == true ? counter++ : null
        })

        //Chequeara si estan todos los barcos seleccionados solo si el paso es 2 o menos
        if (counter == 5 && store.gameSteps < 2) {
            console.log("readyToStart")
            actions.setPersonalTable(JSON.parse(JSON.stringify(table)))
            actions.setIaTable()
            actions.setSteps()
        }
    }

    const checkWinner = () => {

        let contador = 0;
        for (let row = 1; row < table.length; row++) {
            for (let col = 1; col < table[row].length; col++) {

                table[row][col] === 3 ? contador++ : null

            }
        }

        if (contador === 17) {
            return true
        } else {
            return false
        }
    }

    const setGameBoard = (row, column, tableCopy) => {

        const shipsCopy = [...ships]

        const selectedShip = store?.selectedShip || 0

        //Me indica el id del barco seleccionado, el cual me indica a la vez la posicion dentro del array de barcos base.
        let position = store.selectedShip.id

        if (actions.checkValidPosition(selectedShip.direction, selectedShip.slots, row, column)) {
            return console.log('Hay un problema')
        }

        //Funcion que pinta las lineas en el tablero del barco seleccionado
        //Condicionado a  dirección del barco (hacia abajo true, hacia la derecha false) y si no ha sido seteado
        if (selectedShip.direction === true && !selectedShip.setted) {

            for (let i = 0; i < selectedShip.slots; i++) {
                tableCopy[row + i][column] = 2
            }

            setTable(JSON.parse(JSON.stringify(tableCopy)))
            shipsCopy[position].positionX = row
            shipsCopy[position].positionY = column
            shipsCopy[position].setted = true
            shipsCopy[position].direction = true
            setShips(shipsCopy)

            actions.setSelectedShip({})
        } else if (selectedShip.direction === false && !selectedShip.setted) {

            for (let i = 0; i < selectedShip.slots; i++) {
                tableCopy[row][column + i] = 2
            }
            setTable(JSON.parse(JSON.stringify(tableCopy)))

            shipsCopy[position].positionX = row
            shipsCopy[position].positionY = column
            shipsCopy[position].setted = true
            shipsCopy[position].direction = false
            setShips(shipsCopy)

            //Limpio el context de selectedShip
            actions.setSelectedShip({})
        }

    }

    const updateValue = (row, column) => {

        const tableCopy = JSON.parse(JSON.stringify(table))

        //Si los valores del espacio a actualizar son 1, 3 o 4, que retorne
        if (tableCopy[row][column] == 1 || tableCopy[row][column] == 3 || tableCopy[row][column] == 4) {
            return
        }

        if (store.gameSteps > 1 && store.shifter === false || store.gameSteps > 1 && player === 1) {
            return
        }

        //Si el paso del juego es menor o igual a 1, se pueden posicionar piezas dentro del tablero
        //Asi se evita activaciones posteriores al paso 1 y reutilizar la misma funcion que es llamada por cada cuadrado del tablero.
        store.gameSteps <= 1 ? setGameBoard(row, column, tableCopy) : null


        //Los valores podran ser actualizados SOLO en el paso 2
        if (store.gameSteps === 2) {
            //Se activa la funcion para el cambio de turno una vez iniciado el juego
            actions.setShifter()

            if (tableCopy[row][column] == 2) {
                tableCopy[row][column] = 3
                setTable(JSON.parse(JSON.stringify(tableCopy)))
                actions.updateIaTable(tableCopy)
            } else if (tableCopy[row][column] == 0) {
                tableCopy[row][column] = 1
                setTable(JSON.parse(JSON.stringify(tableCopy)))
                actions.updateIaTable(tableCopy)
            } else {

            }
        }

    }

    return (

        <div className={`${store.gameSteps < 2 ? "offset-2 col-8 py-4" : "col-md-6 py-6"}`}>
            <div className={`d-flex flex-column justify-content-center align-items-center ${store.gameSteps >= 2 ? "d-none" : ""}`}>
                <h1>BattleShip</h1>
                <h4>Bienvenido al juego, a continuación algunas reglas e indicaciones:</h4>
                <ul>
                    <li>
                        Debes posicionar tus barcos al principio del juego haciendo Click encima de sus respectivos recuadros (barcos)
                    </li>
                    <li>
                        Despues de seleccionar uno, debes indicar el cuadrado donde vas a posicionarlo, ten en consideración
                        que el barco EMPEZARA desde el cuadro marcado hacia la dirección indicada
                    </li>
                    <li>
                        El barco NO PUEDE salir del tablero ni tampoco pasar por encima de otros barcos, de cometer algun error el sistema no posicionara el barco seleccionado.
                    </li>
                    <li>
                        Para girar la orientacion del barco, debes hacerle doble click encima del barco.
                    </li>
                    <li>
                        Una vez pocicionados todos los barcos, puedes empezar el juego con el boton que aparecera si cumples las condiciones.
                    </li>
                    <li>
                        Al empezar el juego, se generara un tablero con barcos posicionados aleatoriamente, al cual debes hundir sus barcos
                        antes que la IA hunda los tuyos!
                    </li>
                    <li>
                        Si quieres volver a posicionar tus barcos, has click <a href=".">AQUÍ</a> (recargará la pagina)
                    </li>
                </ul>
            </div>
            {/* Nombres disponibles una vez iniciado el juego */}
            <div className={`text-center ${store.gameSteps >= 2 ? "" : "d-none"}`}>
                <h1>{player === 1 ? "My table" : "Enemy table"}</h1>
            </div>
            <div className={`d-flex flex-wrap justify-content-evenly my-4 ${store?.gameSteps <= 1 ? "" : "d-none"}`} >
                {
                    ships.map((ship, index) =>
                        <span
                            onClick={() => actions.setSelectedShip(ship)}
                            key={`ship${index}`}
                        >
                            <Ships id={index} ship={ship} />
                        </span>
                    )
                }
            </div>
            {/* 
            Boton para iniciar el juego, esconde el tablero seteado por el player 1 solo si es que el paso del juego es 1
            */}
            <div className='d-flex justify-content-center'>
                {
                    store?.gameSteps === 1 ?
                        <button
                            className='btn btn-primary m-2'
                            onClick={() => actions.setSteps()}
                        >
                            Start Game!
                        </button>
                        : null
                }
            </div>
            {/* Generador de la tabla, dependiendo de la tabla, esta dibujara en esta seccion con todas sus caracteristicas */}
            <div>
                {
                    table?.map((row, indexRow) =>
                        <div
                            id={`row${indexRow}`}
                            key={`row${indexRow}`}
                            className='d-flex justify-content-center'
                        >
                            {
                                row?.map((column, indexCol) =>

                                    <Square
                                        key={`${indexRow}${indexCol}`}
                                        value={column}
                                        onClick={() => updateValue(indexRow, indexCol)}
                                        indexCol={indexCol}
                                        indexRow={indexRow}
                                        showMyShips={showMyShips}
                                    />
                                )
                            }
                        </div>
                    )
                }
            </div>
            {/* Boton para comprobar si se estan generando bien las coordenadas aleatorias */}
            {
                player === 1 && store.gameSteps > 1 ?
                    <div className='text-center mt-2'>
                        <button onClick={() => setShowMyShips(!showMyShips)} className='btn btn-primary'>Mostrar mis barcos</button>
                    </div>
                    : null
            }
            {/* <button className='btn btn-primary' onClick={() => actions.checkPosibleFireDirection()}>APRIETAMEEEEEEEE</button> */}
        </div>
    )
}

export default Tablero