import { User } from '../../../constants/types';
import UserListModalItem from './UserListModalItem';

interface IUserModal {
    title: string, 
    users: User[] | undefined, 
    closeModalCallBack: React.Dispatch<React.SetStateAction<boolean>>
}

export default function UserListModal(props: IUserModal) {
    const { title, users, closeModalCallBack } = props;
    return (
        <>
            <div
                className="justify-center items-top flex overflow-x-hidden overflow-y-auto z-40 fixed inset-0  outline-none focus:outline-none"
            >
                <div className="relative w-1/4 z-50 my-6 mx-auto h-fit">
                    <div className="relative  bg-white rounded-lg shadow dark:bg-gray-700">
                        <button type="button" onClick={() => closeModalCallBack(false)} className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="crypto-modal">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="px-6 py-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
                                {title}
                            </h3>
                        </div>
                        <div className="relative p-4 flex-auto">
                            {users && users.length > 0 ? <ul className="my-4 space-y-3">
                                {users.map((user, key) => (
                                    <UserListModalItem key={key} {...user} />
                                ))}
                            </ul>
                                :
                                <p>There are no items on this list</p>
                            }

                        </div>

                    </div>
                </div>
                <div className="opacity-50 fixed inset-0 z-30 bg-black" onClick={() => closeModalCallBack(false)}></div>
            </div>
          
        </>
    );
}