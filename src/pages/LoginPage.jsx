import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import useUserStore from '../stores/Store';
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { loginSchema } from "../validations/schema";
import { useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import axios from 'axios'


function LoginPage() {
  const login = useUserStore(state => state.login)
	const [resetForm, setResetForm] = useState(true)
	const { handleSubmit, register, formState, reset } = useForm({
		resolver: zodResolver(loginSchema),
		mode: 'onSubmit'
	})

	const { isSubmitting, errors } = formState

	const hdlClose = () => setResetForm(prv => !prv)


  const onSubmit = async data => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      login(data)
    } catch (error) {
      const errMsg = error.response?.data.error || error.message
      toast.error(errMsg)
    }
  }

  const [profile, setProfile] = useState(null)
  const [user, setUser] = useState(null); 

  const logingoogle = useGoogleLogin({
      onSuccess: (codeResponse) => {
          setUser(codeResponse); 
          console.log('Login Success:', codeResponse);
      },
      onError: (error) => console.log('Login Failed:', error)
  });

   useEffect(()=>{
    if(user) {
      axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: {
          Authorization: `Bearer ${user.access_token}`
        }
      }) 
      .then((res)=> {
        setProfile(res.data);
        console.log('Full Profile Data: ', res.data);
      })
      .catch((err) => console.log("Error fetching profile:", err))
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    setProfile(null);
  }

  return (
    <>
      <div className="h-[700px] bg-base-200 pt-20 pb-28">
        <div className="p-5 mx-auto max-w-5xl min-h-[540px] flex justify-between max-md:flex-col">
          <div className="flex flex-col basis-3/5  gap-4 mt-20 max-md:items-center max-md:text-center">
            <div className="text-4xl text-primary">
            </div>
          </div>
          <div className="flex flex-1">
            <div className="card bg-base-100 w-full h-[350px] shadow-xl mt-8">
              <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset disabled={isSubmitting}>
                  <div className="card-body gap-3 p-4">
                    <h2>Welcome to CO-Frame</h2>
                    <h6></h6>
                    <div className="w-full" >
                      <input type="text" className="input w-full"
                        placeholder="E-mail"{...register('email')} />
                      <p className="text-sm text-error">{errors.identity?.message}</p>
                    </div>
                    <div className="w-full" >
                      <input type="password" className="input w-full"
                        placeholder="password" {...register('password')} />
                      <p className="text-sm text-error">{errors.password?.message}</p>
                    </div>
                    <button className="btn btn-primary text-xl">
                      Login
                      {isSubmitting && <span className="loading loading-spinner text-error"></span>}
                    </button>
                    <br />
                    <br />
                    {profile ? (
                      <div>
                        <h3>User Logged in </h3>
                        <p>Name: **{profile.name}**</p>
                        <p>Email: **{profile.email}**</p>
                        <p>Google ID: {profile.id}</p>
                        <button onClick={logout}>Logout</button>
                      </div>
                    ) : (
                      <button onClick={() => logingoogle()}>
                        Sign in with Google
                      </button>
                    )}
                    <div className="divider"></div>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage