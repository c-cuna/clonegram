import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async (req: NextApiRequest, res: NextApiResponse) => {
    const {username, email, password, password2, first_name, last_name, bio, location} = req.body
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
        }

    });

    if (req.method === 'POST') {
      
        try {
            const url = process.env.NEXT_PUBLIC_API + `/accounts/register/`;
            const APIRes = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: body
            });
           
            const data = await APIRes.json();

            if (APIRes.status === 201) {
                return res.status(201).json({ success: data.success });
            } else {
                console.log(APIRes.status);
                // console.log(APIRes)
                res.status(APIRes.status).json({ error: 'Internal Server Error' });
            }
        } catch(err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ 'error': `Method ${req.method} not allowed`});
    }
};