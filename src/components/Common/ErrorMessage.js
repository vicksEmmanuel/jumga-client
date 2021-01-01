import React, { useEffect, useState } from 'react';
import { Row, Col, CardBody, Card, Alert,Container, Label } from "reactstrap";
import "./errormsg.scss";


const ErrorMessage = ({
    isError = false,
    message = '',
}) => {
    return isError ? (
        <center>
            <div className="error">
                {message}
            </div>
        </center>
    ) : <></>;
}

export default ErrorMessage;