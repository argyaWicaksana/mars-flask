'use client'
import { FormEvent, useEffect, useState } from "react"
import { PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Order {
  _id: { $oid: string },
  name: string,
  address: string,
  size: number
}

interface TableProps {
  data: Order[] | undefined,
  onUpdate: () => void,
}

function FormModal({ closeModal, data, onUpdate }: { closeModal: () => void, data: Order, onUpdate: () => void }) {
  const [dataInput, setDataInput] = useState<Order>(data)

  const updateOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    closeModal()

    const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value
    const address = (e.currentTarget.elements.namedItem('address') as HTMLInputElement).value
    const size = (e.currentTarget.elements.namedItem('size') as HTMLInputElement).value

    const response = await fetch('http://localhost:5000/mars/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: data._id.$oid,
        name: name,
        address: address,
        size: size
      })
    })
    const msg = await response.json()
    console.log(msg)

    onUpdate()
  }

  return (
    <div className="fixed inset-0 grid place-items-center bg-[rgba(0,0,0,0.5)]">
      <div className="border border-slate-700 bg-slate-900 sm:w-3/6 xl:w-2/6">
        <div className="p-3 border-b border-slate-700 flex justify-between">
          <h1>Update Form</h1>
          <XMarkIcon className="h-6 w-6 cursor-pointer" onClick={closeModal} />
        </div>
        <form className="p-16 flex flex-col gap-4" onSubmit={updateOrder}>
          <input type="text" onChange={(e) => setDataInput({ ...dataInput, name: e.target.value })}
            name="name" placeholder="Name" className="p-2 text-black" value={dataInput.name} required />
          <input type="text" onChange={(e) => setDataInput({ ...dataInput, address: e.target.value })}
            name="address" placeholder="Address" className="p-2 text-black" value={dataInput.address} required />
          <select name="size" onChange={(e) => setDataInput({ ...dataInput, size: Number(e.target.value) })}
            className="border p-2 text-slate-700 bg-white" placeholder="Select acreage" value={dataInput.size}>
            <option value="10">10 acres</option>
            <option value="20">20 acres</option>
            <option value="30">30 acres</option>
            <option value="40">40 acres</option>
            <option value="50">50 acres</option>
          </select>
          <button type="submit" className="btn">Update</button>
        </form>
      </div>
    </div>
  )
}

function RowData({ d, onUpdate }: { d: Order, onUpdate: () => void }) {
  const [showModal, setShowModal] = useState<boolean>(false)

  const deleteOrder = async () => {
    const response = await fetch('http://localhost:5000/mars/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: d._id.$oid
      })
    })
    const msg = await response.json()
    console.log(msg)

    onUpdate()
  }

  return (
    <tr className="border-b" key={d._id.$oid}>
      <td>{d.name}</td>
      <td>{d.address}</td>
      <td>{d.size}</td>
      <td className="flex gap-4">
        <PencilSquareIcon onClick={() => setShowModal(true)} className="h-5 w-5 cursor-pointer" />
        <TrashIcon onClick={deleteOrder} className="h-5 w-5 cursor-pointer" />
        {showModal && <FormModal closeModal={() => setShowModal(false)} data={d} onUpdate={onUpdate} />}

      </td>
    </tr>
  )
}

function Table({ data, onUpdate }: TableProps) {

  return (
    <table className="table-auto border-collapse border-white w-full text-left">
      <thead>
        <tr className="border-b">
          <th>Name</th>
          <th>Address</th>
          <th>Acres</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data ?
          data.map((d) => (
            <RowData key={d._id.$oid} d={d} onUpdate={onUpdate} />
          ))
          :
          <tr>
            <td colSpan={4} className='text-center'>
              <p>No Orders</p>
            </td>
          </tr>
        }
      </tbody>
    </table>
  )
}

export default function Home() {
  const [data, setData] = useState<Order[]>()

  const getData = () => {
    fetch('http://localhost:5000/mars')
      .then(res => res.json())
      .then(
        (res) => setData(res),
        (error) => console.log(error.message)
      )
  }

  const posting = (e: any) => {
    e.preventDefault()

    fetch('http://localhost:5000/mars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: e.target.name.value,
        address: e.target.address.value,
        size: e.target.size.value
      })
    }).then(getData)
  }

  useEffect(getData, [])


  return (
    <main className="flex items-center py-16 flex-col gap-5 bg-image-body h-screen text-white overflow-auto">
      <div className="space-y-4 sm:w-[500px]">
        <div className="space-y-2">
          <h1 className="text-4xl">Buy Martian land!</h1>
          <h3 className="text-2xl">Price: $1.00 / acre</h3>
          <p>Did you know you could buy Martian land?<br />
            This chance won't come again!</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={posting}>
          <div className="relative pt-4">
            <input type="text" id="name" name="name" className="peer input w-full text-sm" placeholder=" " required />
            <label htmlFor="name" className="floating-label">Name</label>
          </div>
          <div className="relative pt-4">
            <input type="text" id="address" name="address" placeholder=" " className="peer input w-full text-sm" required />
            <label htmlFor="address" className="floating-label">Address</label>
          </div>
          <select name="size" className="input text-slate-400 focus:text-white" placeholder="Select acreage">
            <option value="10" className="text-black">10 acres</option>
            <option value="20" className="text-black">20 acres</option>
            <option value="30" className="text-black">30 acres</option>
            <option value="40" className="text-black">40 acres</option>
            <option value="50" className="text-black">50 acres</option>
          </select>
          <button type="submit" className="btn">Create order</button>
        </form>
        <Table data={data} onUpdate={getData} />
      </div>
    </main>
  )
}
