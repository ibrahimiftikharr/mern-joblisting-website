const validateInput = (name, value) => 
{
    let errorMessage = '';
  
    switch (name) 
    {
        case 'email':
      
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(value)) 
        {
          errorMessage = 'Please enter a valid email address.';
        }
        break;
  
      case 'password':
        
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(value)) {
          errorMessage = 'Password must be at least 8 characters long,\n include 1 uppercase letter, and 1 number.';
        }
        break;
  
      case 'salary':
        if (!value || isNaN(value) || value <= 0) {
          errorMessage = 'Please enter a valid salary (positive number).';
        }
        break;
  
        case "title":
            if (value.length < 5) {
              errorMessage = "Title must be at least 5 characters long.";
            }
            break;

        case "description":
            if (value.length < 10) {
              errorMessage = "Description must be at least 10 characters long.";
            }
            break;
  
      default:
        break;
    }
  
    return errorMessage;
  };
  
  export default validateInput;