import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../Layout';
import Posts from './Posts';

function Feed() {
    const [hasNextPage, setHasNextPage] = useState(true);

    useEffect(() => {
        setHasNextPage(false);
        console.log(hasNextPage);
    }, [])
    return (
        <>
        <Head>
        <title>Clonegram</title>
        </Head>
     
          <Layout>
                <main className={`grid grid-cols-1 md:grid-cols-5 md:max-w-lg lg:max-w-xl xl:max-w-xl mx-auto `}>
                <section className='col-span-6 ' id="feed">
                    <Posts  />
                </section>
            </main>
        </Layout>

        </>
    )
}

export default Feed