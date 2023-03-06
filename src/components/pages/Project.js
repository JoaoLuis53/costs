import { parse, v4 as uuidv4} from 'uuid';

import styles from './Project.module.css';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Loading from '../Layout/Loading';
import  Container  from '../Layout/Container';
import ProjectForm from '../project/ProjectForm';
import ServiceForm from '../service/ServiceForm';
import ServiceCard from '../service/ServiceCard';
import Message from '../Layout/Message';

const Project = () => {
  const { id } = useParams();

  const [project, setProject] = useState([]);
  const [services, setServices] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [message, setMessage] = useState();
  const [type, setType] = useState();


  useEffect(() => {
    setTimeout(()=> {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(data)
            setServices(data.services)
        })
        .catch((err) => console.log);
    },3000);
  },[id]);

  const editPost = (project) => {
         setMessage('');
      if(project.budget < project.cost) {
          setMessage('O Orçamento não pode ser menor que o custo do projeto!');
          setType('error');
          return false;
      }

      fetch(`http://localhost:5000/projects/${project.id}`, {
        method: 'PATCH',
        headers: {
                'Content-type': 'application/json',
        },
        body: JSON.stringify(project),
      })
      .then((resp) => resp.json())
      .then((data) => {
          setProject(data)
          setShowProjectForm(false)
          setMessage('Projeto Atualizado!');
          setType('success');
      })
      .catch((err) => console.log(err));
  }


  const createService = (project) => {
    setMessage('');

      const lastService = project.services[project.services.length - 1];
    
      lastService.id = uuidv4();

      const lastServiceCost = lastService.cost;
      const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

      if(newCost > parseFloat(project.budget)) {
          setMessage('Orçamento ultrapassado, verifique o valo do serviço');
          setType('error');
          project.services.pop();
          return false;
      }

      project.cost = newCost;
      fetch(`http://localhost:5000/projects/${project.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(project)
      })
      .then((resp) => resp.json())
      .then((data) => {
         setShowServiceForm(false);
      })
      .catch((err) => console.log(err));
  }

  const toglleProjectForm = () => {
    setShowProjectForm(!showProjectForm);
  }

  const removeService = (id, cost) => {
    setMessage('');
      const servicesUpdated = project.services.filter(
        (service) => service.id !== id
      )
      const projectUpdated = project

      projectUpdated.services = servicesUpdated
      projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

      fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectUpdated)
      })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(projectUpdated)
        setServices(servicesUpdated)
        setMessage('Serviço removido com Sucesso')
        setType('success');
      })
      .catch((err) => console.log(err))
  }

  const toglleServiceForm = () => {
    setShowServiceForm(!showServiceForm);
  }
   
    return (
        <>
         {project.name ?( 
             <div className={styles.project_details}>
                 <Container customClass="column">
                    {message && <Message type={type} msg={message} />}
                    <div className={styles.details_container}>
                        <h1> Projeto: {project.name}</h1>
                        <button className={styles.btn} onClick={toglleProjectForm}>
                            {!showProjectForm ? 'Editar Projeto' : 'Fechar'}
                        </button>
                        {!showProjectForm ? (
                            <div className={styles.project_info}>
                                <p>
                                    <span>Categoria:</span> {project.category.name}
                                </p>
                                <p>
                                    <span>Total de Orçamento:</span> R${project.budget}
                                </p>
                                <p>
                                    <span>Total Utilizado:</span> R${project.cost}
                                </p>
                            </div>
                        ) : (
                            <div className={styles.project_info}>
                                <ProjectForm 
                                     handleSubmit={editPost}
                                     btnText="Concluir Edição"
                                     projectData={project}
                                />
                            </div>
                        )}
                    </div>
                    <div className={styles.service_form_container}>
                        <h2>Adicione um Serviço:</h2>
                        <button className={styles.btn} onClick={toglleServiceForm}>
                            {!showServiceForm ? 'Adicionar Serviços' : 'Fechar'}
                        </button>
                        <div className={styles.project_info}>
                            {showServiceForm &&
                                 <ServiceForm 
                                     handleSubmit={createService}
                                     textBtn="Adicionar Serviço"
                                     projectData={project}
                                 />
                             }
                        </div>
                    </div>
                    <h2>Serviços:</h2>
                    <Container customClass="start">
                       {services.length > 0 &&
                           services.map((service) => (
                            <ServiceCard 
                            key={service.id}
                            id={service.id}
                            name={service.name}
                            cost={service.cost}
                            description={service.description}
                            handleRemove={removeService}
                        />
                           ))}
                        {services.length === 0 && <p>Não há Serviços Cadastrados</p>}
                    </Container>
                 </Container>
             </div>
         ) : (
             <Loading />
         )}   
        </>
    );
}

export default Project;