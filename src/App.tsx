import { useEffect, useRef, useState, useMemo } from 'react'
import './App.css'
import { type User } from "./types"
import { UsersList } from './components/UsersList'



function App() {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sortByCountry, setSortByCountry] = useState(false)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)
  const originalUsers = useRef<User[]>([])

  const toggleColors = ()=> {
    setShowColors(!showColors)
  }
  const toggleSortByCountry = () => {
    setSortByCountry(prevState => !prevState)
  }

  const handleReset = ()=>{
    setUsers(originalUsers.current)
  }

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => user.email !== email)
    setUsers(filteredUsers)
    
  }


  useEffect(()=>{
    fetch("https://randomuser.me/api?results=100")
    .then(async res => await res.json())
    .then(res => {
      setUsers(res.results)
      originalUsers.current = res.results
    })
    .catch(err=> {
      console.error(err)
    })
  }, [])

  const filteredUsers = useMemo (() => {
    return sortByCountry != null  && filterCountry && filterCountry.length > 0 ? users.filter(user=> {
      return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())
    }) : users
  }, [users, filterCountry])

  const sortedUsers = useMemo (() => { return sortByCountry ? [...filteredUsers].sort((a,b) =>{
    return a.location.country.localeCompare(b.location.country)
  }) : [...filteredUsers]
}, [filteredUsers, sortByCountry])
  
  return (
    <div className="App">
      <div className="container">
      <h1>Lista de Usuarios</h1>
      <div className="buttons">
      <header>
      <button className="filas" onClick={toggleColors}>
        Colorear Filas
      </button>

      <button onClick={toggleSortByCountry}>
        {sortByCountry ? "No ordenar por pais" : "Ordenar Por Pais"}
      </button>

      <button onClick={handleReset}>
        Resetear Estado
      </button>
    <input placeholder='Filtra por pais' onChange={(e) => {
      setFilterCountry(e.target.value)
    }}
     />
      </header>
      </div>
      </div>
      <div className='lista'>
      <main>
        <UsersList deleteUser={handleDelete} showColors={showColors} users={sortedUsers} />

      </main>
      </div>
    </div>
  )
}

export default App
