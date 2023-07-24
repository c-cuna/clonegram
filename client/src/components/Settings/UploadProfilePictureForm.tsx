import { useState, useEffect } from "react"
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Image from 'next/image';
import { useAuth } from "../../auth";

export default function UploadProfilePictureForm() {
    const { user } = useAuth();
    type FormValues = {
        profile_picture: FileList | undefined,
    };
    const FILE_SIZE = 16000 * 1024;

    const [selectedImage, setSelectedImage] = useState(null);
    const handleImageChange = (event: any) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };

    const getProfilePicture = () => {
        if(!selectedImage){
            return user?.profile.profile_picture || "default-profile-picture.svg";
        } else{
            return URL.createObjectURL(selectedImage);
        }
    }

    const SUPPORTED_FORMATS = [
      "image/jpg",
      "image/jpeg",
      "image/png"
    ];

    const validationSchema = Yup.object().shape({
        
        profile_picture: Yup.mixed()
        .test(
        "required", 
        "Please select a file", 
        function(value: any | undefined, testContext: Yup.TestContext) {
            if( value instanceof FileList){
                return value.length > 0
            } else {
                return false;
            }
        })

        .test(
          "fileSize",
          "File too large",
          function(value: any | undefined, testContext: Yup.TestContext) {
            if( value instanceof FileList){
                return value[0].size <= FILE_SIZE
            } else {
                return false;
            }
        })
        .test(
          "fileFormat",
          "Unsupported Format",
          function(value: any | undefined, testContext: Yup.TestContext) {
            if( value instanceof FileList){
                return SUPPORTED_FORMATS.includes(value[0].type)
            } else {
                return false;
            }
        }),
    }).required();

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<String>("");
    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, formState, reset } = useForm<FormValues>(formOptions);
    const { errors } = formState;


    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
        const { profile_picture } = data;
        if(!profile_picture){
            return;
        }
        const form = new FormData();
        form.append("profile_picture", profile_picture[0]);
            
        fetch("/api/accounts/profile/upload/", {
            method: "POST",
            body: form,
            credentials: "include"
        }).then(async (response) => {
            try {
               
                if (response.status == 200) {
                    setSuccessMessage("Profile picture successfuly updated!");
                    reset();
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

        })
    }
    
    return (

        <form onSubmit={handleSubmit(onSubmit)} className="w-full ">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload Profile Picture</label>
            <Image
                src={ getProfilePicture()}
                alt="pending"
                className="w-full h-[550px] mb-6 object-cover"
                width={500}
                height={500}
                />
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
            <input {...register("profile_picture")} onChange={handleImageChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="profile_picture" type="file" />
            {errors.profile_picture && (
                    <p className="text-xs mt-1 italic text-red-500">{errors.profile_picture.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
            {errorMessage && <div className=" text-red-600 text-left text-sm ">{errorMessage}</div>}
            {successMessage && <div className="text-green-600 text-left text-sm">{successMessage}</div>}
            <div className="w-full inline-flex">
                <input className="px-3 py-2 mt-4 w-full text-white text-sm bg-blue-600 rounded-lg hover:bg-blue-900 dark:bg-gray-700 " type="submit" />
            </div>
        </form>
    )
}