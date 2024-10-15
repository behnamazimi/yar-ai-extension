import styled from "@emotion/styled";

export const StyledMainModal = styled.iframe`
    position: fixed;
    top: 50%;
    left: 50%;
    width: 670px;
    max-height: calc(100vh - 30px);
    z-index: 9999999999999;
    visibility: visible;
    opacity: 1;
    border: none;
    min-height: 48px;
    border-radius: 4px;
    transform: translate(-50%, -50%) scale(1);
    transition: all 0.3s ease;
`;
