import { useState } from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const NewTicket = () => {
  const [price, setPrice] = useState('')
  const [title, setTitle] = useState('')

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'),
  })

  const onBlur = () => {
    const value = parseFloat(price)
    setPrice(value.toFixed(2))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    doRequest()
  }

  return (
    <div>
      <h1>Create a ticket</h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label>Title</label>
          <input
            onChange={({ target }) => setTitle(target.value)}
            className='form-control'
            type='text'
            value={title}
          />
        </div>
        <div className='form-group'>
          <label>Price</label>
          <input
            onChange={({ target }) => setPrice(target.value)}
            onBlur={onBlur}
            type='number'
            className='form-control'
            value={price}
          />
        </div>
        {errors}
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  )
}

export default NewTicket
