import React from "react";
import "./forgot.css";
import { useNavigate } from "react-router-dom";
import { useCSRFToken } from "../../csrfContent";
const ForgotPassword: React.FC = () => 
{
    const navigate = useNavigate();
    const { csrfToken } = useCSRFToken();
    const [email, setEmail] = React.useState("");
    const [emailFieldMessage, setEmailFieldMessage] = React.useState("");
    const [emailFieldError, setEmailFieldError] = React.useState("");

    const [code, setCode] = React.useState("");
    const [codeFieldMessage, setCodeFieldMessage] = React.useState("");
    const [codeFieldError, setCodeFieldError] = React.useState("");

    const handleClickSend = async ( e: React.FormEvent ) => 
    {
        e.preventDefault();
        const data = { email };
        console.log( data );

        try
        {
            const response = await fetch( `${process.env.REACT_APP_API_URL}sp25-repo-playboys/backend/send_forgot_pwd_email.php`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 'CSRF-Token': csrfToken
                },
                body: JSON.stringify( data ),
            })

            const result = await response.json();
            console.log( result );
            console.log( result[ "status" ] );

            if( result[ "status" ] === "success" ) 
            {
                setEmailFieldMessage( String( result[ "message" ] ) );
            }
            else 
            {
                setEmailFieldError( String( result[ "message" ] ) );
            }
        }
        catch( err: any ) 
        {
            setEmailFieldError( "Sorry, something went wrong. Please try again." );
        }
    };

    const handleClickVerify = async (e: React.FormEvent) => 
    {
        e.preventDefault();
        const data = { email, code };
        console.log( data );

        try
        {
            const response = await fetch( `${process.env.REACT_APP_API_URL}sp25-repo-playboys/backend/verify_email_code.php`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 'CSRF-Token': csrfToken
                },
                body: JSON.stringify( data ),
            })

            const result = await response.json();
            console.log( result );
            console.log( result[ "status" ] );

            if( result[ "status" ] === "success" ) 
            {
                setCodeFieldMessage( String( result["message"] ) );

                navigate( `/forgot/reset/${encodeURIComponent(email)}` );
            }
            else 
            {
                setCodeFieldError( String( result[ "message" ] ) );
            }
        }
        catch( err: any ) 
        {
            setCodeFieldError( "Sorry, something went wrong. Please try again." );
        }
    };
    
    return (
        <div className="auth-container">
            <div className="login-box">
                <h2>Forgot Password</h2>
                <form onSubmit={ handleClickSend }>
                    <label>Email</label>
                    <input type="email" placeholder="Enter your email" value={email} onChange={ ( e ) => setEmail( e.target.value ) }/>
                    <button type="submit">Send</button>
                    {[
                        emailFieldMessage && <p className="message">{ emailFieldMessage }</p>,
                        emailFieldError && <p className="error-message">{ emailFieldError }</p>
                    ]}
                </form>
                <br></br>
                <form onSubmit={ handleClickVerify }>
                    <label>Verification Code</label>
                    <input type="text" placeholder="Enter the code sent to your email" value={code} onChange={ ( e ) => setCode( e.target.value ) }/>
                    <button type="submit">Verify</button>
                    {[ 
                        codeFieldMessage && <p className="message">{ codeFieldMessage }</p>,
                        codeFieldError && <p className="error-message">{ codeFieldError }</p>
                    ]}
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;