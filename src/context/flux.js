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
            selectedShip: {},
            personalTable: [],
            iaTable: [],
            gameSteps: 0
        },
        actions: {
            setSteps: () => {
                const { gameSteps } = getStore();
                setStore({ gameSteps: gameSteps + 1 })
            },
            setSelectedShip: (ship) => {
                setStore({ selectedShip: ship });
            },
            setPersonalTable: (table) => {
                setStore({ personalTable: [...table] })
            },
            //Generador de tabla automatico y aleatorio
            setIaTable: () => {

                const { initialShips, baseMatrix } = getStore()

                const copyMatrix = [...baseMatrix]

                initialShips.map((ship) => {
                    //Genero un booleano aleatorio dependiento si es mayor o igual a 0.5
                    let randomBoolean = Math.random() >= 0.5;
                    let posiblePositionColumn = 0;
                    let posiblePositionRow = 0;

                    //Si es true, la posición sera hacia abajo
                    //Si es false, la posición sera hacia la derecha
                    if (randomBoolean) {
                        posiblePositionColumn = (Math.floor(Math.random() * (11 - ship.slots)) + 1)
                        posiblePositionRow = (Math.floor(Math.random() * 10) + 1)
                    } else {
                        posiblePositionRow = (Math.floor(Math.random() * (11 - ship.slots)) + 1)
                        posiblePositionColumn = (Math.floor(Math.random() * 10) + 1)
                    }

                    // console.log(ship.name, " x:", String.fromCharCode(64 + posiblePositionRow), " y:", posiblePositionColumn)
                    // console.log(randomBoolean ? "true" : "false")
                })

                // setStore({ iaTable: copyMatrix })
            }
        }
    }
}

export default getState