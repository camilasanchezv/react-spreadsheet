import React, { useEffect, useState } from 'react';
import Cell from '../Cell/Cell.js';
import './styles.scss'

// Name Columns
function columnHeader(n) {
    if (n < 0) return 0;

    var result = '';
    do {
        result = (n % 26 + 10).toString(36) + result;
        n = Math.floor(n / 26) - 1;
    } while (n >= 0)
    return result.toUpperCase();
}

export default function Table({ defaultCol, defaultRow }) {
    const [numCol, setNumCol] = useState(defaultCol)
    const [numRow, setNumRow] = useState(defaultRow)
    const [table, setTable] = useState([])

    // Initialize Table
    useEffect(() => {
        let cols = []
        for (let c = -1; c < defaultCol; c++) {
            let column = []
            for (let r = 0; r <= defaultRow; r++) {
                if (r === 0) {
                    column.push({
                        x: c + 1,
                        y: r,
                        id: columnHeader(c),
                        header: true,
                        value: '',
                        formula: '',
                    })
                } else if (columnHeader(c) === 0) {
                    column.push({
                        x: c + 1,
                        y: r,
                        id: r,
                        header: true,
                        value: '',
                        formula: '',
                    })
                } else {
                    column.push({
                        x: c + 1,
                        y: r,
                        id: columnHeader(c) + r,
                        header: false,
                        value: '',
                        formula: '',
                    })
                }
            }
            cols.push(column)
        }

        setTable(cols)

    }, [setTable, defaultCol, defaultRow])


    //Add Functions
    function addColumn() {
        let column = []
        for (let r = 0; r <= numRow; r++) {
            if (r === 0) {
                column.push({
                    x: numCol + 1,
                    y: r,
                    id: columnHeader(numCol),
                    header: true,
                    value: '',
                    formula: '',
                })
            } else if (columnHeader(numCol) === 0) {
                column.push({
                    x: numCol + 1,
                    y: r,
                    id: r,
                    header: true,
                    value: '',
                    formula: '',
                })
            } else {
                column.push({
                    x: numCol + 1,
                    y: r,
                    id: columnHeader(numCol) + r,
                    header: false,
                    value: '',
                    formula: '',
                })
            }
        }
        setNumCol(numCol + 1);
        setTable([...table, column]);
    }

    function addRow() {
        let auxTable = [...table];
        for (let c = 0; c <= numCol; c++) {
            if (c === 0) {
                auxTable[c].push({
                    x: c,
                    y: numRow + 1,
                    id: numRow + 1,
                    header: true,
                    value: '',
                    formula: '',
                })
            } else {
                auxTable[c].push({
                    x: c,
                    y: numRow + 1,
                    id: columnHeader(c - 1) + (numRow + 1),
                    header: false,
                    value: '',
                    formula: '',
                })
            }
        }

        setNumRow(numRow + 1);
        setTable(auxTable);
    }

    return (
        <div className="table-container">
            <div className="columns">
                {table.map((col, index) => (
                    <div key={index}>
                        {col.map((cell) => (
                            <div key={cell.id}><Cell id={cell.id} x={cell.x} y={cell.y} header={cell.header} value={cell.value} formula={cell.formula}
                                table={table} setTable={setTable} /></div>
                        ))}
                    </div>
                ))}
                <button className="add" onClick={addColumn}>
                    <i className="fas fa-plus"></i>
                </button>
            </div>
            <button className="add" onClick={addRow}>
                <i className="fas fa-plus" ></i>
            </button>
        </div>
    )
}