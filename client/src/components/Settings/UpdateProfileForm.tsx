import { useState, useEffect } from "react"
import { useForm, SubmitHandler, set } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useAuth } from "../../auth";

export default function UpdateProfileForm() {
    const { user } = useAuth();
    type ProfileValues = {
        bio: string,
        location: string
    }

    type FormValues = {
        username: string,
        email: string,
        first_name: string,
        last_name: string,
        profile: ProfileValues
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        email: Yup.string().required('Email is required'),
        first_name: Yup.string().required('First name is required'),
        last_name: Yup.string().required('Last name is required'),
        profile: Yup.object().shape({
            bio: Yup.string(),
            location: Yup.string(),
        }),
    });

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const formOptions = {
        resolver: yupResolver(validationSchema),
        defaultValues: {
            username: user?.username,
            email: user?.email,
            first_name: user?.first_name,
            last_name: user?.last_name,
            profile: {
                bio: user?.profile?.bio,
                location: user?.profile?.location,
            }
        },
    };

    const { register, handleSubmit, formState, reset } = useForm<FormValues>(formOptions);
    const { errors } = formState;

    useEffect(() => {
        reset(user);
    }, [user, reset]);
  

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
        const { username, email, first_name, last_name, profile } = data;
        const body = JSON.stringify({
            username: username,
            email: email,
            first_name: first_name,
            last_name: last_name,
            profile: {
                bio: profile?.bio,
                location: profile?.location,
            }

        });
        fetch("/api/accounts/profile/edit/" + user.id, {
            method: "PUT",
            body: body,
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        }).then(async (response) => {
            try {

                if (response.status == 200) {
                    setSuccessMessage("Profile successfuly updated");
                }
                if (response.status === 401) {
                    setErrorMessage("Invalid login credentials");
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

        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="w-full mb-6">
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                <input {...register("username")} placeholder="Username" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:placeholder-white dark:border-gray-600" />
                {errors.username && (
                    <p className="text-xs mt-1 italic text-red-500">{errors.username.message}</p>
                )}
            </div>
            <div className="w-full mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input {...register("email")} placeholder="Email" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:placeholder-white dark:border-gray-600" />
                {errors.email && (
                    <p className="text-xs mt-1 italic text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div className="w-full mb-6">
                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                <input  {...register("first_name")} placeholder="First Name" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:placeholder-white dark:border-gray-600" />
                {errors.first_name && (
                    <p className="text-xs mt-1 italic text-red-500">{errors.first_name.message}</p>
                )}
            </div>
            <div className="w-full mb-6">
                <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                <input {...register('last_name')} placeholder="Last Name" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:placeholder-white dark:border-gray-600" />
                {errors.last_name && (
                    <p className="text-xs mt-1 italic text-red-500">{errors.last_name.message}</p>
                )}
            </div>
            <div className="w-full mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bio</label>
                <input  {...register("profile.bio")} placeholder="Bio" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:placeholder-white dark:border-gray-600" />
                {errors?.profile?.bio && (
                    <p className="text-xs mt-1 italic text-red-500">{errors.profile.bio.message}</p>
                )}
            </div>
            <div className="w-full mb-6">
                <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                <input {...register("profile.location")} placeholder="Location" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:placeholder-white dark:border-gray-600" />
                {errors?.profile?.location && (
                    <p className="text-xs mt-1 italic text-red-500">{errors.profile.location.message}</p>
                )}
            </div>
            {errorMessage && <div className=" text-red-600 text-left text-sm ">{errorMessage}</div>}
            {successMessage && <div className="text-green-600 text-left text-sm">{successMessage}</div>}
            <div className="w-full flex md:justify-end text-center md:px-3">
                <input type="submit" className=" text-sm py-2 px-3 mt-4 w-full text-white bg-blue-600 dark:bg-gray-700 rounded-lg hover:bg-blue-900 md:text-right md:w-auto" value="Save" />
            </div>
        </form>
    )
}
