import React, { useContext, useEffect, useState } from 'react';

import { 
  CircularProgress  
} from '@material-ui/core'

import { DataGrid, ptBR } from '@material-ui/data-grid';

import AddIcon from '@material-ui/icons/Add';
import PrintIcon from '@material-ui/icons/PrintOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined'

import AdmDrawer from '../../../components/AdmDrawer';
import BackgroundCard from '../../../components/BackgroundCard';
import PrimaryButton from '../../../components/Button';
import BackgroundCardHeader from '../../../components/BackgroundCardHeader';
import IconButton from '../../../components/IconButton'
import { HeaderSubtitle } from '../../../components/HeaderTitle';
import { SnackContext } from '../../../contexts/SnackContext';

import api from '../../../services/api';

import './index.css';
import FormEdicaoUnidade from '../../../components/FormEdicaoUnidade';
import FormCadastroUsuario from '../../../components/FormCadastroUsuario';


const Usuarios = () => {

  const { setSnack } = useContext(SnackContext);      
  
  const [unidadeParaEditar, setUnidadeParaEditar] = useState(null);
  const [modalEdicao, setModalEdicao] = useState(false);
  const [unidadeEditada, setUnidadeEditada] = useState({});

  const [modalCadastro, setModalCadastro] = useState(false);
  const [unidadeCriada, setUsuarioCriado] = useState({});

  const [loading, setLoading] = useState(false);

  //const [processandoRelatorio, setProcessandoRelatorio] = useState(false); 
  
  const [usuarios, setUsuarios] = useState([]); 

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
  
  const handleSelecionarParaEditar = (account) => {
    setUnidadeParaEditar(account); 
    handleEditModalOpen(); 
  }

  const handleUnselectToEdit = () => {
    setUnidadeParaEditar(null);
  }   

  const columns = [  
    { 
      field: 'id', 
      headerName: 'Ações', 
      width: 100,
      sortable: false,
      renderCell: (account) => {                      
        return (<>            
          <IconButton 
           disabled={true}
           title={"Editar Usuário"}
            onClick={() => {        
              handleSelecionarParaEditar(account.row);        
            }
          }>
            <CreateOutlinedIcon />
          </IconButton>                                
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
      field: 'email', 
      headerName: 'E-mail', 
      width: 200,
      sortable: true,
    },        
  ];

  useEffect(() => {
    document.title = 'Usuários | Smart Owl';  
    
    async function getUsuarios() {
      try {
        setLoading(true);
        const usuarios = await api.get('/administrador');       
        setUsuarios(usuarios.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setSnack({ 
          message: 'Erro ao buscar os usuarios!' + err.mensagem, 
          type: 'error', 
          open: true 
        });
      }
    }
    getUsuarios();

  }, [setSnack, setUsuarios]);


  useEffect(() => {
    if(Object.keys(unidadeCriada).length !== 0) {
      let unidade = {...unidadeCriada.data };
      setUsuarios(usuarios.concat(unidade));
    }   
  }, [unidadeCriada])

  return (
    <AdmDrawer title="Usuários">
      <div className="master-dashboard">                
        <BackgroundCard>
          <BackgroundCardHeader title="Usuários">
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
           
            <PrimaryButton variant="contained" size="large" title={"Gerar Relatório"} disabled>
                <PrintIcon />
            </PrimaryButton>
            </>
          }
          </BackgroundCardHeader>
          <HeaderSubtitle/>
        
          {
            loading ?
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px'}}>              
              <CircularProgress />
            </div>
            :
            <>
            <div style={{ height: '70vh', width: '100%', marginTop: '40px'}}>  
              <DataGrid 
                rows={usuarios} 
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

      <FormCadastroUsuario     
        createModal={modalCadastro} 
        handleCreateModalClose={handleCreateModalClose}   
        type={'-'}     
        setUsuarioCriado={setUsuarioCriado}        
      />

    </AdmDrawer>
  );
};

export default Usuarios;