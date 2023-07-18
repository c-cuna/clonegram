import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method == 'POST'){
        const { username, password } = req.body;
        const body = JSON.stringify({
            username,
            password
        });
        try{
            const url = process.env.NEXT_PUBLIC_SERVER_HTTP_HOST + "/accounts/login/";
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
                            // secure: process.env.NODE_ENV != 'development',
                            maxAge: 60 * 30,
                            sameSite: 'strict',
                            path: '/api/'
                        }
                    ),
                    cookie.serialize(
                        'refresh', data.refresh, {
                            httpOnly: true,
                            // secure: process.env.NODE_ENV != 'development',
                            maxAge: 60 * 60 * 24,
                            sameSite: 'strict',
                            path: '/api/'
                        }
                    ),
                ])

                return res.status(200).json({
                    message: 'Logged in successfully'
                })
            } 
            else{
                // APIRes.text().then(text => {console.log(text)})
                return res.status(APIRes.status).json({message: 'Authentication Failed'});
            }
        } catch(err){
            console.log(err)
            return res.status(500).json({ error: 'Internal Server Error' });
        }

    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({message: `Method ${req.method} not allowed`})
    }
}