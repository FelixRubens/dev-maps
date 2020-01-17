import React, {useEffect, useState} from 'react';
import api from './services/api.js'
import backGround from './assets/background.jpg'
import './global.css';
import './App.css';
import './Aside.css';
import './Main.css';


function App() {
  const [location, setLocation] = useState({longitude: 0, latitude: 0})
  const [github_username, setGithubUsername] = useState('')
  const [techs, setTechs] = useState([])
  const [devs, setDevs] = useState([])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {

        const value = {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude
        }

        setLocation(value)
      },
      (err) => {
        console.log(err)
      },
      {
        timeout: 30000
      }
    )
    
  },[])

  useEffect(() => {
    async function getDevs(){
      const response = await api.get('/devs')
      setDevs(response.data)
    }
    getDevs()
  }, [, devs])

  async function heandleAddDev(e){
    e.preventDefault()
    const response = await api.post('/devs', {
      github_username,
      techs,
      latitude: location.latitude,
      longitude: location.longitude
    });

    setGithubUsername('')
    setTechs([])

    console.log(response.data)
  }

  return (
    <>
      <div id="background" style={{  
      backgroundImage: `url(${backGround})`,
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
      }}>

      <div id="app">
        
      <aside>
        <strong>Cadastrar</strong>
        <form onSubmit = {heandleAddDev} >

          <div className="input-block">
            <label htmlFor="github_username">Usuário do Github</label>
            <input 
              name = "github_username" 
              id="github_username" 
              required
              value = {github_username}
              onChange = {(e) => setGithubUsername(e.target.value)}
              >
            </input>
          </div>

          <div className="input-block">
            <label htmlFor="techs">Tecnologias</label>
            <input 
              name = "techs" 
              id="techs" 
              required
              value = {techs}
              onChange = {(e) => setTechs(e.target.value)}
              >
            </input>
          </div>
      
          <div className="input-group">
            <div className="input-block">
              <label htmlFor="Latidude">Latidude</label>
              <input 
                disabled="disabled" 
                name = "Latidude" id="Latidude" 
                value = {location.latitude} 
                onChange = {(e) => {
                  const latiValue = e.target.value
                  const longiValue = location.longitude
                  setLocation({longiValue, latiValue}) }
                }  
                required>
              </input>
            </div>

            <div className="input-block">
              <label htmlFor="Longitude">Longitude</label>
              <input 
                disabled="disabled"
                name = "Longitude"
                id="Longitude" 
                value = {location.longitude}
                onChange = {(e) => {
                  const latiValue = location.latitude
                  const longiValue = e.target.value
                  setLocation({longiValue, latiValue}) }
                }  
                required>
              </input>
            </div>
          </div>

          <button type="submit">Salvar</button>
        </form>
      </aside>

      <main>
        <ul>
          {devs.map(dev => (
            <li key={dev._id} className = "dev-item">
              <header>
                <img src={dev.avatar_url} alt={dev.name}/>
                <div className="user-info">
                  <strong>{dev.github_username}</strong>
                  <span>{dev.techs.join(', ')}</span>
                </div>
              </header>
              <p>{dev.bio}</p>
              <a href={`http://github.com/${dev.github_username}`}>Acessar perfil no Github</a>
            </li>
            )
          )}
        </ul>
      </main>
    </div>
    </div>
    </>
  );
}

export default App;
