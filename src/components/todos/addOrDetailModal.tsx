import React, { useState, useEffect } from 'react';
import { Status, Todo } from '../../types/todo';
import styled, { css } from "styled-components";
import * as Yup from 'yup';

const schema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  status: Yup.string().required('Status is required'),
});

type PropsValue = {
  showModal: Boolean
  setShowModal: Function
  setListTodo: Function
  listTodo: Todo[]
  todoDetail: Todo
  setIsDetail: Function
  isDetail: boolean
}

type todoForm = {
  title: String,
  description: String,
  status: Status,
}

interface ButtonProps {
  backgroundColor: string;
  textColor: string;
}

const Button = styled.button<ButtonProps>`
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.textColor};
  padding: 8px 0;
  width: 96px;
  border-radius: 5px;
  margin-left: 12px;

  &:hover {
    opacity: .8;
  }
`

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.3);
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.3);
  }
`;
  
const DivWrapper = styled.div.attrs({
  className: "flex items-centerm pb-4"
  })``; 

const Label = styled.label.attrs({
  className: "w-32 self-center"
  })``; 

export default function AddOrDetailModal({ showModal, setShowModal, setListTodo, listTodo, todoDetail, setIsDetail, isDetail }: PropsValue) {
  const [id, setId] = useState<number>(1)
  const [formTodo, setFormTodo] = useState<todoForm>({
    title: '',
    description: '',
    status: Status.OPEN,
  })
  const [errors, setErrors] = useState<{
    title: String,
    description: String,
    status: String,
  }>({
    title: '',
    description: '',
    status: '',
  });

  const generateId = () => {
    setId((prev) => ++prev)
    return id;
  }

  const handleBlur = async (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    try {
      await schema.validateAt(name, { [name]: value });
      setErrors({ ...errors, [name]: '' });
    } catch (error: any) {
      setErrors({ ...errors, [name]: error.message });
    }
  };

  const handleFormData = (e: any) => {
    const name = e.target.name
    const value = e.target.value
    setFormTodo((prev) => {
     return {
      ...prev,
      [name]: value
     }
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    schema.validate(formTodo, { abortEarly: false })
    .then(() => {
      if(isDetail) {
        const dataUpdate = listTodo.map(todo => {
          if (todo.id === todoDetail.id) {
            return { ...todo, ...formTodo };
          }
          return todo;
        });
        setListTodo(dataUpdate)
        setIsDetail(false)
      } else {
        setListTodo([...listTodo, { id: generateId(), ...formTodo }])
      }
      
      setFormTodo({
        title: '',
        description: '',
        status: Status.OPEN,
      })
      setShowModal(false)
      setErrors({
        title: '',
        description: '',
        status: '',
      });
    }).catch((validationErrors) => {
      console.log('Form is invalid');
      const errors = validationErrors.inner.reduce((acc: any, error: any) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setErrors(errors);
    });
  }

  const RemoveTodo = () => {
    setListTodo((prev: Todo[]) => {
      return prev.filter((todo) => todo.id !== todoDetail.id)
    })
    closeModal()
  }

  const closeModal = () => {
    setFormTodo({
      title: '',
      description: '',
      status: Status.OPEN
    })
    setIsDetail(false)
    setShowModal(false)
    setErrors({
      title: '',
      description: '',
      status: '',
    })
  }

  useEffect(() => {
    setFormTodo({
      title: isDetail ? todoDetail.title as string : '',
      description: isDetail ? todoDetail.description as string : '',
      status: isDetail ? todoDetail.status : Status.OPEN
    })
  }, [isDetail])

  if (!showModal) {
    return null;
  }

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50'>
      <div className='absolute top-1/2 left-1/2 w-3/4 max-w-xl bg-white shadow-lg rounded' style={{transform: 'translate(-50%, -50%)'}}>
        <div className='flex flex-col p-5'>
         <h2 className='text-center text-2xl mb-5'>{ isDetail ? 'Todo Detail' : 'Add Todo' }</h2>
          <form onSubmit={handleSubmit} noValidate>
            <DivWrapper>
              <Label htmlFor="">Title</Label>
              <div className='w-full'>
                <Input required name="title" value={formTodo.title as string} type="text" onChange={handleFormData} onBlur={handleBlur} />
                {errors.title ? <div className='text-xs text-red-500'>{errors.title}</div> : null}
              </div>
            </DivWrapper>
            <DivWrapper>
              <Label htmlFor="">Description</Label>
              <div className='w-full'>
                <Input name="description" value={formTodo.description as string} type="text" onChange={handleFormData} onBlur={handleBlur} />
                {errors.description ? <div className='text-xs text-red-500'>{errors.description}</div> : null}
              </div>
            </DivWrapper>
            <DivWrapper>
              <Label htmlFor="">Status</Label>
              <div className='w-full'>
                <Select name="status" id="" value={formTodo.status} onChange={handleFormData} onBlur={handleBlur}>
                  {
                    Object.values(Status).map((status, index) => {
                      return (
                        <option key={index} value={status}>{status}</option>
                      )
                    })
                  }
                </Select>
                {errors.status ? <div className='text-xs text-red-500'>{errors.status}</div> : null}
              </div>
            </DivWrapper>
            <div className={`${isDetail ? 'flex justify-between': 'self-end'}`}>
              {
                isDetail && <Button backgroundColor="#f87171" textColor="#fff" onClick={RemoveTodo}>Remove</Button>
              }
              <div className='text-right'>
                <Button onClick={closeModal} backgroundColor="#a8a29e" textColor="#fff">Close</Button>
                <Button type="submit" backgroundColor="#2196f3" textColor="#fff">{ isDetail ? 'Edit' : 'Add' }</Button>
              </div>
            </div>
          </form>
        </div>
      </div >
    </div>
  );
}