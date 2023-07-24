import SolidIcons from "@heroicons/react/24/solid";
interface IProps {
    post_id: string,
    closeModal: () => void
}

const BASE_URL = process.env.NEXT_PUBLIC_MACHINE_HOST;

export default function ClipboardModal(props: IProps){
    const { post_id ,closeModal }  = props;
    const copyToClipboard = (text: string) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
              .then(() => {
                console.log('Text copied to clipboard');
              })
              .catch((error) => {
                console.error('Failed to copy text to clipboard:', error);
              });
          } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            console.log('Text copied to clipboard');
          }
      }

    return (
        <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none z-50 focus:outline-none"
    >
        <div className="relative w-2/5  z-50 my-6 pt-3 px-5 pb-5 mx-auto rounded-lg shadow bg-white dark:bg-zinc-900">
            <p className="font-semibold mt-2">Copy to Clipboard</p>
            <div className="flex justify center items-center  ">
                
                <div className="relative flex-auto" onClick={() => copyToClipboard(`${BASE_URL}/post/${post_id}`)}>
                    <div className="bg-gray-200 rounded-md border-2 border-gray-300 px-2 py-1 mr-3 my-2 text-gray-700 shadow-black-20 dark:bg-zinc-900 dark:text-gray-200 dark:border-gray-600"> <p>{`${BASE_URL}/post/${post_id}`}</p></div>
                </div>
                <button type="button" onClick={() => copyToClipboard(`${BASE_URL}/post/${post_id}`)} className="mr-2 text-gray-400 flex hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-fit items-center p-1.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white">
                 <SolidIcons.ClipboardDocumentIcon className='btn w-6 lg:w-5 text-black-500' />
                    <span className="sr-only">Close modal</span>
                 </button>
                <button type="button" onClick={() => closeModal()} className=" text-gray-400 flex hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-fit items-center p-1.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white">
                <SolidIcons.XMarkIcon className='btn w-6 lg:w-5 text-black-500' />
                    <span className="sr-only">Close modal</span>
                 </button>

            </div>
            
        </div>
        <div className="opacity-40 fixed inset-0 z-40 bg-gray-600"  onClick={() => closeModal()}></div>
    </div>
    )
}