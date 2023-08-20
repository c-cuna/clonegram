import { useState, Dispatch, SetStateAction } from "react"
import { useForm, SubmitHandler } from 'react-hook-form';
import SolidIcon from '@heroicons/react/24/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from "next/router";
import { useAuth } from '../../auth';

interface IProps {
    setOpenForm: Dispatch<SetStateAction<number>>
}

export default function RegisterForm(props: IProps) {
    type FormValues = {
        username: string,
        email: string,
        password: string,
        password2: string,
        first_name: string,
        last_name: string,
    };

    type ErrorValues = {
        username: string[],
        email: string[],
        password: string[],
        password2: string[],
        first_name: string[],
        last_name: string[],
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        email: Yup.string().required('Email is required'),
        password: Yup.string().required('Password is required').min(8, 'Password is too short - should be 8 chars minimum.'),
        password2: Yup.string().required('Repeat your password'),
        first_name: Yup.string().required('First name is required'),
        last_name: Yup.string().required('Last name is required'),
    });

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, setError, reset, formState } = useForm<FormValues>(formOptions);
    const { errors } = formState;

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
        setErrorMessage("");
        setSuccessMessage("");
        const { username, email, password, password2, first_name, last_name } = data;
        const body = JSON.stringify({
            username: username,
            email: email,
            password: password,
            password2: password2,
            first_name: first_name,
            last_name: last_name,
            profile: {}
        })
        try {
            await fetch("/api/accounts/register/", {
                method: "POST",
                body: body,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then(async (response) => {
                if(response.status == 201){
                    try {
                        setSuccessMessage("Thanks for signing up! Feel free to log in using the credentials you've just provided.")
                        reset()
                    } catch (error) {
                         setErrorMessage("Internal Server Error");
                         if (typeof error === "string") {
                            console.error(error.toUpperCase());
                         } else if (error instanceof Error) {
                            console.error(error.message);
                         }
                    }
                }
                else if(response.status == 400){
                    response.json().then((data: ErrorValues)  => {
                        for (let key in data){
                            data[key as keyof ErrorValues].forEach(message => {
                                setError(key as keyof ErrorValues, { type: "400", message: message })
                            })
                        }
                    })
                }
                else if (response.status === 500) {
                    setErrorMessage("500 - Internal Server Error");
                }
                else {
                    response.text().then(text => { console.error(text) })
                    setErrorMessage("Something went wrong with your registration")
                }
            })
        }
        catch(error) {
            console.error(error);
            setErrorMessage("Internal Server Error");
        }
    }
    
    return (
        <div className="w-64 md:w-96 my-8 px-8 py-6 text-left  w-72 text-left bg-white rounded-lg">
            <p className="text-xs flex text-gray-500 text-right w-full cursor-pointer" onClick={() => props.setOpenForm(0)}><SolidIcon.ArrowLeftIcon className="w-3 mr-1" /> Go back</p>
            <h2 className="text-base mb-2 font-semibold leading-7 text-gray-900">Register</h2>
            {errorMessage && <div className=" text-red-600 text-left text-sm ">{errorMessage}</div>}
            {successMessage && <div className=" text-green-600 text-left text-sm">{successMessage}</div>}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="w-full mb-1">
                    <label htmlFor="username" className="text-xs text-gray-500 font-semibold">Username</label>
                    <input {...register("username")} placeholder="Username" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                    {errors.username && (
                        <p className="text-xs mt-1 italic text-red-500">{errors.username.message}</p>
                    )}
                </div>
                <div className="w-full mb-1">
                    <label htmlFor="email" className="text-xs text-gray-500 font-semibold">Email</label>
                    <input {...register("email")} placeholder="Email" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                    {errors.email && (
                        <p className="text-xs mt-1 italic text-red-500">{errors.email.message}</p>
                    )}
                </div>
                <div className="w-full mb-1">
                    <label htmlFor="password" className="text-xs text-gray-500 font-semibold">Password</label>
                    <input {...register("password")} placeholder="Password" type="password" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                    {errors.password && (
                        <p className="text-xs mt-1 italic text-red-500">{errors.password.message}</p>
                    )}
                </div>
                <div className="w-full mb-1">
                    <label htmlFor="password2" className="text-xs text-gray-500 font-semibold">Repeat Password</label>
                    <input {...register("password2")} placeholder="Repeat Password" type="password" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                    {errors.password2 && (
                        <p className="text-xs mt-1 italic text-red-500">{errors.password2.message}</p>
                    )}
                </div>
                <div className="w-full mb-1">
                    <label htmlFor="first_name" className="text-xs text-gray-500 font-semibold">First Name</label>
                    <input {...register("first_name")} placeholder="First Name" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                    {errors.first_name && (
                        <p className="text-xs mt-1 italic text-red-500">{errors.first_name.message}</p>
                    )}
                </div>
                <div className="w-full mb-2">
                    <label htmlFor="last_name" className="text-xs text-gray-500 font-semibold">Last Name</label>
                    <input {...register("last_name")} placeholder="Last Name" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                    {errors.last_name && (
                        <p className="text-xs mt-1 italic text-red-500">{errors.last_name.message}</p>
                    )}
                </div>

                <div className="w-full">
                    <p className="text-center mb-3 text-gray-500 text-xs">By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.</p>
                    <input className="py-1 rounded-md w-full  text-sm text-white bg-blue-600 hover:bg-blue-900" type="submit" value="Register" />
      
                </div>
            </form>
        </div>
    );
}