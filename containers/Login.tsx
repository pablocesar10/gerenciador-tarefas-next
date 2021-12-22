import { NextPage } from "next";
import { useState } from "react"
import { executeRequest } from "../services/api";
import { LoginRequest } from "../types/LoginRequest";
import { LoginResponse } from "../types/LoginResponse";
import {Modal} from 'react-bootstrap';
// import {CrudModal} from '../components/Modal';

type LoginProps = {
    setToken(s: string) : void
}

export const Login : NextPage<LoginProps> = ({setToken}) => {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [msgError, setError] = useState('');

    // state Modal
    const [showModal, setShowModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [userName, setUserName] = useState('');
    const [name, setName] = useState('');
    const [email,setEmail] = useState('');
    const [confirmaEmail,setConfirmaEmail] = useState('');
    const [passwordSignUp, setPasswordSignUp] = useState('');


    const closeModal = () => {
        setShowModal(false);
        setUserName('');
        setName('');
        setEmail('');
        setConfirmaEmail('');   
        setPasswordSignUp('');
    }

    const doSave = async () => { 
        try {
            if (email != confirmaEmail) {
                setErrorMsg('Email e confirmação não coincidem. Por favor verifique.');
                return;
            } 

            if (passwordSignUp.length < 6) {
                setErrorMsg('Escolha uma senha com mais de 6 caracteres.')
                return;
            }

            if (!userName || !name || !email || !confirmaEmail || !passwordSignUp) {
                setErrorMsg('Campos não estão completos. Por favor verifique.');
                return;
            } 

            if (name.length < 2) {
                setErrorMsg ('Nome é muito curto. Favor incluir um nome maior');
                return;
                }

                const body = {
                    userName,
                    name,
                    email,
                    passwordSignUp
                }

                await executeRequest('signUp', 'POST', body);
                await getIncludeUser();
                closeModal();


        }catch(e){
            if(e?.response?.data?.error){
                console.log(e?.response);
                setErrorMsg(e?.response.data?.error);
                return;
            }
            console.log(e);
            setErrorMsg('Ocorreu um erro ao realizar o cadastro. Por favor, tente novamente');
        }
    }

    const doSignUp = async () => {
        setShowModal(true);
        return   

        // CRIAR MENSAGEM DE ERRO

        }

    const doLogin = async () => {
        try {
            if (!login || !password) {
                setError('Favor preencher os dados');
                return;
            }

            setError(' ');

            const body = {
                login,
                password
            };

            const result = await executeRequest('login', 'POST', body);
            if(result && result.data){
                const loginResponse = result.data as LoginResponse;
                localStorage.setItem('accessToken', loginResponse.token);
                localStorage.setItem('userName', loginResponse.name);
                localStorage.setItem('userEmail', loginResponse.email);
                setToken(loginResponse.token);
            }
        } catch (e : any) {
            if(e?.response?.data?.error){
                console.log(e?.response);
                setError(e?.response?.data?.error);
                return;
            }
            console.log(e);
            setError('Erro ao efetuar login, tente novamente');
        }
    }


    return (
        <div className="container-login">
            <img src="/logo.svg" alt="Logo Fiap" className="logo" />
            <div className="form">
                {msgError && <p>{msgError}</p>}
                <div className="input">
                    <img src="/mail.svg" alt="Informe seu email" />
                    <input type="text" placeholder="Informe seu email"
                        value={login} onChange={evento => setLogin(evento.target.value)} />
                </div>
                <div className="input">
                    <img src="/lock.svg" alt="Informe sua senha" />
                    <input type="password" placeholder="Informe sua senha"
                        value={password} onChange={evento => setPassword(evento.target.value)} />
                </div>
                <div className="buttons">
                    <button onClick={doLogin}>Login</button>
                    <button onClick={doSignUp}>SignUp</button>
                    <Modal show={showModal} onHide={() => closeModal()} className="container-modal">
                        <Modal.Body>
                            <p>Faça seu Cadastro</p>
                            {errorMsg && <p className = "error">{errorMsg}</p>}
                            <input type="text"
                                placeholder="Escolha um nome de usuário"
                                value={userName}
                                onChange={e => setUserName(e.target.value)}/>
                            <input type="text"
                                placeholder="Nome completo"
                                value={name}
                                onChange={e => setName(e.target.value)}/>
                            <input type="text"
                                placeholder="E-mail"
                                value={email}
                                onChange={e => setEmail(e.target.value)}/>
                            <input type="text"
                                placeholder="confirme seu e-mail"
                                value={confirmaEmail}
                                onChange={e => setConfirmaEmail(e.target.value)}/>
                            <input type="text"
                                placeholder="senha com mais de 6 caracteres"
                                value={passwordSignUp}
                                onChange={e => setPasswordSignUp(e.target.value)}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className ="button col-12">
                                <button onClick={doSave}>Cadastrar</button>
                                <span onClick={closeModal}>Cancelar</span>
                            </div>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>

    )
}
