import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { BiExit } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { RequestContext } from "../context/RequestContext";

export default function HomePage() {
  const { setRequest, request } = useContext(RequestContext);
  const navigate = useNavigate();
  const [transac, setTransac] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const name = localStorage.getItem("name");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedPass = localStorage.getItem("passc");
    if (!storedUser || !storedPass) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const config = {
      headers: {
        authorization: `Bearer ${storedToken}`,
      },
    };
    const response = axios.get(
      `${import.meta.env.VITE_API_URL}/transactions`,
      config
    );
    response.then((response) => {
      const arr = response.data.reverse();
      setTransac(arr);
      const valores = response.data.map((data) => {
        const value = parseFloat(data.data.value);
        if (data.data.type === "entrada") {
          return value;
        } else if (data.data.type === "saida") {
          return -value;
        }
        return 0;
      });
      const total = valores.reduce((acc, curr) => acc + curr, 0);
      setSaldo(total);
    });
    response.catch((error) => {
      alert(error);
    });
  }, []);

  function exit() {
    const storedToken = localStorage.getItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("passc");
    const config = {
      headers: {
        authorization: `Bearer ${storedToken}`,
      },
    };
    const promise = axios.post(
      `${import.meta.env.VITE_API_URL}/logoff`,
      {},
      config
    );
    promise.then((res) => {
      localStorage.removeItem("token");
      navigate("/");
    });
    promise.catch((res) => console.log(res));
  }

  function handleClick(tipo) {
    navigate(`/nova-transacao/${tipo}`);
  }

  return (
    <HomeContainer>
      <Header>
        <h1 data-test="user-name">Olá, {name}</h1>
        <BiExit onClick={exit} data-test="logout" />
      </Header>

      <TransactionsContainer>
        <ul>
          {transac &&
            transac.map((data, index) => (
              <ListItemContainer key={index}>
                <div>
                  <span>{data.date}</span>
                  <strong data-test="registry-name">
                    {data.data.description}
                  </strong>
                </div>
                <Value color={data.data.type} data-test="registry-amount">
                  R$ {data.data.value.replace(".", ",")}
                </Value>
              </ListItemContainer>
            ))}
        </ul>

        <article>
          <strong>Saldo</strong>
          <Value
            color={saldo >= 0 ? "entrada" : "saida"}
            data-test="total-amount"
          >
            {saldo.toFixed(2).replace(".", ",")}
          </Value>
        </article>
      </TransactionsContainer>

      <ButtonsContainer>
        <button onClick={() => handleClick("entrada")} data-test="new-income">
          <AiOutlinePlusCircle />
          <p>
            Nova <br /> entrada
          </p>
        </button>
        <button onClick={() => handleClick("saida")} data-test="new-expense">
          <AiOutlineMinusCircle />
          <p>
            Nova <br />
            saída
          </p>
        </button>
      </ButtonsContainer>
    </HomeContainer>
  );
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`;
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
`;
const TransactionsContainer = styled.article`
  flex-grow: 1;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  article {
    display: flex;
    justify-content: space-between;
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`;
const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;

  button {
    width: 50%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 18px;
    }
  }
`;
const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${(props) => (props.color === "entrada" ? "green" : "red")};
`;
const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;
  margin-right: 10px;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
`;
