import React, { JSX } from "react";
import styled from "styled-components";

interface props {
    children: React.ReactNode
    onClose: () => void
}

const Modal = ({ children, onClose }:props): JSX.Element => {
    const handleOverlayClick = () => {
        onClose()
    }

    const handleContentClick = (e:React.MouseEvent) => {
        e.stopPropagation()
    }

    return(
        <Overlay onClick={handleOverlayClick}>
            <Content onClick={handleContentClick}>
                {children}
            </Content>
        </Overlay>
    )
}

export default Modal

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`

const Content = styled.div`
    z-index: 1001;
`