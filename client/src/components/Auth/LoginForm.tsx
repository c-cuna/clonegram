import { useState, Dispatch, SetStateAction } from "react";
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useAuth } from "../../auth";

type FormValues = {
  username: string,
  password: string
};

type ErrorValues = {
  username: string[],
  password: string[]
};


interface IProps {
  setOpenForm: Dispatch<SetStateAction<number>>
}

export default function LoginForm(props: IProps) {
  const { login } = useAuth();
  const router = useRouter();
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, setError, formState } = useForm<FormValues>(formOptions);
  const { errors } = formState;

  const onSubmit: SubmitHandler<FormValues> = async data => {
    setErrorMessage("");
    try {
      const resp = await login(data.username, data.password);
      if (resp.status == 200) {
        router.reload()
      }
      else if(resp.status == 400){
        resp.json().then((data: ErrorValues)  => {
            for (let key in data){
                data[key as keyof ErrorValues].forEach(message => {
                    setError(key as keyof ErrorValues, { type: "400", message: message })
                })
            }
        })
      }
      else if (resp.status === 401) {
        setErrorMessage("Incorrect username or password");
      }
      else if (resp.status === 500) {
        setErrorMessage("500 - Internal Server Error");
      }
      else {
        setErrorMessage("Oops an error has occured");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Internal Server Error");
      if (typeof error === "string") {
        error.toUpperCase();
      } else if (error instanceof Error) {
        error.message;
      }
    }
  }

  return (
    <div className="p-8 w-72 text-left bg-white rounded-lg">
     
      <form className="flex flex-col " onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
        <h2 className="text-base text-lg mb-1 font-bold leading-7 text-gray-900">Login</h2>
          <label className="text-xs text-gray-500 font-semibold" htmlFor="username">Username</label>
          <input className="w-full px-4 py-2  border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" placeholder="Username" {...register("username")} />
          {errors.username && (
            <p className="text-xs mt-1 italic text-red-500">{errors.username.message}</p>
          )}
        </div>
        <div className="mb-2">
          <label className="text-xs text-gray-500 font-semibold" htmlFor="password">Password</label>
          <input type="password" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" placeholder="Password" {...register("password")} />
          {errors.password && (
            <p className="text-xs mt-1 italic text-red-500">{errors.password.message}</p>
          )}
        </div>
        
        {/* <a href="#" className="text-sm text-blue-600 hover:underline text-right">Forgot password?</a> */}
        {errorMessage && <div className=" text-red-600 text-center text-sm ">{errorMessage}</div>}
        <div className="flex flex-row items-baseline justify-between mt-4 mb-1">
          <input className="py-1 w-full rounded-md text-white text-sm bg-blue-600 hover:bg-blue-900" type="submit" value="Login" />
        </div>
        <a href="#" onClick={() => props.setOpenForm(1)} className="text-xs mt-2 text-gray-600 text-center text-semibold">Don't have an account?</a>
      </form>
    </div>
  );
}