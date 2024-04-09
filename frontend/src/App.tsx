import { FiTrash} from 'react-icons/fi'

import {api} from './services/api'
import { useState, useEffect, useRef, FormEvent } from 'react'

interface ICustomerProps {
  id:string,
  name:string,
  email:string,
  status:boolean,
  createdAt:Date,
  updatedAt:Date
}
 
export default function App() {

  const [customers, setCustomers] = useState<ICustomerProps[]>([]) 
  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    loadCustomers()
  })
  
 
  async function loadCustomers(){
    const response = await api.get("/customers")
    setCustomers(response.data)
  }
 
  async function handleSubmit(event: FormEvent){
     event.preventDefault()

     if(!nameRef.current?.value || !emailRef.current?.value) return
  
      await api.post("/customers",{
      name:nameRef.current?.value,
      email:emailRef.current?.value
     })

      nameRef.current.value = ""
      emailRef.current.value =""
     
    }

    async function handleDelete(id:string){
      try {
        await api.delete(`/customers/${id}`)
      } catch (error) {
         console.log(error) 
      }
    }


  return (
    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-white">
          clientes
        </h1>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label className="text-white" htmlFor="name">Nome:</label>
          <input id="name" 
          type="text" 
          placeholder="Digite o seu nome completo..."
          className="w-full mb-5 p-2 rounded" 
          ref={nameRef} />

          <label className="text-white" htmlFor="email">Email:</label>
          <input id="email" 
          type="text" 
          placeholder="Digite o seu email..."
          className="w-full mb-5 p-2 rounded"
          ref={emailRef} />

          <input type="submit" value="Cadastrar" className="rounded bg-green-500 font-medium cursor-pointer w-full p-2 " />
        </form>

        <section className="flex flex-col gap-4">
          {customers.map(customer =>(
            <article key={customer.id} className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200">
            <p><span className="font-medium">Nome:</span> {customer.name}</p>
            <p><span className="font-medium">email:</span> {customer.email}</p>
            <p><span className="font-medium">Status:</span>{ customer.status ? "Activo" : "Inactivo"}</p>

            <button onClick={() => handleDelete(customer.id)} className='bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2'><span className='w-0 overflow-hidden'>.</span> <FiTrash size={18} color='#fff'/> </button>
          </article>
          ))}
        </section>
      </main>
    </div>    
  )
}