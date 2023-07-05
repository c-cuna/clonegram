import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { API_BASE } from '../../../constants/constants';
import formidable from "formidable";
import fs from "fs";
import { Blob } from "buffer";

export const config = {
    api: {
        bodyParser: false,
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == 'POST') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (!access) {
            return res.status(401).json({
                error: 'User unauthorized to make this request'
            });
        }
        try {
            const form = new formidable.IncomingForm();
            const formData = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
                form.parse(req, async (err, fields, files) => {
                    if (err) reject(err);
                    resolve({ fields, files });
                });
            });

            let newFormData = new FormData();
            const { image_url }: any = formData.files;
            const { description }: any = formData.fields;
            const fileObject = fs.readFileSync(image_url.filepath);
            const image: any = new Blob([fileObject]);

            newFormData.append("image_url", image, image_url.originalFilename);
            newFormData.append('description', description);
            const url = API_BASE + "/posts/";

            const APIRes = await fetch(url, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${access}`,
                },
                body: newFormData,
                credentials: "include"
            })
            const data = await APIRes.json();

            if (APIRes.status === 200) {
                res.status(200).json([
                    ...data,
                ]);
            } else {
                APIRes.text().then(text => {console.log(text)})
                res.status(APIRes.status).json({
                    error: data.error
                });
            }
        } catch (err) {
            res.status(500).json({ 
                error: 'Internal Server Error'
            });
        }

    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: `Method ${req.method} not allowed` })
    }
}