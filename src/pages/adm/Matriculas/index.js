import React, { useContext, useEffect, useState } from 'react';

import { 
  CircularProgress, MenuItem, TextField
} from '@material-ui/core'

import { DataGrid, ptBR } from '@material-ui/data-grid';

import AddIcon from '@material-ui/icons/Add';
import PrintIcon from '@material-ui/icons/PrintOutlined';
import download from 'downloadjs';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined'

import AdmDrawer from '../../../components/AdmDrawer';
import BackgroundCard from '../../../components/BackgroundCard';
import PrimaryButton from '../../../components/Button';
import BackgroundCardHeader from '../../../components/BackgroundCardHeader';
import PrintOutlinedIcon from '@material-ui/icons/PrintOutlined';
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


const Matriculas = () => {

  const { setSnack } = useContext(SnackContext);        

  const [loading, setLoading] = useState(false);

  const [matriculas, setMatriculas] = useState([])
  const [modalRelatorio, setModalRelatorio] = useState(false);

  const handleModalRelatorioOpen = () => {
    setModalRelatorio(true)
  }

  const handleModalRelatorioClose = () => {
    setModalRelatorio(false)
  }

  const handleTurmaChange = (value) => {
    setTurma(value)
  }
  
  const [turma, setTurma] = useState([]); 

  const handleRelatorio = async (matriculaId) => {
    try {
      handleModalRelatorioOpen();

      const pdf = await api.post('relatorio', {
          reportType: 'ficha_candidato',  
          matriculaId,
        }, { responseType: 'blob',  
      })
     
      download(pdf.data, 'Ficha do Candidato.pdf');
      handleModalRelatorioClose();
      setLoading(false);
      

    } catch (err) {
      setSnack({ 
        message: 'Ocorreu um erro. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });
      handleModalRelatorioClose();
    }

  }

  const handleStatusChange = async (status, id) => {
    try {

      await api.post('/action/change_status_matricula', { id, status, })
      setSnack({ 
        message: 'Opera????o conclu??da!', 
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


  const handleFilter = async () => {
    try {
      const res = await api.get('/matricula', { 
        params: {
          turmaId: turma?.id,
        }
      });

      setMatriculas(res.data);

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
      renderCell: (matricula) => {                    
        return (<>            
          <IconButton 
           title={"Imprimir Ficha"}
            onClick={() => {        
              handleRelatorio(matricula.row.id);   
            }
          }>
            <PrintOutlinedIcon />
          </IconButton>                                               
        </>);
      }
    },
    { 
      field: 'id', 
      headerName: 'Protocolo', 
      width: 200,
      renderCell: (matricula) => {                    
        return  matricula.row.inscricao.id
      },
      sortable: true,         
    },
    { 
      field: 'candidato', 
      headerName: 'Candidato', 
      width: 200,
      sortable: true, 
      renderCell: (matricula) => {                    
        return  matricula.row.candidato.nome
      }     
    },
    { 
      field: 'email', 
      headerName: 'E-mail', 
      width: 240,
      sortable: true, 
      renderCell: (matricula) => {                    
        return  matricula.row.candidato.email
      }      
    },
    { 
      field: 'celular', 
      headerName: 'Celular', 
      width: 200,
      sortable: true,   
      renderCell: (matricula) => {                    
        return  matricula.row.candidato.celular
      }   
    },
    { 
      field: 'dataSolicitacao', 
      headerName: 'Data de Solicita????o', 
      width: 200,
      sortable: true,
      renderCell: (matricula) => {                    
        return moment(matricula.row.createdAt).format('DD/MM/YYYY HH:mm')
      } 
    },  
    { 
      field: 'turma', 
      headerName: 'Turma', 
      width: 200,
      sortable: true,
      renderCell: (matricula) => {                    
        return matricula.row.turma.nome
      } 
    }, 
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 230,
      sortable: true,
      renderCell: (matricula) => {                    
        return (<>            
          <TextField
            name="genero"
            type="text"
            variant="outlined"
            value={matricula.row.status}
            onChange={(e) => handleStatusChange(e.target.value, matricula.row.id) }            
            select
            required={true}
            disabled={matricula.row.turma?.status === 'Fechada' ? true : false}
          >
            <MenuItem value={"CONTATO PENDENTE"} key={1}>CONTATO PENDENTE</MenuItem>
            <MenuItem value={"AGUARDANDO RETORNO"} key={2}>AGUARDANDO RETORNO</MenuItem>
            <MenuItem value={"DOCUMENTOS PENDENTES"} key={3}>DOCUMENTOS PENDENTES</MenuItem>
            <MenuItem value={"MATR??CULA EFETIVADA"} key={4}>MATR??CULA EFETIVADA</MenuItem>
            <MenuItem value={"DESIST??NCIA"} key={5}>DESIST??NCIA</MenuItem>
          </TextField>                                                  
        </>);
      }
    },  
  ];

  useEffect(() => {
    document.title = 'Solicita????es de Matr??cula | Smart Owl';         
  }, []);

  return (
    <AdmDrawer title="Solicita????es de Matr??cula">
      <div className="master-dashboard">                
        <BackgroundCard>
          <BackgroundCardHeader title="Solicita????es de Matr??cula">
            { /* processandoRelatorio */ false  ?
            <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </div>
            :
            <>                                
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
                rows={matriculas} 
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
        open={modalRelatorio}
        onClose={handleModalRelatorioClose}
        title={`Gerando ficha do candidato. Aguarde...`}
        actions={
          <>              
          </>
        }
        >        
          <CircularProgress />            
      </Modal> 
    </AdmDrawer>
  );
};

export default Matriculas;