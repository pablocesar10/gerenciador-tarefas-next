import { NextPage } from "next";
import { useState } from "react"
import { executeRequest, saveUser } from "../services/api";
// import { LoginRequest } from "../types/LoginRequest";
import { LoginResponse } from "../types/LoginResponse";
import {Modal} from 'react-bootstrap';

type LoginProps = {
    setToken(s: string) : void
}

export const Login : NextPage<LoginProps> = ({setToken}) => {

    const [login, setLogin] = useState('');
    const [msgError, setError] = useState('');

    // state Modal
    const [showModal, setShowModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [name, setName] = useState('');
    const [email,setEmail] = useState('');
    const [confirmaEmail,setConfirmaEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmaPassword, setConfirmaPassword] = useState('');
    const cadastroOK = false;
    const closeModal = () => {
        setShowModal(false);
        setName('');
        setEmail('');
        setConfirmaEmail('');   
        setPassword('');
        setConfirmaPassword('');
        setErrorMsg('');
    }

    const doCadastro = async () => { 
        try {
            if (!name || !email || !confirmaEmail || !password) {
                setErrorMsg('Dados incompletos. Por favor verifique.');
                return;
            } 
            
            if (name.length < 2) {
                setErrorMsg ('Nome é muito curto. Digite nome completo.');
                return;
            }

            if (!(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(email))) {
                setErrorMsg('Por favor verifique o email digitado.');
                return;
            }

            if (email != confirmaEmail) {
                setErrorMsg('Email e confirmação não coincidem.');
                return;
            } 

            if (password.length < 6) {
                setErrorMsg('Digite uma senha maior que 5 caracteres.')
                return;
            }

            if (password != confirmaPassword) {
                setErrorMsg('Senha e confirmação de senha não coincidem.');
                return;
            }

            const body = {
                name,
                email,
                password
            }

            await saveUser('user', 'POST', body);
            closeModal();

        }catch(e){
            if(e?.response?.data?.error){
                console.log(e?.response);
                setErrorMsg(e?.response.data?.error);
                return;
            } else {
                const cadastroOK = true;
            }
            console.log(e);
            setErrorMsg('Erro ao realizar cadastro. Tente novamente');
        }
        setError('CADASTRO EFETUADO COM SUCESSO. FAÇA LOGIN');
    }

    const openModal = async () => {
        setShowModal(true);
        return   
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
                    <button onClick={openModal}>SignUp</button>
                    <Modal 
                    show={showModal}
                    onHide={() => closeModal()}                    
                    className="container-modal">
                        <Modal.Body>
                            <p>Faça seu Cadastro</p>
                            {errorMsg && <p className = "error">{errorMsg}</p>}

                            <input type="text"
                                placeholder="Seu nome completo"
                                value={name}
                                onChange={e => setName(e.target.value)}/>
                            <input type="text"
                                placeholder="E-mail"
                                value={email}
                                onChange={e => setEmail(e.target.value)}/>
                            <input type="text"
                                placeholder="Confirme seu e-mail"
                                value={confirmaEmail}
                                onChange={e => setConfirmaEmail(e.target.value)}/>
                            <input type="text"
                                placeholder="Digite uma senha maior que 5 caracteres"
                                value={password}
                                onChange={e => setPassword(e.target.value)}/>
                            <input type="text"
                                placeholder="Confirme sua senha"
                                value={confirmaPassword}
                                onChange={e => setConfirmaPassword(e.target.value)}/>

                        </Modal.Body>
                        <Modal.Footer>
                            <div className ="button col-12">
                                <button onClick={doCadastro}>Cadastrar</button>
                                <span onClick={closeModal}>Cancelar</span>
                            </div>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>

    )
}
