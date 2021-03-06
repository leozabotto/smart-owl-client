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
import AccessTimeIcon from '@material-ui/icons/AccessTime';

import moment from 'moment';

import FormCadastroTurma from '../../../components/FormCadastroTurma';

import { HeaderSubtitle } from '../../../components/HeaderTitle';
import { SnackContext } from '../../../contexts/SnackContext';

import Modal from '../../../components/Modal';

import api from '../../../services/api';

import './index.css';

import FormEdicaoTurma from '../../../components/FormEdicaoTurma';
import SelectUnidades from '../../../components/SelectUnidades';
import { CancelOutlined } from '@material-ui/icons';


const Unidades = () => {

  const { setSnack } = useContext(SnackContext);      
  
  const [turmaParaEditar, setTurmaParaEditar] = useState(null);
  const [turmaParaApurar, setTurmaParaApurar] = useState(null);
  const [turmaParaFechar, setTurmaParaFechar] = useState(null);
  const [modalEdicao, setModalEdicao] = useState(false);
  const [turmaEditada, setTurmaEditada] = useState({});

  const [modalCadastro, setModalCadastro] = useState(false);
  const [modalApurar, setModalApurar] = useState(false);
  const [modalFechar, setModalFechar] = useState(false);
  const [turmaCriada, setTurmaCriada] = useState({});

  const [loading, setLoading] = useState(false);

  //const [processandoRelatorio, setProcessandoRelatorio] = useState(false); 
  
  const [turmas, setTurmas] = useState([]); 

  const [unidade, setUnidade] = useState([]); 

  const handleChangeStatusTurma = async (status) => {
    try {

      const turmaFechada = await api.post('/action/change_status_turma', { id: turmaParaApurar ? turmaParaApurar.id : turmaParaFechar.id, status, });
      setSnack({ 
        message: 'Opera????o conclu??da!', 
        type: 'success', 
        open: true
      });

      handleModalApurarClose();
      handleModalFecharClose();
      handleFilter();

    } catch (err) {
      setSnack({ 
        message: 'Ocorreu um erro. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });

      console.log(err);
    }

  }

  const handleUnidadeChange = (value) => {
    setUnidade(value)
  }

  const [status, setStatus] = useState('Aberta'); 

  const handleStatusChange = (value) => {
    setStatus(value)
  }

  const handleCreateModalOpen = () => {
    setModalCadastro(true);
  }
    
  const handleCreateModalClose = () => {
    setModalCadastro(false);
  }

  const handleEditModalOpen = () => {
    setModalEdicao(true);
  }

  const handleEditModalClose = () => {
    setModalEdicao(false);
  }

  const handleModalApurarOpen = () => {
    setModalApurar(true);
  }

  const handleModalApurarClose = () => {
    setModalApurar(false);
  }

  const handleModalFecharOpen = () => {
    setModalFechar(true);
  }

  const handleModalFecharClose = () => {
    setModalFechar(false);
  }
  
  const handleSelecionarParaEditar = (turma) => {
    setTurmaParaEditar(turma); 
    handleEditModalOpen(); 
  }

  const handleSelecionarParaApurar = (turma) => {
    setTurmaParaApurar(turma); 
    handleModalApurarOpen(); 
  }

  const handleSelecionarParaFechar = (turma) => {
    setTurmaParaFechar(turma); 
    handleModalFecharOpen(); 
  }

  const handleUnselectToEdit = () => {
    setTurmaParaEditar(null);
  }   

  const handleFilter = async () => {
    try {

      const turmas = await api.get('/turma', { 
        params: {
          unidadeId: unidade.id, 
          status
        }
      });

      setTurmas(turmas.data);

    } catch (err) {
      setSnack({ 
        message: 'Ocorreu um erro ao buscar as turmas. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });

      console.log(err);
    }
  }

  const columns = [  
    { 
      field: 'actions', 
      headerName: 'A????es', 
      width: 100,
      sortable: false,
      renderCell: (turma) => {                    
        return (<>  
        {
          turma.row.status !== 'Aberta' ? ''
          :
          <IconButton 
           title={"Editar Turma"}
            onClick={() => {        
              handleSelecionarParaEditar(turma.row);        
            }
          }>
            <CreateOutlinedIcon />
          </IconButton> 
        }          
           
          {turma.row.status === 'Aberta' ?
           <IconButton 
           title={"Colocar em Apura????o"}
            onClick={() => {        
              handleSelecionarParaApurar(turma.row);        
            }
          }>
            <AccessTimeIcon />
          </IconButton>  : '' } 
          {turma.row.status === 'Em Apura????o' ?
           <IconButton 
           title={"Fechar Turma"}
            onClick={() => {        
              handleSelecionarParaFechar(turma.row);        
            }
          }>
            <CancelOutlined />
          </IconButton>  : '' }                                      
        </>);
      }
    },
    { 
      field: 'nome', 
      headerName: 'Nome', 
      width: 200,
      sortable: true,      
    },
    { 
      field: 'curso', 
      headerName: 'Curso', 
      width: 240,
      sortable: true,
      renderCell: (turma) => {
        return turma.row.curso.nome
      }
    },
    { 
      field: 'unidade', 
      headerName: 'Unidade', 
      width: 200,
      sortable: true,
      renderCell: (turma) => {
        return turma.row.unidade.nome
      }
    },
    { 
      field: 'periodo', 
      headerName: 'Per??odo', 
      width: 150,
      sortable: true,
    },
    { 
      field: 'modalidade', 
      headerName: 'Modalidade', 
      width: 200,
      sortable: true,
    },
    { 
      field: 'qtd_vagas', 
      headerName: 'Qtd. Vagas', 
      width: 150,
      sortable: true,
    },
    { 
      field: 'data_prova', 
      headerName: 'Data da Prova', 
      width: 200,
      sortable: true,
      renderCell: (turma) => {
        return moment(turma.row.data_prova).format('DD/MM/YYYY')
      }
    },
    { 
      field: 'hora_prova', 
      headerName: 'Hora da Prova', 
      width: 150,
      sortable: true,
    },
    { 
      field: 'data_encerramento', 
      headerName: 'Data Encerramento (Inscri????es)', 
      width: 200,
      sortable: true,
      renderCell: (turma) => {
        return moment(turma.row.data_encerramento).format('DD/MM/YYYY')
      }
    },
    { 
      field: 'data_resultado', 
      headerName: 'Data do Resultado', 
      width: 200,
      sortable: true,
      renderCell: (turma) => {
        return moment(turma.row.data_resultado).format('DD/MM/YYYY')
      }
    },
    { 
      field: 'pcd', 
      headerName: 'PCD?', 
      width: 200,
      sortable: true,
      renderCell: (turma) => {
        return turma.row.pcd === true ? 'Sim' : 'N??o'
      }
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 200,
      sortable: true,
    },
  ];

  useEffect(() => {
    document.title = 'Turmas | Smart Owl';         
  }, []);


  useEffect(() => {
    console.log(turmaCriada)
    if(Object.keys(turmaCriada).length !== 0) {
      let turma = {...turmaCriada.data };
      setTurmas(turmas.concat(turma));
    }   
  }, [turmaCriada])

  useEffect(() => {
    if(Object.keys(turmaEditada).length !== 0) {
      let turma = {...turmaEditada.data };      
      setTurmas(turmas.map(t => {
        if (t.id === turma.id) {
          t = turma;
        }
        return t;
      }));
    } 
  }, [turmaEditada])

  return (
    <AdmDrawer title="Turmas">
      <div className="master-dashboard">                
        <BackgroundCard>
          <BackgroundCardHeader title="Turmas">
            { /* processandoRelatorio */ false  ?
            <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </div>
            :
            <>
           
            <PrimaryButton variant="contained" size="large" title={"Nova Unidade"}
              onClick={() => handleCreateModalOpen()}  
            >
              <AddIcon />
            </PrimaryButton>
           
            <PrimaryButton variant="contained" size="large" title={"Gerar Relat??rio"} disabled>
                <PrintIcon />
            </PrimaryButton>
            </>
          }
          </BackgroundCardHeader>
          <HeaderSubtitle/>

          <div className="filter-form-container">
            <form className="filter-form" onSubmit={null} id="filter-form">
              <div className="filter-form-basic">
                <SelectUnidades 
                  value={unidade}
                  onChange={handleUnidadeChange}
                />

                <div className="input-block">
                  <TextField                                    
                    label="Status"
                    variant="outlined"
                    type="number"
                    autoComplete="off"
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    error={null}
                    fullWidth 
                    select                
                  >
                    <MenuItem value="Aberta" key="1">Aberta</MenuItem>
                    <MenuItem value="Fechada" key="2">Fechada</MenuItem>
                    <MenuItem value="Em Apura????o" key="3">Em Apura????o</MenuItem>
                  </TextField> 
                </div>
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
                rows={turmas} 
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

        <Modal
          open={modalApurar}
          onClose={handleModalApurarClose}
          title={`Voc?? deseja encerrar as inscri????es para esta turma?`}
          actions={
            <>   
              {loading ? '' : <>     
              <PrimaryButton onClick={handleModalApurarClose}>CANCELAR</PrimaryButton>
              <PrimaryButton onClick={() => handleChangeStatusTurma('Em Apura????o')}>SIM</PrimaryButton></>}
            </>
          }
        >
          {
            loading
            ?
            <div style=
            {{ 
                display: 'flex', 
                flexDirection: 'column',
                height: '100%',
                alignContent: 'center',
                alignItems: 'center',
            }}>
              <CircularProgress />
            </div>    
            :        
            <p>Isso colocar?? a turma em apura????o. (Esta a????o ?? irreverss??vel!)</p>
          }
      </Modal> 

      <Modal
          open={modalFechar}
          onClose={handleModalFecharClose}
          title={`Voc?? deseja encerrar a turma permanentemente?`}
          actions={
            <>   
              {loading ? '' : <>     
              <PrimaryButton onClick={handleModalFecharClose}>CANCELAR</PrimaryButton>
              <PrimaryButton onClick={() => handleChangeStatusTurma('Fechada')}>SIM</PrimaryButton></>}
            </>
          }
        >
          {
            loading
            ?
            <div style=
            {{ 
                display: 'flex', 
                flexDirection: 'column',
                height: '100%',
                alignContent: 'center',
                alignItems: 'center',
            }}>
              <CircularProgress />
            </div>    
            :        
            <p>Certifique-se de que todos os resultados foram disponibilizados e de que todos os alunos j?? est??o matriculados.</p>
          }
      </Modal> 

      <FormCadastroTurma  
        createModal={modalCadastro} 
        handleCreateModalClose={handleCreateModalClose}   
        type={'-'}     
        setTurmaCriada={setTurmaCriada}        
        allowKeepPosting
      />

      <FormEdicaoTurma 
        editModal={modalEdicao} 
        handleEditModalClose={handleEditModalClose}   
        type={'-'}     
        setTurmaEditada={setTurmaEditada}     
        turmaParaEditar={turmaParaEditar}
        handleUnselectToEdit={handleUnselectToEdit}
      />
    </AdmDrawer>
  );
};

export default Unidades;