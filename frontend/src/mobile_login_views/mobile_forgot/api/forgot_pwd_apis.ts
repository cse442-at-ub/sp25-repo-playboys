// Send email
export const send_forgot_pwd_email = async ( email: string ): Promise<string> => 
{
  console.log("in send_forgot_pwd_email!");
  const response = await fetch("../send_forgot_pwd_email.php", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok) 
    throw new Error( "Failed to send reset email" );
  return data.message; 
};

// Verify code
export const verifyResetToken = async (code: string): Promise<boolean> => 
{
  const response = await fetch(`${process.env.REACT_APP_API_URL}src/login_screens/forgot/verify_forgot_pwd_code.php`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json", 
    },
    body: JSON.stringify({ code }),
  });

  const data = await response.json();
  if ( !response.ok ) 
    throw new Error( data.error || "Invalid, incorrect, or expired code" );
  return true; 
};

// Reset password
export const resetPassword = async (password: string, confirm_password: string): Promise<string> => 
{
  const response = await fetch(`${process.env.REACT_APP_API_URL}src/login_screens/forgot/reset_forgotten_pwd.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, confirm_password }),
  });

  const data = await response.json();
  if ( !response.ok ) throw new Error( data.error || "Failed to reset password" );
  return data.message; // Success message
};