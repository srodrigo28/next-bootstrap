'use client'

import './App.css'
import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react'
import { Bounce, toast } from 'react-toastify';
import { FaPen, FaTrash } from 'react-icons/fa';

interface ICategoria {
  id: string;  
  nome: string;  
  desc: string;  
}

export default function Home() {
  const url = "http://localhost:8080/categoria"
  
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [desc, setDesc] = useState("");
  
  const [data, setData] = useState([]);
  const [classInserir, setClassInserir] = useState("");
  const [classEditar, setClassEditar] = useState("sumir");

  // Listar
  useEffect(() => {
    axios.get(url)
      .then(res => setData(res.data))
  }, [data, setData]);

  // Inserir
  const Inserir = () => {
    axios.post(url, {
      nome,
      desc
    })
  }

  /* Valida os Campos */
  const Cadastrar = (event: FormEvent) => {
    event.preventDefault();

    if (nome === "") {
      alert("Insira um Nome da Categoria!")
      return true;
    } else if (desc === "") {
      alert("Insira uma Descrição da Categoria!")
      return true;
    } else {
      toast.success('O Cadastro foi realizado com Sucesso!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        transition: Bounce
      })

      Inserir();
    }

    setNome("");
    setDesc("");
  }

  /* Remover */
  const Remover = (id: string, nome: string) => {
    // alert("Deletando no id: " + id)

    const confirm = window.confirm('Deseja realmente apagar  ? ' + nome )

    if(confirm){  
      setId(id)

      axios.delete(url + "/" + id)
      toast.success('A Categoria foi Apagada com Sucesso!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }

  }

  /* Carregar campos */
  const Carregar = (id: string, nome: string, desc: string) => {
    // alert("Id: " + id + " Nome: " + nome + " Descrição: " + desc);

    setId(id);
    setNome(nome);
    setDesc(desc);

    setClassEditar("");
    setClassInserir("sumir");
  }

  /* Carregar campos */
  const Editar = async (event: FormEvent) => {
    event.preventDefault();

    // console.log("Nome: " + nome + " Desc: " + desc);

    await axios.put(url + "/" + id, {
      nome,
      desc
    })
    .then(() => {
      toast.success('A Categoria foi Editada com Sucesso!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });

      setId("")
      setNome("")
      setDesc("")

      setClassEditar("sumir")
      setClassInserir("")
    })
  }

  /* Mostrar na tela */
  return (
    <div className="container mt-4">      
      <h2>Cadastro de Categorias</h2>

      <form className="mt-5 mb-4">
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              placeholder='Nome da Categoria'
              className='form-control'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          
          <div className="col">
            <input
              type="text"
              placeholder='Descrição da Categoria'
              className='form-control'
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>

        <div className="d-flex items-start gap-2">
          <button className={`btn btn-success rounded-md ${classInserir}`} onClick={Cadastrar}>Inserir</button>
          <button className={`btn btn-warning rounded-md ${classEditar}`} onClick={Editar}>Alterar</button>
        </div>
      </form>

      <h2 className='mb-4'>Lista de Categorias</h2>
      <table className="table table">
        <thead>
          <tr>
            <td>ID</td>
            <td>Categoria</td>
            <td>Descrição</td>
            <td>Ações</td>
          </tr>
        </thead>
        <tbody>
          {data.map((item: ICategoria) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nome}</td>
              <td className='mx-2'>{item.desc}</td>
              <td className="mx-2">
                <button className="btn btn-warning mx-2" onClick={() => Carregar(item.id, item.nome, item.desc)}>
                  <FaPen  />
                </button>

                <button className="btn btn-danger" onClick={() => Remover(item.id, item.nome)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}