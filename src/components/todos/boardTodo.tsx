import React from 'react';

import { Draggable, Droppable } from 'react-beautiful-dnd';

import { titleColors, Status, Todo } from '../../types/todo';

type PropsValue = {
  title: String;
  listTodo: Todo[];
  setTodoDetail: Function;
  setShowModal: Function;
  setIsDetail: Function;
  columnListTodo: Object;
};

export default function BoardTodo({
  title,
  listTodo,
  setTodoDetail,
  setShowModal,
  setIsDetail,
  columnListTodo,
}: PropsValue) {
  const handleDetailTodo = (todo: Todo) => {
    setTodoDetail(todo);
    setShowModal(true);
    setIsDetail(true);
  };

  return (
    <div
      className={`bg-slate-400 w-full min-h-screen border-4 rounded-lg border-cyan-800`}
    >
      <h1
        className={`text-center py-4 border-b-2 bg-slate-100 font-bold text-${
          titleColors[title as Status]
        }`}
      >
        {title}
      </h1>
      <Droppable droppableId={title as Status} key={title as Status}>
        {(provided, snapshot) => {
          return (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {listTodo?.length > 0 &&
                listTodo.map((todo, index) => {
                  return (
                    <Draggable
                      key={todo.id as any}
                      draggableId={String(todo.id)}
                      index={index}
                    >
                      {(provided, snapshot) => {
                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              userSelect: 'none',
                              padding: 16,
                              margin: '0 0 8px 0',
                              minHeight: '50px',
                              backgroundColor: snapshot.isDragging
                                ? '#263B4A'
                                : '#456C86',
                              color: 'white',
                              ...provided.draggableProps.style,
                            }}
                            className="flex flex-col gap-2 bg-white border-gray-500 mb-2 p-4 cursor-pointer"
                            onClick={() => handleDetailTodo(todo)}
                          >
                            <p style={{ overflowWrap: 'anywhere' }}>
                              Title: {todo.title}
                            </p>
                            <p style={{ overflowWrap: 'anywhere' }}>
                              Description: {todo.description}
                            </p>
                            <p>
                              Status:{' '}
                              <span
                                className={`px-2 py-1 rounded-2xl bg-${
                                  titleColors[title as Status]
                                }`}
                              >
                                {todo.status}
                              </span>
                            </p>
                          </div>
                        );
                      }}
                    </Draggable>
                  );
                })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
}
