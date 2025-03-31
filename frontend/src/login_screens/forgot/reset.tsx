import React from "react";
import "./forgot.css";
import { useParams } from "react-router-dom";

const ResetPassword: React.FC = () => 
{
	const { email } = useParams<{ email: string }>();
	const decodedEmail = decodeURIComponent( email || "" );
	
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [error, setError] = React.useState("");
    
    const handleClickConfirm = async (e: React.FormEvent) => 
	{
		e.preventDefault();
        const data = { decodedEmail, password, confirmPassword };
        console.log( data );
    
        try
        {
            const response = await fetch( `${process.env.REACT_APP_API_URL}sp25-repo-playboys/backend/reset_forgotten_pwd.php`, 
			{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( data ),
            })

            const result = await response.json();
            console.log( result );
            console.log( result[ "status" ] );

            if( result[ "status" ] === "success" ) 
            {
                setMessage( String( result[ "message" ] ) );
				window.location.href = "#/"
            }
            else 
            {
                setError( String( result[ "message" ] ) );
            }
        }
        catch( err: any ) 
        {
            setError( "Sorry, something went wrong. Please try again." );
        }
    };
    
  return (
    <div className="auth-container">
        <div className="login-box">
            <h2>Reset Password</h2>
            <form onSubmit={ handleClickConfirm }>
                <label>Password</label>
                <input type="password" placeholder="Enter your new password" value={password} onChange={ ( e ) => setPassword( e.target.value ) }/>
				<label>Confirm Password</label>
                <input type="password" placeholder="Confirm your new password" value={confirmPassword} onChange={ ( e ) => setConfirmPassword( e.target.value ) }/>
                <button type="submit">Confirm</button>
                {[
					message && <p className="message">{ message }</p>,
					error && <p className="error-message">{ error }</p>
				]}
            </form>
        </div>
    </div>
  );
};

export default ResetPassword;