import React, { useEffect, useState } from 'react';
import styles from './Table.module.css';

const generateColumns = async (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const columnsCount = Math.floor(Math.random() * (100 - 2 + 1)) + 2;
      const columns = Array.from({ length: columnsCount }, (_, i) => `Обработка ${i + 1}`);
      resolve(columns);
    }, 1500);
  });
};

const generateRows = async (columnsCount: number): Promise<boolean[][]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const rowsCount = Math.floor(Math.random() * (100 - 2 + 1)) + 2;
      const rows = Array.from({ length: rowsCount }, () =>
        Array.from({ length: columnsCount }, () => Math.random() >= 0.5)
      );
      resolve(rows);
    }, 1500);
  });
};

const Table: React.FC = () => {
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<boolean[][]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [rowToDelete, setRowToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const fetchData = async () => {
    setLoading(true);
    const generatedColumns = await generateColumns();
    setColumns(generatedColumns);
    const generatedRows = await generateRows(generatedColumns.length);
    setRows(generatedRows);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addRow = () => {
    const newRow = Array.from({ length: columns.length }, () => Math.random() >= 0.5);
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const editRow = (index: number) => {
    const updatedRow = rows[index].map(() => Math.random() >= 0.5); 
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[index] = updatedRow;
      return newRows;
    });
  };

  const deleteRow = (index: number) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
    setShowModal(false);
  };

  const confirmDelete = (index: number) => {
    setRowToDelete(index);
    setShowModal(true);
  };

  const handleDeleteConfirm = () => {
    if (rowToDelete !== null) {
      deleteRow(rowToDelete);
    }
  };

  return (
    <div>
      <h1>Таблица Заказов</h1>
      <button onClick={fetchData}>Перезагрузить данные</button>
      <button onClick={addRow}>Добавить строку</button>
      {loading ? 
        <p>Загрузка данных...</p>
      : 
      <table>
        <thead style={{height: '16vh'}}>
          <tr>
            <th></th>
            {columns.map((column, index) => (
              <th key={index} style={{transform: 'rotate(-90deg)', whiteSpace: 'nowrap'}}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td style={{whiteSpace: 'nowrap', textAlign: 'start', paddingRight: '2vw'}}>Заказ {rowIndex + 1}</td>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={{ backgroundColor: cell ? 'green' : 'red' }}>
                  {cell ? 'True' : 'False'}
                </td>
              ))}
              <td>
                <button onClick={() => editRow(rowIndex)}>Редактировать</button>
                <button onClick={() => confirmDelete(rowIndex)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      }

      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent}>
            <p>Вы уверены, что хотите удалить эту строку?</p>
            <div style={{display: 'flex', justifyContent: 'center', gap: '15px'}}>
              <button onClick={handleDeleteConfirm}>Да</button>
              <button onClick={() => setShowModal(false)}>Нет</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;