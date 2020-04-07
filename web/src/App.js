import React, { useState, useEffect } from 'react';
import './Global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';
import api from './services/api';


function App() { 
  const [devs, setDevs] = useState([]);

  const [github_username, setGithub_username] = useState('');
  const [techs, setTechs] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // useeffect define calls to be run only once during the lifespan of the app
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;

        setLatitude(latitude);
        setLongitude(longitude);
      },
      (err)=>{
        console.log(err);
      },
      {
        timeout: 5000,
      }
    )

  }, []);

  useEffect(() => {
    async function loadDevs(){
      const response = await api.get('/devs');
      
      setDevs(response.data);
    }

    loadDevs();
  }, []);

  async function handleSubmit(e){
    e.preventDefault();
 
    const response = await api.post('/devs', {
      github_username,
      techs,
      latitude,
      longitude,
    });

    setGithub_username('');
    setTechs('');

    setDevs([...devs, response.data]);
  };

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <form onSubmit={handleSubmit}>
          <div className="input-block">
            <label htmlFor="github_username">Usuário do GitHub</label>
            <input name="github_username" id="github_username" required value={github_username} onChange={e => setGithub_username(e.target.value)}></input>
          </div>
          
          <div className="input-block">
            <label htmlFor="techs">Tecnologias</label>
            <input name="techs" id="techs" required value={techs} onChange={e => setTechs(e.target.value)}></input>
          </div>

          <div className="input-group">
            <div className="input-block">
              <label htmlFor="latitude">Latitude</label>
              <input type="number" name="latitude" id="latitude" required value={latitude} onChange={e => setLatitude(e.target.value)}></input>
            </div>
            <div className="input-block">
              <label htmlFor="longitude">Longitude</label>
              <input type="number" name="longitude" id="longitude" required value={longitude} onChange={e => setLongitude(e.target.value)}></input>
            </div>
          </div>

          <button type="submit">Salvar</button>   
        </form>
      </aside>

      <main>
        <ul>

          {devs.map(dev =>( 

          <li key={dev._id} className="devItem">
            <header>
              <img src={dev.avatar_url} alt={dev.name}/>
              <div className="user-info">
                <strong>{dev.name}</strong>
                <span>{dev.techs.join(', ')}</span>
              </div>
            </header>
            <p>{dev.bio}</p>
            <a href={`http://github.com/${dev.github_username}`}>Acessar Perfil no GitHub</a>
          </li>
          ) )}
          
        </ul>
      </main>
    </div>
  );
}

export default App;



/*Componente = função que retorna conteúdo; e.g. f. App() abaixo. Bloco isolado de HTML, CSS, JS que não interfere no restante da aplicação.

Propriedade = Atributo do HTML; Informações que um componente pai passa para um componente filho. 
function App(props){
  return <h1>{props.title}</h1>
}

Estado = Informações mantidas e atualizadas pelo componente; React trabalha com 'Imutabilidade'. 
import  { useState }
[counter, setCounter] = useState(0)
setCounter(counter + 1) 
 */