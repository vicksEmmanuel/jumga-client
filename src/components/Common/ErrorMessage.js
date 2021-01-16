import React from 'react';
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