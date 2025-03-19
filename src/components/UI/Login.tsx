import React, { JSX } from "react";
import styled from "styled-components";

const Login = ():JSX.Element => {
    return(
        <form>
            <p>아이디</p>
            <input type="text" placeholder="ID"/>
            <p>비밀번호</p>
            <input type="password" placeholder="password"/>
            <Button type="submit">로그인</Button>
        </form>
    )
}

export default Login

const Button = styled.button`
    background-color: #A66CFF;
    color: white;
    border: none;`