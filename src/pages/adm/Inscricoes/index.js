import React, { useContext, useEffect, useState } from 'react';

import { 
  CircularProgress, MenuItem, TextField
} from '@material-ui/core'

import { DataGrid, ptBR } from '@material-ui/data-grid';

import AddIcon from '@material-ui/icons/Add';
import PrintIcon from '@material-ui/icons/PrintOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined'

import AdmDrawer from '../../../components/AdmDrawer';
import BackgroundCard from '../../../components/BackgroundCard';
import PrimaryButton from '../../../components/Button';
import BackgroundCardHeader from '../../../components/BackgroundCardHeader';
import IconButton from '../../../components/IconButton';

import FormCadastroTurma from '../../../components/FormCadastroTurma';

import { HeaderSubtitle } from '../../../components/HeaderTitle';
import { SnackContext } from '../../../contexts/SnackContext';

import Modal from '../../../components/Modal';

import api from '../../../services/api';

import './index.css';

import FormEdicaoTurma from '../../../components/FormEdicaoTurma';
import SelectUnidades from '../../../components/SelectUnidades';
import { CancelOutlined } from '@material-ui/icons';
import SelectTurmas from '../../../components/SelectTurmas';
import moment from 'moment';



const Inscricoes = () => {

  const { setSnack } = useContext(SnackContext);        

  const [loading, setLoading] = useState(false);

  const [inscricoes, setInscricoes] = useState([])

  const handleTurmaChange = (value) => {
    setTurma(value)
  }
  
  const [turma, setTurma] = useState([]); 

  const handleFilter = async () => {
    try {

      const inscricoes = await api.get('/inscricao', { 
        params: {
          turmaId: turma?.id
        }
      });

      setInscricoes(inscricoes.data)

    } catch (err) {
      setSnack({ 
        message: 'Ocorreu um erro ao buscar os dados. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });

      console.log(err);
    }
  }

  const handleStatusChange = async (status, id) => {
    try {

      await api.post('/action/change_status_inscricao', { id, status, })
      setSnack({ 
        message: 'Operação concluída!', 
        type: 'success', 
        open: true
      });

      handleFilter();

    } catch (err) {
      setSnack({ 
        message: 'Ocorreu um erro alterar o status. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });

      console.log(err);
    }
  }

  const columns = [  
    { 
      field: 'id', 
      headerName: 'Protocolo', 
      width: 150,
      sortable: true,      
    },
    { 
      field: 'candidato', 
      headerName: 'Candidato', 
      width: 200,
      sortable: true,  
      renderCell: (turma => {
        return turma.row.candidato.nome
      })    
    },
    { 
      field: 'email', 
      headerName: 'E-mail', 
      width: 240,
      sortable: true, 
      renderCell: (turma => {
        return turma.row.candidato.email
      })     
    },
    { 
      field: 'celular', 
      headerName: 'Celular', 
      width: 200,
      sortable: true,   
      renderCell: (turma => {
        return turma.row.candidato.celular
      })  
    },
    { 
      field: 'dataInscricao', 
      headerName: 'Data de Inscrição', 
      width: 200,
      sortable: true,
      renderCell: (turma => {
        return moment(turma.row.createdAt).format("DD/MM/YYYY")
      })
    },  
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 280,
      sortable: true,
      renderCell: (inscricao) => {                    
        return (<>            
           <TextField
              name="genero"
              type="text"
              variant="outlined"
              value={inscricao.row.status}
              onChange={(e) => handleStatusChange(e.target.value, inscricao.row.id) }             
              select
              required={true}
              disabled={inscricao.row.turma?.status === 'Fechada' || inscricao.row.status === 'MATRÍCULA SOLICITADA' ? true : false}
            >
              <MenuItem value={"PROVA PENDENTE"} key={1}>PROVA PENDENTE</MenuItem>
              <MenuItem value={"AGUARDANDO RESULTADO"} key={1}>AGUARDANDO RESULTADO</MenuItem>
              <MenuItem value={"APROVADO"} key={2}>APROVADO</MenuItem>
              <MenuItem value={"NÃO APROVADO"} key={3}>NÃO APROVADO</MenuItem>
              <MenuItem value={"MATRÍCULA SOLICITADA"} key={3}>MATRÍCULA SOLICITADA</MenuItem>
            </TextField>                                               
        </>);
      }   
    },
    { 
      field: 'encerrada', 
      headerName: 'Encerrada', 
      width: 200,
      sortable: true, 
      renderCell: (turma) => {
        return turma.row.encerrada ? 'SIM' : 'NÃO'
      }       
    },   
  ];

  useEffect(() => {
    document.title = 'Inscrições | Smart Owl';         
  }, []);


  return (
    <AdmDrawer title="Inscrições">
      <div className="master-dashboard">                
        <BackgroundCard>
          <BackgroundCardHeader title="Inscrições">
            { /* processandoRelatorio */ false  ?
            <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </div>
            :
            <>                                
            <PrimaryButton variant="contained" size="large" title={"Gerar Relatório"} disabled>
                <PrintIcon />
            </PrimaryButton>
            </>
          }
          </BackgroundCardHeader>
          <HeaderSubtitle/>

          <div className="filter-form-container">
            <form className="filter-form" onSubmit={null} id="filter-form">
              <div className="filter-form-basic">
                <SelectTurmas 
                  value={turma}
                  onChange={handleTurmaChange}
                />               
                <div className="input-block">
                  <PrimaryButton size="large" variant="contained" onClick={() => handleFilter()}>Buscar</PrimaryButton>
                </div> 
              </div>
            </form>
          </div>
        
          {
            loading ?
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px'}}>              
              <CircularProgress />
            </div>
            :
            <>
            <div style={{ height: '70vh', width: '100%', marginTop: '40px'}}>  
              <DataGrid 
                rows={inscricoes} 
                columns={columns} 
                pageSize={50} 
                localeText={ptBR.props.MuiDataGrid.localeText}              
                disableSelectionOnClick              
              />
            </div> 
            </>
          }                                                              
         
        
        </BackgroundCard>                  
      </div>
   
    </AdmDrawer>
  );
};

export default Inscricoes;