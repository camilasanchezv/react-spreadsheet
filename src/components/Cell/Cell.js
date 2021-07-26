import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useOnClickOutside } from '../../hooks/useClickOutside'
import "./styles.scss";

export default function Cell({ table, setTable, ...props }) {
    const [focus, setFocus] = useState(false)
    const cellRef = useRef(null)
    useOnClickOutside(() => setFocus(false), cellRef)

    // determines if str is a valid cell and returns it value
    const validCell = useCallback((str) => {
        let arr = str.match(/[a-zA-Z]+|[0-9]+/g)
        if (arr.toString().replace(/,/g, '') === str) {
            if (arr && arr.length === 2 && Number(arr[1]) && !Number(arr[0])) {
                let y = arr[1]
                let x = getValue(arr[0])
                if (table[x] && table[x][y]) return table[x][y].value || table[x][y].formula
            }
        }
        return null
    }, [table])
    // turns letters into numeric coord
    function getValue(s) {
        return s.split('').reduce((r, a) => r * 26 + parseInt(a, 36) - 9, 0);
    }

    // update cell's formula
    function updateFormula(display) {
        let auxTable = [...table]
        auxTable[props.x][props.y].formula = display
        if (!props.formula.startsWith('=SUM(')) {
            auxTable[props.x][props.y].value = display
        } else {
            auxTable[props.x][props.y].value = ''
        }
        setTable(auxTable)
    }

    const updateValue = useCallback((display) => {
        let auxTable = [...table]
        auxTable[props.x][props.y].value = display
        setTable(auxTable)
    }, [props.x, props.y, table, setTable])

    // this value contains que cells we would add
    const cellSUM = useMemo(() => {
        if (props.formula.startsWith('=SUM(') && props.formula.endsWith(')')) {
            let cells = props.formula.substring(5, props.formula.length - 1).split(';')
            let values = []

            let valid = true;
            for (let i = 0; i < cells.length; i++) {
                if (Number(validCell(cells[i]))) {
                    values.push(validCell(cells[i]))
                } else if (Number(cells[i])) {
                    values.push(Number(cells[i]))
                } else {
                    valid = false;
                    break;
                }
            }
            if (valid) return values
        }
        return null
    }, [props.formula, validCell])

    // this value contains que cells we would substract
    const cellMINUS = useMemo(() => {
        if (props.formula.startsWith('=MINUS(') && props.formula.endsWith(')')) {
            let cells = props.formula.substring(7, props.formula.length - 1).split(';')
            let values = []

            let valid = true;
            if (cells.length === 2) {
                for (let i = 0; i < cells.length; i++) {
                    if (Number(validCell(cells[i]))) {
                        values.push(validCell(cells[i]))
                    } else if (Number(cells[i])) {
                        values.push(Number(cells[i]))
                    } else {
                        valid = false;
                        break;
                    }
                }
                if (valid) return values
            }
        }
        return null
    }, [props.formula, validCell])

    useEffect(() => {
        if (cellSUM) {
            let value = 0
            for (let i = 0; i < cellSUM.length; i++) {
                value += Number(cellSUM[i])
            }
            if (props.value !== value) //this if works as it would in a recursive function, it stops the re-rendering when unnecessary
                updateValue(value)
        } else if (cellMINUS) {
            let value = Number(cellMINUS[0]) - Number(cellMINUS[1])
            if (props.value !== value)
                updateValue(value)
        } else
            if (props.formula !== props.value)
                updateValue(props.formula)
    }, [cellSUM, cellMINUS, props.value, updateValue, props.formula])

    return (
        <div ref={cellRef}>
            {props.header ?
                <div className="cell-component header">{props.id}</div>
                :
                <input
                    className="cell-component"
                    value={focus ? props.formula : props.value === 0 ? props.value : props.value || props.formula} // special case because for 0
                    onChange={(e) => updateFormula(e.target.value)}
                    onClick={() => setFocus(true)}
                />
            }
        </div>
    )
}