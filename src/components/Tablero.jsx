import { useContext, useEffect, useState } from 'react'
import { Context } from '../context/appContext'
import Ships from './Ships'
import '../styles/tablero.css'

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

    const [table, setTable] = useState(chosenPositionsMatrix);

    const [occuppedSlots, setOcuppedSlots] = useState([]);

    useEffect(() => {

        if (store.gameSteps <= 1) {
            checkAllSelected()
        }

    }, [table])


    const changeColor = (number) => {
        switch (number) {
            case 1:
                return 'bg-light';
            case 2:
                if (store?.gameSteps <= 1) {
                    return 'bg-warning'
                }
                return 'bg-primary';
            case 3:
                return 'bg-danger';
            case 4:
                return 'bg-secondary';
            default:
                return 'bg-primary';
        }
    }

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

        if (counter == 5) {
            console.log("readyToStart")
            actions.setPersonalTable([...table])

            actions.setSteps()
        }
    }

    const setGameBoard = (row, column, tableCopy) => {

        const shipsCopy = [...ships]

        const selectedShip = store?.selectedShip || 0

        //Me indica el id del barco seleccionado, el cual me indica a la vez la posicion dentro del array de barcos base.
        let position = store.selectedShip.id

        if (checkValidPosition(selectedShip.direction, selectedShip.slots, row, column)) {
            return console.log('Hay un problema')
        }

        //Funcion que pinta las lineas en el tablero del barco seleccionado
        //Condicionado a  dirección del barco (hacia abajo true, hacia la derecha false) y si no ha sido seteado
        if (selectedShip.direction === true && !selectedShip.setted) {

            for (let i = 0; i < selectedShip.slots; i++) {
                tableCopy[row + i][column] = 2
            }

            setTable(tableCopy)
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
            setTable(tableCopy)

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
        const tableCopy = [...table]

        store?.gameSteps <= 1 ? setGameBoard(row, column, tableCopy) : null




        if (store?.gameSteps > 1) {
            if (tableCopy[row][column] == 4 || tableCopy[row][column] == 3) {

            } else if (tableCopy[row][column] == 2) {
                tableCopy[row][column] = 3
                setTable(tableCopy)
            } else if (tableCopy[row][column] == 0) {
                tableCopy[row][column] = 1
                setTable(tableCopy)
            } else {

            }
        }


    }

    //Funcion que recibe la Dirección del barco (hacia abajo true, hacia la derecha false) y si no ha sido seteado
    const checkValidPosition = (direction, selectedShipSlots, row, column) => {

        let auxArray = []
        let hasError = false
        let errorMsg = ""

        console.log(selectedShipSlots, " ", row, ' ', column, direction ? "abajo" : "derecha")
        if (row == 0 || column == 0) {
            hasError = true;
            errorMsg = "Posicion fuera del tabero"
        } else if (selectedShipSlots == 5 && direction === true && row > 6 || selectedShipSlots == 5 && direction === false && column > 6) {
            hasError = true;
            errorMsg = "Posicion fuera del tabero"
        } else if (selectedShipSlots == 4 && direction === true && row > 7 || selectedShipSlots == 4 && direction === false && column > 7) {
            hasError = true;
            errorMsg = "Posicion fuera del tabero"
        } else if (selectedShipSlots == 3 && direction === true && row > 8 || selectedShipSlots == 3 && direction === false && column > 8) {
            hasError = true;
            errorMsg = "Posicion fuera del tabero"
        } else if (selectedShipSlots == 2 && direction === true && row > 9 || selectedShipSlots == 2 && direction === false && column > 9) {
            hasError = true;
            errorMsg = "Posicion fuera del tabero"
        }

        if (direction == true && store.selectedShip != {}) {
            for (let i = 0; i < selectedShipSlots; i++) {
                auxArray.push(String.fromCharCode(64 + row + i) + column)
            }
        } else {
            for (let i = 0; i < selectedShipSlots; i++) {
                auxArray.push(String.fromCharCode(64 + row) + (column + i))
            }
        }

        auxArray.forEach(element => {

            if (occuppedSlots.includes(element)) {
                errorMsg = "Los barcos colicionan"
                hasError = true
            }

        });

        if (hasError) {
            console.log(errorMsg)
            return hasError;
        } else {
            setOcuppedSlots(occuppedSlots.concat(auxArray))
        }

    }

    //Funcion que setea los numeros exteriores
    const setIndex = (number, indexRow, indexCol) => {

        if (number === 4 && indexRow == 0) {
            return indexCol;
        } else if (number === 4 && indexCol == 0) {
            //Desde el caracter 65 empiezan las letras en mayusculas
            return String.fromCharCode(64 + indexRow);
        }

        return null
    }

    return (

        <div className='offset-md-2 col-md-8 border border-dark py-4'>
            <div className={`d-flex flex-column justify-content-center align-items-center ${store.gameSteps === 2 ? "d-none" : ""}`}>
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
            {/* Div */}
            <div className={`text-center ${store.gameSteps === 2 ? "" : "d-none"}`}>
                <h1>{player === 1 ? "Player1" : "Ia"}</h1>
            </div>
            <div className={`d-flex flex-wrap justify-content-evenly mb-2 ${store?.gameSteps <= 1 ? "" : "d-none"}`} >
                {
                    ships.map((ship, index) =>
                        <span
                            onClick={(e) => actions.setSelectedShip(ship)}
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
            {
                table?.map((row, indexRow) =>
                    <div
                        id={`row${indexRow}`}
                        key={`row${indexRow}`}
                        className='d-flex justify-content-center'
                    >
                        {
                            row?.map((column, indexCol) =>
                                <div
                                    id={`${String.fromCharCode(64 + indexRow)}${indexCol}`}
                                    key={`${indexRow}${indexCol}`}
                                    className={`border border-dark customSlots ${changeColor(column)}`}
                                    onClick={() => updateValue(indexRow, indexCol)}
                                >
                                    <span className='d-flex justify-content-center'>
                                        {
                                            setIndex(column, indexRow, indexCol)
                                        }
                                    </span>
                                </div>
                            )
                        }
                    </div>
                )
            }
            {/* Boton para comprobar si se estan generando bien las coordenadas aleatorias */}
            {/* <button onClick={() => actions.setIaTable()} className='btn btn-primary'>Aprietame</button> */}
        </div>
    )
}

export default Tablero