import React, { useContext, useState } from 'react'
import { Context } from '../context/appContext';
import { BiDownArrowAlt, BiRightArrowAlt } from 'react-icons/bi';

const Ships = ({ id, ship }) => {

    // const [directionToggle, setDirectionToggle] = useState(ship.direction);
    const { store, actions } = useContext(Context);

    const drawShipSlots = () => {
        let squares = [];

        for (let i = 0; i < ship.slots; i++) {
            squares.push(<div id={ship.name + i} key={ship.name + i} className='border border-dark customSlots mini'></div>)
        }

        return squares
    }

    const directionToggle = () => {

        let actualShipData = store?.selectedShip

        actualShipData.direction = !actualShipData.direction

        actions.setSelectedShip(actualShipData)

    }

    return (
        <div
            id={id}
            className={`m-auto d-flex flex-column align-items-center customShip ${ship.setted ? "selected" : "needSelected"} ${store.selectedShip.id === id ? "activeShip" : ""}`}
            onDoubleClickCapture={() => directionToggle()}>

            {ship.name}
            <br />
            <div className='d-flex my-2'>
                {drawShipSlots()}
            </div>
            <span>{ship.positionX} {ship.positionY} {ship.direction ? <BiDownArrowAlt className='fs-2' /> : <BiRightArrowAlt className='fs-2' />}</span>

        </div>
    )
}

export default Ships