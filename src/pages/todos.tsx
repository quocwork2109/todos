import React, { useEffect, useState } from 'react';

import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import styled from 'styled-components';

import AddOrDetailModal from '../components/todos/addOrDetailModal';
import BoardTodo from '../components/todos/boardTodo';
import { Status, Todo } from '../types/todo';

const Button = styled.button.attrs({
  className: 'bg-slate-500 px-6 py-2 rounded text-white',
})``;

const initColumnListTodo = Object.values(Status).reduce((result: any, status: Status) => {
  result[status] = {
    status: status,
    todos: []
  };
  return result;
}, {});

export default function Todos() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [listTodo, setListTodo] = useState<Todo[]>([

  ]);
  const [todoDetail, setTodoDetail] = useState<Todo>({
    id: 0,
    title: '',
    description: '',
    status: Status.OPEN,
  });
  const [isDetail, setIsDetail] = useState<boolean>(false);

  const [columnListTodo, setColumnListTodo] =
    useState<Object>(initColumnListTodo);

  const handleListTodo = (status: Status) => {
    return listTodo.filter((item) => item.status === status);
  };

  function handleColumnListTodo() {
    return Object.values(initColumnListTodo).map((item: any) => {
      return {
        ...item,
        todos: handleListTodo(item.status)
      }
    }).reduce((acc: any, item: any) => {
      const { status, ...rest } = item;
      acc[status] = rest;
      return acc;
    }, {})
  }

  useEffect(() => {
    const newData = handleColumnListTodo();
        
    setColumnListTodo(newData);
  }, [listTodo]);

  const onDragEnd = (result: DropResult, columnListTodo: any, setColumnListTodo: Function) => {
    if (!result.destination) return;
  const { source, destination } = result;
  
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columnListTodo[source.droppableId];
    const destColumn = columnListTodo[destination.droppableId];
    const sourceItems = [...sourceColumn.todos];
    const destItems = [...destColumn.todos];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    const newDataColumn = {
      ...columnListTodo,
      [source.droppableId]: {
        ...sourceColumn,
        todos: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        todos: destItems.map((item) => {
          return {
            ...item,
            status: destination.droppableId
          }
        })
      }
    }
    
    setColumnListTodo(newDataColumn);

    let newListTodo: Todo[] = []
    Object.values(newDataColumn).forEach((item: any) => {
      newListTodo.push(...item.todos)
    })
    setListTodo(newListTodo)
  } else {
    const column = columnListTodo[source.droppableId];
    const copiedItems = [...column.todos];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    const newDataColumn = {
      ...columnListTodo,
      [source.droppableId]: {
        ...column,
        todos: copiedItems
      }
    }
    setColumnListTodo(newDataColumn);
    let newListTodo: Todo[] = []
    Object.values(newDataColumn).forEach((item: any) => {
      newListTodo.push(...item.todos)
    })
    setListTodo(newListTodo)
  }
  };

  return (
    <div className=" bg-slate-100">
      <div className="mx-auto flex justify-center py-5">
        <Button onClick={() => setShowModal(true)}>ADD TO DO</Button>
      </div>
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columnListTodo, setColumnListTodo)}
      >
        <div className="flex justify-around gap-2">
          {Object.entries(columnListTodo).map(([columnId, column], index) => {
            return (
              <BoardTodo
                key={columnId}
                title={columnId}
                listTodo={column.todos}
                setTodoDetail={setTodoDetail}
                setShowModal={setShowModal}
                setIsDetail={setIsDetail}
                columnListTodo={columnListTodo}
              />
            );
          })}
        </div>
      </DragDropContext>
      <AddOrDetailModal
        showModal={showModal}
        setShowModal={setShowModal}
        setListTodo={setListTodo}
        listTodo={listTodo}
        todoDetail={todoDetail}
        isDetail={isDetail}
        setIsDetail={setIsDetail}
      />
    </div>
  );
}
