import { useState, useEffect } from "react"
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useAuth } from "../../auth";

export default function ChangePasswordForm() {
    const { user } = useAuth();
    type FormValues = {
        old_password: string,
        password: string,
        password2: string,

    };

    const validationSchema = Yup.object().shape({
        old_password: Yup.string().required('Old Pasword is required'),
        password: Yup.string().required('New Password is required'),
        password2: Yup.string().required('Repeat your password'),
    });

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, formState } = useForm<FormValues>(formOptions);
    const { errors } = formState;

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
        const { old_password, password, password2 } = data;

        const body = JSON.stringify({
            old_password: old_password,
            password: password,
            password2: password2
        })

        fetch("/api/accounts/changepassword/" + user.id, {
            method: "PUT",
            body: body,
            credentials: "include"
        }).then(async (response) => {
            try {
               
                if (response.status == 200) {
                    setSuccessMessage("Password successfuly changed");
                    setErrorMessage("");
                }
                if (response.status === 401 || response.status == 400) {
                    setErrorMessage("Old password entered is invalid");
                    setSuccessMessage("");
                    // setTimeout(() => setErrorMessage(""), 5000);
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

        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="w-full mb-6">
                <label htmlFor="old_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Old Password</label>
                <input  {...register("old_password")} type="password" placeholder="Old Password" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:placeholder-white dark:border-gray-600" />
                {errors.old_password && (
                        <p className="text-xs mt-1 italic text-red-500">{errors.old_password.message}</p>
                )}
            </div>
            <div className="w-full mb-6">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input {...register("password")} type="password" placeholder="New Password" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:placeholder-white dark:border-gray-600" />
                {errors.password && (
                        <p className="text-xs mt-1 italic text-red-500">{errors.password.message}</p>
                )}
            </div>

            <div className="w-full mb-6">
                <label htmlFor="password2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repeat Password</label>
                <input  {...register("password2")} type="password" placeholder="Repeat New Password" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:placeholder-white dark:border-gray-600" />
                {errors.password2 && (
                        <p className="text-xs mt-1 italic text-red-500">{errors.password2.message}</p>
                )}
            </div>
            {errorMessage && <div className=" text-red-600 text-left text-sm ">{errorMessage}</div>}
            {successMessage && <div className="text-green-600 text-left text-sm">{successMessage}</div>}
            <div className="w-full inline-flex justify-end">
                <input type="submit" className="px-3 py-2 mt-4 w-full text-white text-sm bg-blue-600 dark:bg-gray-700  rounded-lg hover:bg-blue-900 md:w-auto" />
            </div>
        </form>
    )
}