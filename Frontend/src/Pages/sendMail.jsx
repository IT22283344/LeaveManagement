
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

 const SendMail= ({ email }) =>{
    
  const[file,setFile]=useState(null);
  const[imageUploadProgress,setImageUploadProgress] = useState(null);
  const[imageUploadError,setImageUploadError] = useState(null);
  const[formData , setFormData] = useState({});
  const[publishError, setPublishError] = useState(null);

  console.log(email);
  
  useEffect(() => {
    setFormData({ ...formData, email: email })
  }, [email]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
      const res = await fetch('/api/staff/sendmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      console.log(formData);

      if (res.ok) {
        setPublishError(null);
        //navigate(`/dashboard?tab=users`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };






  
 
 
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen" style={{width:"50%"}}>
        <h1 className="text-center text-3xl my-7 font-semibold">Send Mail</h1>
        <form className="flex flex-col  gap-4"  onSubmit={handleSubmit}>

        <TextInput type='text'placeholder='email'required id='email'className='flex-1'  value={email}
                          readOnly
                         
             
            />

<TextInput type='text'placeholder='Subject'required id='email'className='flex-1' 
onChange={(e) => {
    
    setFormData({ ...formData, subject:  e.target.value });
  }}
             
            />
            
        
        <ReactQuill
          theme="snow"
          placeholder="Description..."
          className="h-52 mb-12"
          onChange={(e) => {
            const sanitizedValue = e.replace(/<\/?[^>]+(>|$)/g, "");
            setFormData({ ...formData, description: sanitizedValue });
          }}
        />
    
            
        <Button type='submit' className="bg-black text-white">Send</Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
        </form>
    </div>
  )
}

export default SendMail;