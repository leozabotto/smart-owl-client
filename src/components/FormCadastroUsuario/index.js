import React, { 
  useContext, 
  useState, 
  useReducer 
 } from 'react';

import { 
  TextField, 
  CircularProgress,
  MenuItem,
} from '@material-ui/core';

import PrimaryButton from '../Button';
import Modal from '../Modal';

import { HeaderSubtitle } from '../HeaderTitle';
import { SnackContext } from '../../contexts/SnackContext';

import './index.css';
import api from '../../services/api';


const FormCadastroUsuario = (props) => {

  const { setSnack } = useContext(SnackContext);

  const [loading, setLoading] = useState(false);
  
  const initialState = {   
    nome: "",   
    email: "",
    senha: "",
  }

  const reducer = (state, action) => {
    switch(action.type) {            
      case 'cgNome': 
        return {
          ...state,
          nome: action.value,
        }         
      case 'cgEmail': 
        return {
          ...state,
          email: action.value,
        }
      case 'cgSenha': 
        return {
          ...state,
          senha: action.value,
        }
      case 'resetForm':       
        return {
          ...initialState,          
        }
      default:
        return { ...state }
    }
  }
  
  const [form, dispatch] = useReducer(reducer, initialState);
 
  const handleSubmit = async () => {  

   if (form.lockedSubmit) {
      setSnack({
        message: 'Aguarde o cadastro!',
        type: 'error',
        open: true
      });
      return;
    }
  
    for (let i = 0; i < Object.keys(form).length; i++) {
      if(form[Object.keys(form)[i]] === '') {
        setSnack({ 
          message: 'Preencha todos os campos!', 
          type: 'error', 
          open: true
        });
        return;
      }
    }       

    setLoading(true);

    try {
      dispatch({ type: 'lockSubmit' });

      const usuario = await api.post('/administrador', { ...form })
      
      setSnack({
        message: 'Usuário cadastrado!',
        type: 'success',
        open: true,
      });
      
      dispatch({ type: 'resetForm' });     
      props.setUsuarioCriado(usuario);
      props.handleCreateModalClose();           
      
      setLoading(false);
    } catch (err) {   
      setSnack({ 
        message: 'Ocorreu um erro ao tentar cadastrar. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });
      console.log(err);
      dispatch({ type: 'unlockSubmit' });        
      setLoading(false);
    }
  }

  return (
    <Modal
      open={props.createModal}
      onClose={props.handleCreateModalClose}
      title={`Novo Usuário`}
      actions={
        <>        
          <PrimaryButton onClick={props.handleCreateModalClose}>CANCELAR</PrimaryButton>
          <PrimaryButton onClick={() => handleSubmit()}>CADASTRAR</PrimaryButton>
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
          <div>
            <form               
              onSubmit={handleSubmit} 
            >
              <HeaderSubtitle
                title="Informações do Usuário"
              />
              <div className="file-form-basic" style={{ display: 'flex', flexDirection: 'column', gap: 10}}>                                                                                             

                <div className="input-block">            
                  <TextField                                    
                    label="Nome"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.nome}
                    onChange={(e) => dispatch({
                      type: 'cgNome',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth                 
                  />  
                </div>
                <div className="input-block"> 
                  <TextField                                    
                    label="E-mail"
                    variant="outlined"
                    type="email"
                    autoComplete="off"
                    value={form.email}
                    onChange={(e) => dispatch({
                      type: 'cgEmail',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth                 
                  />  
                </div>
                <div className="input-block"> 
                  <TextField                                    
                    label="Senha"
                    variant="outlined"
                    type="password"
                    autoComplete="off"
                    value={form.senha}
                    onChange={(e) => dispatch({
                      type: 'cgSenha',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth                 
                  />    
                </div>                                                       
              </div>                                                  
            </form>
          </div>
        }
    </Modal>     
  );
};

export default FormCadastroUsuario;