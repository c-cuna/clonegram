import { useState, useEffect } from "react"
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Layout from "../components/Layout";
import Image from 'next/image';
type FormValues = {
    image_url: FileList,
    description: string,
};


export default function Upload() {
    const FILE_SIZE = 10000 * 1048; // 10MB
    const SUPPORTED_FORMATS = [
        "image/jpg",
        "image/jpeg",
        "image/png"
    ];

    const [selectedImage, setSelectedImage] = useState(null);
    const handleImageChange = (event: any) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };

    const validationSchema = Yup.object().shape({
        image_url: Yup.mixed()
        .test(
        "required", 
        "Please select a file", 
        function(value: any | undefined, testContext: Yup.TestContext) {
            if( value instanceof FileList) {
                return value.length > 0
            } else {
                return false;
            }
        })

        .test(
          "fileSize",
          "File too large",
          function(value: any | undefined, testContext: Yup.TestContext) {
            if( value instanceof FileList) { 
                return value.length > 0 && value[0].size <= FILE_SIZE
            } else {
                return false;
            }
        })
        .test(
          "fileFormat",
          "Unsupported Format",
          function(value: any | undefined, testContext: Yup.TestContext) {
            if( value instanceof FileList) {
                return value.length > 0 && SUPPORTED_FORMATS.includes(value[0].type)
            } else {
                return false;
            }
        }),
        description: Yup.string().required(),
    });

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState, reset } = useForm<FormValues>(formOptions);
    const { errors } = formState;
   
    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
        const { image_url, description } = data;
        const form = new FormData();
        form.append("image_url", image_url[0]);
        form.append("description", description);

        fetch("/api/posts/upload/", {
            method: "POST",
            body: form,
            credentials: "include"
        }).then(async (response) => {
            try {
                if (response.status == 201) {
                    setSuccessMessage("Image was successfully posted");
                    setSelectedImage(null);
                    reset();
                }
                if (response.status === 401 || response.status === 500) {
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

        })
    }

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-screen">
                <div className="px-8 py-5 text-left bg-white dark:bg-zinc-900 shadow-lg">
                    {successMessage && <div className="my-4 bg-green-200 border border-green-400 rounded-sm shadow  text-green-900 text-center px-2 py-2">{successMessage}</div>}
                    {errorMessage && <div className="my-4 bg-red-200 border border-red-400 rounded-sm shadow  text-red-900 text-center px-2 py-2">{errorMessage}</div>}
                    <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">Upload Post</h2>
                    <p className="mt-1 mb-3 text-sm leading-6 text-gray-600 dark:text-gray-200">This information will be displayed publicly so be careful of what you share.</p>
                    {selectedImage && <Image
                        src={URL.createObjectURL(selectedImage)}
                        alt="pending"
                        className="w-full h-[600px] mb-6 bg-black object-contain"
                        width={500}
                        height={500}
                    />}
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3 mb-6">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="image_url">Upload file</label>
                                <input {...register("image_url")} onChange={handleImageChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="image_url_help" id="image_url" type="file" />
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                                {errors.image_url && (
                                        <p className="text-xs mt-1 italic text-red-500">{errors.image_url.message}</p>
                                )}
                            </div>
                            <div className="w-full px-3 mb-6">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Description</label>
                                <input {...register("description")} placeholder="Description" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:placeholder-white dark:border-gray-600" />
                                {errors.description && (
                                        <p className="text-xs mt-1 italic text-red-500">{errors.description.message}</p>
                                )}
                            </div>
                            <div className="w-full px-3 text-right">
                                <input type="submit" className="btn w-full bg-blue-500 dark:bg-gray-700 rounded-sm  text-white py-1 px-2" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}