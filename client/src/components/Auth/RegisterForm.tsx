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
    const router = useRouter();
    const { login } = useAuth();
    type FormValues = {
        username: string,
        email: string,
        password: string,
        password2: string,
        first_name: string,
        last_name: string,
        bio: string,
        location: string
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        email: Yup.string().required('Email is required'),
        password: Yup.string().required('Password is required').min(8, 'Password is too short - should be 8 chars minimum.'),
        password2: Yup.string().required('Repeat your password'),
        first_name: Yup.string().required('First name is required'),
        last_name: Yup.string().required('Last name is required'),
        bio: Yup.string(),
        location: Yup.string()
    });

    const [errorMessage, setErrorMessage] = useState<string>("");
    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, formState } = useForm<FormValues>(formOptions);
    const { errors } = formState;

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
        setErrorMessage("");
        const { username, email, password, password2, first_name, last_name, bio, location } = data;
        const body = JSON.stringify({
            username: username,
            email: email,
            password: password,
            password2: password2,
            first_name: first_name,
            last_name: last_name,
            profile: {
                bio: bio,
                location: location,
                isActive: true
            }
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
                        await login(username, password);
                        router.reload();
                    } catch (error) {
                       
                         
                         setErrorMessage("Internal Server Error");
                         if (typeof error === "string") {
                            console.error(error.toUpperCase());
                         } else if (error instanceof Error) {
                            console.error(error.message);
                         }
                    }
                } else {
                    response.text().then(text => { console.error(text) })
                    console.error("Internal Server Error");
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
        <div className="w-64 md:w-96 my-8 px-8 py-6 text-left bg-white shadow-lg">
            <p className="text-xs flex text-gray-500 text-right w-full cursor-pointer" onClick={() => props.setOpenForm(0)}><SolidIcon.ArrowLeftIcon className="w-3 mr-1" /> Go back</p>
            <h2 className="text-base mb-2 font-semibold leading-7 text-gray-900">Register</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="w-full mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">Username</label>
                    <input {...register("username")} placeholder="Username" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                    {errors.username && (
                        <p className="text-xs mt-1 italic text-red-500">{errors.username.message}</p>
                    )}
                </div>
                <div className="w-full mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input {...register("email")} placeholder="Email" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                    {errors.email && (
                        <p className="text-xs mt-1 italic text-red-500">{errors.email.message}</p>
                    )}
                </div>
                <div className="w-full mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input {...register("password")} placeholder="Password" type="password" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                    {errors.password && (
                        <p className="text-xs mt-1 italic text-red-500">{errors.password.message}</p>
                    )}
                </div>
                <div className="w-full mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">Repeat Password</label>
                    <input {...register("password2")} placeholder="Repeat Password" type="password" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                    {errors.password2 && (
                        <p className="text-xs mt-1 italic text-red-500">{errors.password2.message}</p>
                    )}
                </div>
                <div className="w-full mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                    <input {...register("first_name")} placeholder="First Name" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                    {errors.first_name && (
                        <p className="text-xs mt-1 italic text-red-500">{errors.first_name.message}</p>
                    )}
                </div>
                <div className="w-full mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                    <input {...register("last_name")} placeholder="Last Name" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                    {errors.last_name && (
                        <p className="text-xs mt-1 italic text-red-500">{errors.last_name.message}</p>
                    )}
                </div>
                <div className="w-full mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">Bio</label>
                    <input {...register("bio")} placeholder="Bio" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                    {errors.bio && (
                        <p className="text-xs mt-1 italic text-red-500">{errors.bio.message}</p>
                    )}
                </div>
                <div className="w-full mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">Location</label>
                    <input {...register("location")} placeholder="Location" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                    {errors.location && (
                        <p className="text-xs mt-1 italic text-red-500">{errors.location.message}</p>
                    )}
                </div>
                {errorMessage && <div className=" text-red-600 text-center text-sm mb-2">{errorMessage}</div>}
                <div className="w-full">
                    <input className="px-6 py-2 w-full text-white bg-blue-600 hover:bg-blue-900" type="submit" value="Register" />
                </div>
            </form>
        </div>
    );
}