import React, { useContext } from 'react'
import { Context } from '../context/appContext';

const Square = ({ value, onClick, indexRow, indexCol, showMyShips }) => {

    const { store } = useContext(Context);

    const changeColor = (number) => {
        switch (number) {
            case 1:
                return 'bg-light';
            case 2:
                if (store?.gameSteps <= 1 || showMyShips === true) {
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

    let className = `border border-dark customSlots ${changeColor(value)}`;

    //Funcion que setea los numeros exteriores
    const setIndex = (number, indexRow, indexCol) => {

        if (number === 4 && indexRow == 0) {
            return indexCol;
        } else if (number === 4 && indexCol == 0) {
            //Desde el caracter 65 empiezan las letras en mayusculas
            return String.fromCharCode(64 + indexRow);
        } else {

        }

    }

    return (
        <div className={className} onClick={onClick}>
            <span className='d-flex justify-content-center'>
                {
                    setIndex(value, indexRow, indexCol)
                }
            </span>
        </div>
    )
}

export default Square