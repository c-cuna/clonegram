import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { API_BASE } from '../../../constants/constants';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method == 'POST'){
        const { username, password } = req.body;
        const body = JSON.stringify({
            username,
            password
        });
        try{
            const url = API_BASE + "/accounts/login/";
            const APIRes = await fetch(url, {
                method: "POST",
                body: body,
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include"
            });
            const data = await APIRes.json();
            if(APIRes.status == 200){
                res.setHeader('Set-Cookie', [
                    cookie.serialize(
                        'access', data.access, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV != 'development',
                            maxAge: 60 * 30,
                            sameSite: 'strict',
                            path: '/api/'
                        }
                    ),
                    cookie.serialize(
                        'refresh', data.refresh, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV != 'development',
                            maxAge: 60 * 60 * 24,
                            sameSite: 'strict',
                            path: '/api/'
                        }
                    ),
                ])

                res.status(200).json({
                    message: 'Logged in successfully'
                })
            } else{
                APIRes.text().then(text => {console.log(text)})
                res.status(APIRes.status).json({message: 'Authentication Failed'});
            }
        } catch(err){
            res.status(500).json({ error: 'Internal Server Error' });
        }

    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({message: `Method ${req.method} not allowed`})
    }
}