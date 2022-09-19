import styled from "styled-components";
import Styled from "styled-components";

export const header = Styled.header`

    padding-left: 40px;
    height: 100vh;
    width: 30%;
    background-color: #F5F5F5;
    color: white;
    padding-right:2%;
    cursor: pointer;
    font-weight: bold;
`;

export const top = Styled.header`
    width: 95%;
    position: absolute;
    height: 9vh;
    background-color: white;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    display: flex;
    justify-content: space-between;
    padding-right: 40px;
    padding-left: 40px;
    align-items: center;
`   

export const alert = styled.div`
    font-family: 'Roboto', sans-serif;
    display: flex;
    padding: 10px;
    background-color: #FFF5E5;
    width: 600px;
    font-weight: 300;
    margin-left: 185px;
    margin-top:20px;
    border-radius: 10px;
`

export const warning = styled.p`
    margin-top: -15px;
`

export const warning2 = styled.h3`
font-weight: 400;
`

export const body = Styled.body`
    height: 100vh;
    width: 70%;
`;

export const contente = Styled.header`
    display: flex;
`;

export const logo = Styled.img`
    margin-right: 15px;
    margin-left: 10px;

`;

export const logoHeader = Styled.img`
    width: 100px;
    height: 25px;

`;

export const h1 = Styled.h1`
    font-family: 'Roboto', sans-serif;
    font-size: 48px;
    margin-top: 80px;
    margin-bottom: 40px;
    line-height: 2.5rem;
    font-weight: 500;
    color: #000000

`;