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

  const { register, handleSubmit, formState } = useForm<FormValues>(formOptions);
  const { errors } = formState;

  const onSubmit: SubmitHandler<FormValues> = async data => {
    setErrorMessage("");
    try {
      const resp = await login(data.username, data.password);
      if (resp.status == 200) {
        router.reload()
      }
      if (resp.status === 401) {
        setErrorMessage("Incorrect username or password");
      }
      else if (resp.status === 500) {
        setErrorMessage("Internal Server Error");
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
    <div className="px-8 py-3 w-80 text-left bg-white shadow-lg">
     
      <form className="flex flex-col " onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4 mb-4">
          <label className="block" htmlFor="email">Username</label>
          <input className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" placeholder="Username" {...register("username")} />
          {errors.username && (
            <p className="text-xs mt-1 italic text-red-500">{errors.username.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block" htmlFor="password">Password</label>
          <input type="password" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" placeholder="Password" {...register("password")} />
          {errors.password && (
            <p className="text-xs mt-1 italic text-red-500">{errors.password.message}</p>
          )}
        </div>
        
        {/* <a href="#" className="text-sm text-blue-600 hover:underline text-right">Forgot password?</a> */}
        {errorMessage && <div className=" text-red-600 text-center text-sm ">{errorMessage}</div>}
        <div className="flex flex-row items-baseline justify-between my-4">
          <input className="px-6 py-2 w-full text-white bg-blue-600 hover:bg-blue-900" type="submit" value="Login" />
        </div>
        <a href="#" onClick={() => props.setOpenForm(1)} className="text-sm my-2 text-gray-600 text-center text-semibold">Don't have an account?</a>
      </form>
    </div>
  );
}