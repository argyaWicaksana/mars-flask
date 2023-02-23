'use client'
import { useEffect, useState } from "react"
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'

interface Order {
  _id: { $oid: string },
  name: string,
  address: string,
  size: number
}

function RowData({ d, onUpdate }: { d: Order, onUpdate: ()=> void }) {
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

  const updateOrder = async () => {
        
  }

  return (
    <tr className="border-b" key={d._id.$oid}>
      <td>{d.name}</td>
      <td>{d.address}</td>
      <td>{d.size}</td>
      <td className="space-x-4">
        <button><PencilSquareIcon className="h-5 w-5" /></button>
        <button onClick={deleteOrder}><TrashIcon className="h-5 w-5" /></button>
      </td>
    </tr>
  )
}

function Table({ data, onUpdate }: { data: Order[] | undefined, onUpdate: ()=> void }) {

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
            <RowData d={d} onUpdate={onUpdate} />
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
    <main className="flex items-center py-16 flex-col gap-5 bg-image-body h-screen text-white">
      <div className="space-y-4 sm:w-[500px]">
        <div className="space-y-2">
          <h1 className="text-4xl">Buy Martian land!</h1>
          <h3 className="text-2xl">Price: $1.00 / acre</h3>
          <p>Did you know you could buy Martian land?<br />
            This chance won't come again!</p>
        </div>
        <form className="flex flex-col gap-3" onSubmit={posting}>
          <input type="text" name="name" placeholder="Name" className="p-2 text-black" required />
          <input type="text" name="address" placeholder="Address" className="p-2 text-black" required />
          <select name="size" className="border p-2 text-slate-700 bg-white" placeholder="Select acreage">
            <option value="10">10 acres</option>
            <option value="20">20 acres</option>
            <option value="30">30 acres</option>
            <option value="40">40 acres</option>
            <option value="50">50 acres</option>
          </select>
          <button type="submit" className="p-2 bg-yellow-400 text-black">Create order</button>
        </form>
        <Table data={data} onUpdate={getData} />
      </div>
    </main>
  )
}
