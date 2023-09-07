const getState = ({ getStore, getActions, setStore }) => {
    return {

        store: {
            baseMatrix: [
                [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
                [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ],
            initialShips: [
                { id: 0, name: 'extraLargeShip', slots: 5, positionX: 0, positionY: 0, direction: true, setted: false },
                { id: 1, name: 'largeShip', slots: 4, positionX: 0, positionY: 0, direction: true, setted: false },
                { id: 2, name: 'mediumShip1', slots: 3, positionX: 0, positionY: 0, direction: true, setted: false },
                { id: 3, name: 'mediumShip2', slots: 3, positionX: 0, positionY: 0, direction: true, setted: false },
                { id: 4, name: 'smallShip', slots: 2, positionX: 0, positionY: 0, direction: true, setted: false }
            ],
            //Se inicia el turno aleatoriamente
            shifter: Math.random() >= 0.5,
            selectedShip: {},
            personalTable: [],
            iaTable: [],
            occuppiedSlots: [],
            validIaOptions: [],
            foundParts: [],
            actualFirePosition: [],
            winner: "",
            gameSteps: 0
        },
        actions: {
            setShifter: () => {
                const { shifter } = getStore();
                setStore({ shifter: !shifter })
            },
            setWinner: (winner) => {
                setStore({ winner: winner })
            },
            setSteps: () => {
                const { gameSteps } = getStore();
                setStore({ gameSteps: gameSteps + 1 })
            },
            setSelectedShip: (ship) => {
                setStore({ selectedShip: ship });
            },
            setPersonalTable: (table) => {
                setStore({ personalTable: JSON.parse(JSON.stringify(table)) })
            },
            updateIaTable: (table) => {
                setStore({ iaTable: JSON.parse(JSON.stringify(table)) })
            },
            //Funcion que recibe la Dirección del barco (hacia abajo true, hacia la derecha false) y si no ha sido seteado
            checkValidPosition: (direction, selectedShipSlots, row, column) => {

                const { occuppiedSlots, selectedShip } = getStore();

                let auxArray = []
                let hasError = false
                let errorMsg = ""

                // console.log(selectedShipSlots, " ", row, ' ', column, direction ? "abajo" : "derecha")
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

                if (direction == true && selectedShip != {}) {
                    for (let i = 0; i < selectedShipSlots; i++) {
                        auxArray.push(String.fromCharCode(64 + row + i) + column)
                    }
                } else {
                    for (let i = 0; i < selectedShipSlots; i++) {
                        auxArray.push(String.fromCharCode(64 + row) + (column + i))
                    }
                }

                auxArray.forEach(element => {

                    if (occuppiedSlots.includes(element)) {
                        errorMsg = "Los barcos colicionan"
                        hasError = true
                    }

                });

                if (hasError) {
                    // console.log(errorMsg)
                    return hasError;
                } else {
                    setStore({ occuppiedSlots: occuppiedSlots.concat(auxArray) });
                    return hasError;
                }

            },
            //Generador de tabla automatico y aleatorio
            setIaTable: () => {

                const { initialShips, baseMatrix } = getStore()

                const { checkValidPosition } = getActions()

                let copyMatrix = JSON.parse(JSON.stringify(baseMatrix))

                setStore({ occuppiedSlots: [] });

                initialShips.map((ship, index) => {
                    let isValid = false
                    do {
                        //Genero un booleano aleatorio dependiento si es mayor o igual a 0.5
                        let randomBoolean = Math.random() >= 0.5;
                        let posiblePositionColumn = 0;
                        let posiblePositionRow = 0;

                        //Si es true, la posición sera hacia abajo
                        //Si es false, la posición sera hacia la derecha
                        if (randomBoolean === true) {
                            //Esta formula calcula un random con los posibles slots, evitando errores por posicionamiento fuera del tablero
                            posiblePositionRow = (Math.floor(Math.random() * (11 - ship.slots)) + 1)
                            posiblePositionColumn = (Math.floor(Math.random() * 10) + 1)
                        } else if (randomBoolean === false) {
                            posiblePositionColumn = (Math.floor(Math.random() * (11 - ship.slots)) + 1)
                            posiblePositionRow = (Math.floor(Math.random() * 10) + 1)
                        }

                        //Compruebo si es valida la posición para volver posicionar el
                        isValid = checkValidPosition(randomBoolean, ship.slots, posiblePositionRow, posiblePositionColumn)

                        if (randomBoolean === true) {
                            for (let i = 0; i < ship.slots; i++) {
                                copyMatrix[posiblePositionRow + i][posiblePositionColumn] = 2
                            }
                        } else if (randomBoolean === false) {
                            for (let i = 0; i < ship.slots; i++) {
                                copyMatrix[posiblePositionRow][posiblePositionColumn + i] = 2
                            }
                        }

                        // console.log(ship.name, " x:", String.fromCharCode(64 + posiblePositionRow), " y:", posiblePositionColumn)
                        // console.log(randomBoolean ? "abajo" : "derecha")
                        // console.log(isValid, index)
                        // console.log("----------------------------------------------------------")

                    } while (isValid === true)

                })

                setStore({ iaTable: JSON.parse(JSON.stringify(copyMatrix)) })
            },
            iaRandomFirePostition: () => {

                const { personalTable, foundParts, actualFirePosition } = getStore();

                const { setPersonalTable, checkPosibleFireDirection } = getActions();

                const copytable = JSON.parse(JSON.stringify(personalTable))

                //En este array guardare todas las opciones validas que hay disponible para iterar
                const auxArray = []

                const auxFoundedParts = []

                let random = 0;

                //Busco TODAS las posiciones restantes dentro del array partiendo de row 1-10 y col 1-10
                //Las guardo en un array auxiliar para posteriormente guardarlas en el store
                for (let row = 1; row < copytable.length; row++) {
                    for (let col = 1; col < copytable[row].length; col++) {
                        // console.log("Row: " + row + " Column: " + col + " Valor: " + copytable[row][col])
                        if (copytable[row][col] === 3) {

                            auxFoundedParts.push([row, col])

                        } else if (copytable[row][col] === 0 || copytable[row][col] === 2) {
                            auxArray.push([row, col])
                        }
                    }
                }

                //Solo en si, el primer turno juega la CPU y estan las 100 posiciones intactas se ejecutará
                //Se evita guardar innecesariamente
                //Se guarda aqui para quitar un elemento de auxArray.
                if (copytable.length === 100) {
                    // console.log(JSON.parse(JSON.stringify(auxArray)))
                    setStore({ validIaOptions: JSON.parse(JSON.stringify(auxArray)) });
                }


                //Este if controlara si anteriormente encontro un rojo
                //Se busca la posicion dentro del array, de la siguiente movida (Buscará los 2 dentro del tablero internamente (TRAMPA))
                if (actualFirePosition.length > 0) {
                    let array = checkPosibleFireDirection()
                    auxArray.filter((item, index) => {
                        //Si encuentra un item que tenga los mismos valores del array, devuelve el index
                        if (item[0] == array[0] && item[1] == array[1]) {
                            return random = index
                        }
                    })
                } else {
                    //Si NO hubo impacto al barco en la jugada anterior, se crea un objetivo random!
                    random = Math.floor(Math.random() * auxArray.length)

                }

                //Del array auxiliar, se recoje de la posicion disponible generada aleatoriamente con random 
                //Se busca dentro de la tabla con el valor contenido en el array
                if (copytable[auxArray[random][0]][auxArray[random][1]] === 0) {
                    //Si el valor es 0, no ha habido interacción, por lo tanto se cambia a 1
                    //Se extrae del array, para poder elegir opciones disponibles
                    copytable[auxArray[random][0]][auxArray[random][1]] = 1
                    setStore({ actualFirePosition: [] })
                    auxArray.splice(random, 1)
                } else if (copytable[auxArray[random][0]][auxArray[random][1]] === 2) {
                    let array = []

                    copytable[auxArray[random][0]][auxArray[random][1]] = 3

                    array.push(auxArray[random][0], auxArray[random][1])

                    //Aqui se inicia la busqueda de objetivos cercanos, guardando el ultimo impacto en el store
                    //Por cada iteracion preguntara y sobreescribira la anterior!
                    setStore({ actualFirePosition: JSON.parse(JSON.stringify(array)) })

                    //Guardo el array dentro de los encontrados para contabilizar despues si todos fueron encontrados
                    auxFoundedParts.push(array)
                    //Guardo en el store las partes encontradas
                    setStore({ foundParts: JSON.parse(JSON.stringify(auxFoundedParts)) })

                    auxArray.splice(random, 1)
                }

                // console.log(foundParts)
                // console.log(validIaOptions)
                // console.log(copytable)

                //Guardo el array, ya con la posicion aleatoria puesta en el campo
                setStore({ validIaOptions: JSON.parse(JSON.stringify(auxArray)) });
                setPersonalTable(JSON.parse(JSON.stringify(copytable)))
            },
            checkPosibleFireDirection: () => {
                const { actualFirePosition, personalTable } = getStore();

                let nextPosiblePosition = []

                //Valores formateados en un array para mejor vista
                //Debo atrapar el error, en caso de que busque por las posiciones x: 10 e i: 10 
                //que no busque en una posicion inexistente, le doy valor de 0 para invalidar mas abajo.
                //Primero el valor de la casilla, despues la posicion en X e Y
                //0 = valor, 1 = Y, 2 = X

                let arrayDerecha = [
                    personalTable[actualFirePosition[0]][(parseInt(actualFirePosition[1]) + 1) == 11 ? 0 : (parseInt(actualFirePosition[1]) + 1)],
                    actualFirePosition[0],
                    (actualFirePosition[1] + 1) == 11 ? 0 : (actualFirePosition[1] + 1)
                ]
                let arrayAbajo = [
                    personalTable[(parseInt(actualFirePosition[0]) + 1) == 11 ? 0 : (parseInt(actualFirePosition[0]) + 1)][actualFirePosition[1]],
                    (actualFirePosition[0] + 1) == 11 ? 0 : (parseInt(actualFirePosition[0]) + 1),
                    actualFirePosition[1]
                ]
                let arrayIzquierda = [
                    personalTable[actualFirePosition[0]][(parseInt(actualFirePosition[1]) - 1)],
                    actualFirePosition[0],
                    (actualFirePosition[1] - 1)
                ]
                let arrayArriba = [
                    personalTable[(parseInt(actualFirePosition[0]) - 1)][actualFirePosition[1]],
                    (actualFirePosition[0] - 1),
                    actualFirePosition[1]
                ]

                // //Este muestra la posicion de derecha
                // console.log(`Valor Derecha:   ${arrayDerecha[0]} Row: ${arrayDerecha[1]} Column: ${arrayDerecha[2]}`)
                // //Este muestra la posicion de abajo
                // console.log(`Valor Abajo:     ${arrayAbajo[0]} Row: ${arrayAbajo[1]} Column: ${arrayAbajo[2]}`)
                // //Este muestra la posicion de izquierda
                // console.log(`Valor Izquierda: ${arrayIzquierda[0]} Row: ${arrayIzquierda[1]} Column: ${arrayIzquierda[2]}`)
                // //Este muestra la posicion de arriba
                // console.log(`Valor Arriba:    ${arrayArriba[0]} Row: ${arrayArriba[1]} Column: ${arrayArriba[2]}`)

                //Estados de la matrix:
                //0 = Vacío (No ha habido interacción)
                //1 = Tiro al agua (No le he dado a ningun barco)
                //2 = Hay una sección del barco
                //3 = Tiro en el blanco
                //4 = Disabled

                //Aca, posiblemente este haciendo trampa, pero no importa, debe ganar la CPU
                //Mi if normal seria (arrayDerecha[0] == 0 || arrayDerecha[0] == 2) para guardar tanto los 2 y los 0
                //Pero que feo se veria anidando tanto para hacerla pensar correctamente
                //Podria ser a futuro.

                //Si en las casillas adyacentes hay un 2, ATACA
                if (arrayDerecha[0] == 2) {
                    nextPosiblePosition.push([arrayDerecha[1], arrayDerecha[2]])
                }
                if (arrayAbajo[0] == 2) {
                    nextPosiblePosition.push([arrayAbajo[1], arrayAbajo[2]])
                }
                if (arrayIzquierda[0] == 2) {
                    nextPosiblePosition.push([arrayIzquierda[1], arrayIzquierda[2]])
                }
                if (arrayArriba[0] == 2) {
                    nextPosiblePosition.push([arrayArriba[1], arrayArriba[2]])
                }

                //Si no hay nada, se libera el store para tirar un random.
                if (nextPosiblePosition.length === 0) {
                    return 0
                }

                let nextRandom = Math.floor(Math.random() * nextPosiblePosition.length)
                // console.log("Array de posibles: " + nextPosiblePosition)
                console.log(nextPosiblePosition[nextRandom])
                // console.log("Actual Fire: " + actualFirePosition)
                setStore({ actualFirePosition: [] })
                return nextPosiblePosition[nextRandom]
            }
        }
    }
}

export default getState